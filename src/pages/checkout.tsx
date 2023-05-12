/* eslint-disable @typescript-eslint/no-misused-promises */
import { zodResolver } from "@hookform/resolvers/zod";
import type { NextPage } from "next";
import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import useLocalCart from "~/components/Fn/useLocalCart";
import Layout from "~/components/Layout";
import type { CheckoutSteps } from "~/customTypes";
import { api } from "~/utils/api";
import TextInputField from "~/components/TextInputField";
import {
  max_cardNumber_char,
  max_city_char,
  max_country_char,
  max_firstName_char,
  max_lastName_char,
  max_securityCode_char,
  max_state_char,
  max_streetAddress_char,
  max_zipCode_char,
} from "~/customVariables";
import Image from "~/components/Image";
import InternalLink from "~/components/InternalLink";
import { paymentSchema, shippingAddressSchema } from "~/customVariables";
import type { z } from "zod";
import Link from "next/link";
import getFormattedDate from "~/components/Fn/getFormattedDate";

const CheckoutPage: NextPage = () => {
  const [step, setStep] = useState<CheckoutSteps>("address");

  const { cookieId } = useLocalCart();

  const { data } = api.cart.checkout.useQuery({ cookieId });

  const [shippingComplete, setShippingComplete] = useState(false);
  const [paymentComplete, setPaymentComplete] = useState(false);
  const [orderComplete, setOrderComplete] = useState(true);

  const {
    handleSubmit: handleAddressSubmit,
    formState: { errors: addressErrors },
    getValues: getAddressValues,
    register: registerAddress,
  } = useForm<z.infer<typeof shippingAddressSchema>>({
    resolver: zodResolver(shippingAddressSchema),
  });

  const firstNameAddressError = addressErrors.firstName?.message;
  const lastNameAddressError = addressErrors.lastName?.message;
  const streetAddressError = addressErrors.streetAddress?.message;
  const cityError = addressErrors.city?.message;
  const stateError = addressErrors.state?.message;
  const zipCodeError = addressErrors.zipCode?.message;
  const countryError = addressErrors.country?.message;

  const {
    handleSubmit: handlePaymentSubmit,
    formState: { errors: paymentErrors },
    getValues: getPaymentValues,
    register: registerPayment,
  } = useForm<z.infer<typeof paymentSchema>>({
    resolver: zodResolver(paymentSchema),
  });

  const firstNamePaymentError = paymentErrors.firstName?.message;
  const lastNamePaymentError = paymentErrors.lastName?.message;
  const cardNumberError = paymentErrors.cardNumber?.message;
  const securityCodeError = paymentErrors.securityCode?.message;

  const [billingSameAsShipping, setBillingSameAsShipping] = useState(true);

  const streetBillingAddressError = paymentErrors.streetAddress?.message;
  const cityBillingError = paymentErrors.city?.message;
  const stateBillingError = paymentErrors.state?.message;
  const zipCodeBillingError = paymentErrors.zipCode?.message;
  const countryBillingError = paymentErrors.country?.message;

  function submitPayment() {
    setPaymentComplete(true);
    setStep("review");
  }

  function submitShipping() {
    setShippingComplete(true);
    setStep("payment");
  }

  const linkRef = useRef<HTMLAnchorElement>(null);

  const { mutate: createOrder, data: orderData } = api.order.create.useMutation(
    {
      onSuccess: () => {
        setOrderComplete(true);
        linkRef.current?.click();
      },
    }
  );

  function submitOrder() {
    if (!shippingComplete || !paymentComplete) {
      return;
    }
    const shippingAddress = {
      firstName: getAddressValues("firstName"),
      lastName: getAddressValues("lastName"),
      streetAddress: getAddressValues("streetAddress"),
      city: getAddressValues("city"),
      state: getAddressValues("state"),
      zipCode: getAddressValues("zipCode"),
      country: getAddressValues("zipCode"),
    };

    if (billingSameAsShipping) {
      createOrder({
        billing: {
          ...shippingAddress,
          cardNumber: getPaymentValues("cardNumber"),
          securityCode: getPaymentValues("securityCode"),
        },
        shippingAddress,
        cookieId,
      });
      return;
    }

    createOrder({
      billing: {
        firstName: getPaymentValues("firstName"),
        lastName: getPaymentValues("lastName"),
        streetAddress: getPaymentValues("streetAddress"),
        city: getPaymentValues("city"),
        state: getPaymentValues("state"),
        zipCode: getPaymentValues("zipCode"),
        country: getPaymentValues("zipCode"),
        cardNumber: getPaymentValues("cardNumber"),
        securityCode: getPaymentValues("securityCode"),
      },
      shippingAddress,
      cookieId,
    });
    return;
  }

  useEffect(() => {
    function handleExit(e: BeforeUnloadEvent) {
      e.preventDefault();
      e.returnValue = "";
    }

    if (shippingComplete || paymentComplete) {
      if (orderComplete) {
        return;
      }

      window.addEventListener("beforeunload", handleExit);
      return () => window.removeEventListener("beforeunload", handleExit);
    }
  }, [shippingComplete, paymentComplete, orderComplete]);

  const {
    orderId = "",
    shippingAddress = { firstName: "", lastName: "" },
    estimatedDelivery = Date(),
  } = orderData || {};

  return (
    <Layout
      title="Checkout | Toshi"
      description="Checkout items on Toshi.com"
      className="flex flex-col px-5"
    >
      <div
        className={`mt-16 flex flex-col gap-1 bg-toshi-red/25 px-5 py-2 text-lg md:w-fit md:self-center ${
          orderComplete ? "" : "hidden"
        }`}
      >
        <h1 className="md:text-2xl">
          <span className="font-semibold text-toshi-red">Thank you,</span> your
          order has been placed.
        </h1>
        <div className="flex gap-1">
          <span>Order Number:</span>
          <span className="font-semibold">
            {orderId.toUpperCase()}asdfasd8f8989345asd
          </span>
        </div>
        <ul className="list-inside list-disc [&>*]:indent-2">
          <li>
            {`${data?.totalProducts ?? 0} items will be delivered to ${
              shippingAddress.firstName
            } ${shippingAddress.lastName}`}
          </li>
          <li>{`Estimated delivery ${getFormattedDate(estimatedDelivery)}`}</li>
        </ul>
        <Link
          href={"/"}
          className="mb-2 mt-4 self-center rounded-md bg-toshi-red px-4 py-1 text-white"
        >
          Continue shopping
        </Link>
      </div>
      <div className={`flex flex-col ${orderComplete ? "hidden" : ""}`}>
        <h1 className="mt-3 self-center text-2xl md:text-3xl">
          Checkout ({data?.totalProducts} items)
        </h1>
        <div className="flex flex-col gap-4 md:flex-row">
          <div className="flex w-full flex-col gap-2">
            <div className="flex flex-col justify-between gap-2 p-2 pb-0 md:flex-row md:gap-10">
              <h2 className="flex gap-4 text-xl font-semibold">
                <span>1</span>
                <span className="whitespace-nowrap">Shipping Address</span>
              </h2>
              {step === "address" && (
                <form
                  onSubmit={handleAddressSubmit(submitShipping)}
                  className="flex w-full flex-col gap-2 pl-[1.6rem] md:pl-0"
                >
                  <TextInputField
                    internalLabel="firstName"
                    visibleLabel="First Name"
                    error={firstNameAddressError}
                    maxLength={max_firstName_char}
                    {...registerAddress("firstName")}
                  />
                  <TextInputField
                    internalLabel="lastName"
                    visibleLabel="Last Name"
                    error={lastNameAddressError}
                    maxLength={max_lastName_char}
                    {...registerAddress("lastName")}
                  />
                  <TextInputField
                    internalLabel="streetAddress"
                    visibleLabel="Street Address"
                    error={streetAddressError}
                    maxLength={max_streetAddress_char}
                    {...registerAddress("streetAddress")}
                  />
                  <TextInputField
                    internalLabel="city"
                    visibleLabel="City"
                    error={cityError}
                    maxLength={max_city_char}
                    {...registerAddress("city")}
                  />
                  <TextInputField
                    internalLabel="state"
                    visibleLabel="State"
                    error={stateError}
                    maxLength={max_state_char}
                    {...registerAddress("state")}
                  />
                  <TextInputField
                    internalLabel="zipCode"
                    visibleLabel="ZIP Code"
                    error={zipCodeError}
                    maxLength={max_zipCode_char}
                    {...registerAddress("zipCode")}
                  />
                  <TextInputField
                    internalLabel="country"
                    visibleLabel="Country"
                    error={countryError}
                    maxLength={max_country_char}
                    {...registerAddress("country")}
                  />
                  <button
                    type="submit"
                    className="mb-2 mt-2 self-end rounded-md bg-toshi-red px-5 py-1 font-semibold text-white"
                  >
                    Next
                  </button>
                </form>
              )}
              <button
                type="button"
                onClick={() => setStep("address")}
                className={`justify-self-end text-sm text-sky-600 underline underline-offset-1 ${
                  step !== "address" && shippingComplete ? "" : "hidden"
                }`}
              >
                Change
              </button>
            </div>
            <div className="flex flex-col justify-between gap-2 border-y border-neutral-300 p-2 md:flex-row md:gap-10">
              <h2 className="flex gap-4 text-xl font-semibold">
                <span>2</span>
                <span className="whitespace-nowrap">Payment Method</span>
              </h2>
              {step === "payment" && (
                <form
                  onSubmit={handlePaymentSubmit(submitPayment)}
                  className="flex w-full flex-col gap-2 pl-[1.6rem] md:pl-0"
                >
                  <TextInputField
                    internalLabel="firstName"
                    visibleLabel="First Name"
                    error={firstNamePaymentError}
                    maxLength={max_firstName_char}
                    {...registerPayment("firstName")}
                  />
                  <TextInputField
                    internalLabel="lastName"
                    visibleLabel="Last Name"
                    error={lastNamePaymentError}
                    maxLength={max_lastName_char}
                    {...registerPayment("lastName")}
                  />
                  <TextInputField
                    internalLabel="cardNumber"
                    visibleLabel="Card Number"
                    error={cardNumberError}
                    maxLength={max_cardNumber_char}
                    {...registerPayment("cardNumber")}
                  />
                  <TextInputField
                    internalLabel="securityCode"
                    visibleLabel="Security Code (CVC)"
                    error={securityCodeError}
                    maxLength={max_securityCode_char}
                    className="w-36"
                    {...registerPayment("securityCode")}
                  />
                  <div className="flex items-center gap-2">
                    <input
                      id="billingSameAsShipping"
                      type="checkbox"
                      checked={billingSameAsShipping}
                      className="hover:cursor-pointer"
                      onChange={(e) =>
                        setBillingSameAsShipping(e.currentTarget.checked)
                      }
                    />
                    <label
                      htmlFor="billingSameAsShipping"
                      className="font-semibold hover:cursor-pointer"
                    >
                      Billing address same as shipping address
                    </label>
                  </div>
                  <div
                    className={`mt-3 flex flex-col gap-2 border-t border-neutral-300 pt-4 ${
                      billingSameAsShipping ? "hidden" : ""
                    }`}
                  >
                    <h3 className="mb-1 whitespace-nowrap text-xl font-semibold">
                      Billing Address
                    </h3>
                    <TextInputField
                      internalLabel="streetAddress"
                      visibleLabel="Street Address"
                      error={streetBillingAddressError}
                      maxLength={max_streetAddress_char}
                      value={
                        billingSameAsShipping
                          ? getAddressValues("streetAddress")
                          : undefined
                      }
                      {...registerPayment("streetAddress")}
                    />
                    <TextInputField
                      internalLabel="city"
                      visibleLabel="City"
                      error={cityBillingError}
                      maxLength={max_city_char}
                      value={
                        billingSameAsShipping
                          ? getAddressValues("city")
                          : undefined
                      }
                      {...registerPayment("city")}
                    />
                    <TextInputField
                      internalLabel="state"
                      visibleLabel="State"
                      error={stateBillingError}
                      maxLength={max_state_char}
                      value={
                        billingSameAsShipping
                          ? getAddressValues("state")
                          : undefined
                      }
                      {...registerPayment("state")}
                    />
                    <TextInputField
                      internalLabel="zipCode"
                      visibleLabel="ZIP Code"
                      error={zipCodeBillingError}
                      maxLength={max_zipCode_char}
                      value={
                        billingSameAsShipping
                          ? getAddressValues("zipCode")
                          : undefined
                      }
                      {...registerPayment("zipCode")}
                    />
                    <TextInputField
                      internalLabel="country"
                      visibleLabel="Country"
                      error={countryBillingError}
                      maxLength={max_country_char}
                      value={
                        billingSameAsShipping
                          ? getAddressValues("country")
                          : undefined
                      }
                      {...registerPayment("country")}
                    />
                  </div>
                  <button
                    type="submit"
                    className="mb-2 mt-2 self-end rounded-md bg-toshi-red px-5 py-1 font-semibold text-white"
                  >
                    Next
                  </button>
                </form>
              )}
              <button
                type="button"
                onClick={() => setStep("payment")}
                className={`text-sm text-sky-600 underline underline-offset-1 ${
                  step !== "payment" && paymentComplete ? "" : "hidden"
                }`}
              >
                Change
              </button>
            </div>
            <div className="flex flex-col gap-2 px-2">
              <h2 className="flex gap-4 text-xl font-semibold">
                <span>3</span>
                <span className="whitespace-nowrap">Review items</span>
              </h2>
              {step === "review" && (
                <div className="ml-[1.6rem] flex flex-col gap-4 divide-y divide-neutral-300 md:divide-y-0">
                  {data?.cart?.map((item, index) => {
                    const { data, quantity } = item;
                    const { id, name, price, images, company } = data;

                    return (
                      <div
                        key={id}
                        className={`flex flex-col gap-2 pb-1 md:flex-row md:py-0 ${
                          index === 0 ? "pt-3" : "pt-6"
                        }`}
                      >
                        <Image
                          alt={name}
                          src={images[0]?.url}
                          height={64}
                          width={48}
                          className="w-full rounded-md md:max-w-[12rem]"
                        />
                        <div className="flex flex-col">
                          <span className="text-lg font-semibold">{name}</span>
                          <span className="text-toshi-red">${price}</span>
                          <span>Quantity: {quantity}</span>
                          <span>Sold by: {company.name}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
          <aside className="mt-2 h-fit w-full divide-y divide-neutral-300 rounded-md border border-neutral-300 p-3 md:mt-0 md:max-w-xs">
            <div className="flex flex-col gap-1 pb-2">
              <Link href={""} className="hidden" ref={linkRef} />
              <button
                type="button"
                className="w-full rounded-md bg-toshi-red px-2 py-1 text-center font-semibold text-white disabled:cursor-not-allowed disabled:bg-toshi-red/70"
                onClick={submitOrder}
                title={
                  !shippingComplete || !paymentComplete
                    ? "Please fill out all fields"
                    : ""
                }
                disabled={!shippingComplete || !paymentComplete}
              >
                Place your order
              </button>
              <p className="px-2 text-sm">
                By submitting your order you agree to our{" "}
                <InternalLink
                  href={"/policies/privacy-notice"}
                  className="text-sm"
                >
                  Privacy Notice
                </InternalLink>
                .
              </p>
            </div>
            <div className="flex flex-col gap-1 p-1 pb-2">
              <h2 className="text-xl font-semibold">Order Summary</h2>
              <div className="flex justify-between gap-2">
                <span>Items:</span>
                <span>${data?.totalBeforeTax}</span>
              </div>
              <div className="flex justify-between gap-2">
                <span>Shipping and handling</span>
                <span>$0.00</span>
              </div>
              <div className="flex justify-between gap-2">
                <span>Total before tax:</span>
                <span>${data?.totalBeforeTax}</span>
              </div>
              <div className="flex justify-between gap-2">
                <span>Tax to be collected:</span>
                <span>${data?.taxToBeCollected}</span>
              </div>
            </div>
            <div className="flex justify-between gap-2 p-1 pb-0 text-xl font-semibold text-toshi-red">
              <span>Order total:</span>
              <span>${data?.totalAfterTax}</span>
            </div>
          </aside>
        </div>
      </div>
    </Layout>
  );
};

export default CheckoutPage;
