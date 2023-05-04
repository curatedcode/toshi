/* eslint-disable @typescript-eslint/no-misused-promises */
import { type NextPage } from "next";
import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import Layout from "~/components/Layout";
import { api } from "~/utils/api";
import type {
  AddressFormProps,
  EmailFormProps,
  FormProps,
  NameFormProps,
  PhoneNumberFormProps,
} from "~/customTypes";
import { useQueryClient } from "@tanstack/react-query";
import TextInputField from "~/components/TextInputField";

const SettingsPage: NextPage = () => {
  const { data: settings, refetch, isLoading } = api.user.settings.useQuery();
  const [editName, setEditName] = useState(false);
  const [editEmail, setEditEmail] = useState(false);
  const [editPhoneNumber, setEditPhoneNumber] = useState(false);
  const [editPassword, setEditPassword] = useState(false);
  const [editAddress, setEditAddress] = useState(false);

  // warn before exit if any field is active
  useEffect(() => {
    function handleExit(e: BeforeUnloadEvent) {
      e.preventDefault();
      e.returnValue = "";
    }
    if (
      editName ||
      editEmail ||
      editPhoneNumber ||
      editPassword ||
      editAddress
    ) {
      window.addEventListener("beforeunload", handleExit);
      return () => window.removeEventListener("beforeunload", handleExit);
    }
  }, [editName, editEmail, editPhoneNumber, editPassword, editAddress]);

  const placeholder = isLoading ? "" : "Not set";

  const name =
    settings?.firstName && settings.lastName
      ? `${settings?.firstName ?? ""} ${settings?.lastName ?? ""}`
      : placeholder;

  return (
    <Layout
      title="Settings | Toshi"
      description="Edit your account settings on Toshi.com"
      className="flex justify-center px-2"
    >
      <div className="mt-12 grid w-full max-w-lg">
        <h1 className="mb-3 ml-1 text-3xl md:text-4xl">Your info</h1>
        <div className="grid divide-y-2 divide-neutral-200 rounded-md border-2 border-neutral-200">
          <div
            className={`flex justify-between px-3 py-2 ${
              editName ? "hidden" : ""
            }`}
          >
            <div>
              <h2 className="text-lg font-semibold">Full Name</h2>
              <span>{name}</span>
            </div>
            <button
              type="button"
              onClick={() => setEditName(true)}
              title="Edit name"
              className="h-fit w-20 rounded-md bg-neutral-200 px-2 py-1 transition-colors focus-within:outline-neutral-500 hover:bg-neutral-300"
            >
              Edit
            </button>
          </div>
          <NameForm
            hidden={!editName}
            setHidden={setEditName}
            initialName={{
              firstName: settings?.firstName,
              lastName: settings?.lastName,
            }}
            refetch={refetch}
          />
          <div
            className={`flex justify-between px-3 py-2 ${
              editEmail ? "hidden" : ""
            }`}
          >
            <div>
              <h2 className="text-lg font-semibold">Email</h2>
              <span>{settings?.email ?? placeholder}</span>
            </div>
            <button
              type="button"
              onClick={() => setEditEmail(true)}
              title="Edit email"
              className="h-fit w-20 rounded-md bg-neutral-200 px-2 py-1 transition-colors focus-within:outline-neutral-500 hover:bg-neutral-300"
            >
              Edit
            </button>
          </div>
          <EmailForm
            hidden={!editEmail}
            setHidden={setEditEmail}
            initialEmail={settings?.email}
            refetch={refetch}
          />
          <div
            className={`flex justify-between px-3 py-2 ${
              editPhoneNumber ? "hidden" : ""
            }`}
          >
            <div>
              <h2 className="text-lg font-semibold">Phone Number</h2>
              <span>{settings?.phoneNumber ?? placeholder}</span>
            </div>
            <button
              type="button"
              onClick={() => setEditPhoneNumber(true)}
              title="Edit phone number"
              className="h-fit w-20 rounded-md bg-neutral-200 px-2 py-1 transition-colors focus-within:outline-neutral-500 hover:bg-neutral-300"
            >
              Edit
            </button>
          </div>
          <PhoneNumberForm
            hidden={!editPhoneNumber}
            setHidden={setEditPhoneNumber}
            initialPhoneNumber={settings?.phoneNumber}
            refetch={refetch}
          />
          <div
            className={`flex justify-between px-3 py-2 ${
              editPassword ? "hidden" : ""
            }`}
          >
            <div>
              <h2 className="text-lg font-semibold">Password</h2>
              <span className="">*****</span>
            </div>
            <button
              type="button"
              onClick={() => setEditPassword}
              title="Edit password"
              className="h-fit w-20 rounded-md bg-neutral-200 px-2 py-1 transition-colors focus-within:outline-neutral-500 hover:bg-neutral-300"
            >
              Edit
            </button>
          </div>
          <PasswordForm
            hidden={!editPassword}
            setHidden={setEditPassword}
            refetch={refetch}
          />
          <div
            className={`flex justify-between px-3 py-2 ${
              editAddress ? "hidden" : ""
            }`}
          >
            <div>
              <h2 className="text-lg font-semibold">Address</h2>
              <div className="flex flex-col">
                <span>{settings?.address?.streetAddress ?? placeholder}</span>
                <span>{settings?.address?.city ?? placeholder}</span>
                <span>{settings?.address?.state ?? placeholder}</span>
                <span>{settings?.address?.zipCode ?? placeholder}</span>
                <span>{settings?.address?.country ?? placeholder}</span>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setEditAddress(true)}
              title="Edit address"
              className="h-fit w-20 rounded-md bg-neutral-200 px-2 py-1 transition-colors focus-within:outline-neutral-500 hover:bg-neutral-300"
            >
              Edit
            </button>
          </div>
          <AddressForm
            hidden={!editAddress}
            addressId={settings?.address?.id}
            setHidden={setEditAddress}
            initialAddress={settings?.address}
            refetch={refetch}
          />
        </div>
      </div>
    </Layout>
  );
};

function FormButtons({
  isLoading,
  resetForm,
}: {
  isLoading: boolean;
  resetForm: () => void;
}) {
  return (
    <div className="flex flex-col gap-2">
      <button
        type="submit"
        disabled={isLoading}
        className="h-fit w-20 rounded-md bg-neutral-200 px-2 py-1 transition-colors focus-within:outline-neutral-500 hover:bg-neutral-300"
      >
        {isLoading ? "Saving" : "Save"}
      </button>
      <button
        type="button"
        disabled={isLoading}
        className="h-fit w-20 rounded-md bg-neutral-200 px-2 py-1 transition-colors focus-within:outline-neutral-500 hover:bg-neutral-300"
        onClick={resetForm}
      >
        Cancel
      </button>
    </div>
  );
}

function NameForm({ hidden, setHidden, initialName, refetch }: NameFormProps) {
  const schema = z.object({
    firstName: z
      .string()
      .min(1, { message: "Please enter your first name" })
      .max(25, { message: "First name must not be longer than 25 characters" }),
    lastName: z
      .string()
      .min(1, { message: "Please enter your last name" })
      .max(25, { message: "Last name must not be longer than 25 characters" }),
  });

  const {
    register,
    handleSubmit,
    getValues,
    formState: { errors },
    reset,
  } = useForm<z.infer<typeof schema>>({ resolver: zodResolver(schema) });

  const queryClient = useQueryClient();

  const { mutate, isLoading } = api.user.updateName.useMutation({
    onSuccess: async () => {
      setHidden(false);
      await queryClient.invalidateQueries({ queryKey: [["user", "fullName"]] });
      refetch();
    },
  });

  const onSubmit = () =>
    mutate({
      firstName: getValues("firstName"),
      lastName: getValues("lastName"),
    });

  const firstNameError = errors.firstName?.message;
  const lastNameError = errors.lastName?.message;

  function resetForm() {
    setHidden(false);
    reset();
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className={`flex justify-between px-3 py-2 ${hidden ? "hidden" : ""}`}
    >
      <div className="flex flex-col gap-2">
        <TextInputField
          internalLabel="firstName"
          visibleLabel="First Name"
          maxLength={25}
          error={firstNameError}
          defaultValue={initialName?.firstName}
          {...register("firstName")}
        />
        <TextInputField
          internalLabel="lastName"
          visibleLabel="Last Name"
          maxLength={25}
          error={lastNameError}
          defaultValue={initialName?.lastName}
          {...register("lastName")}
        />
      </div>
      <FormButtons isLoading={isLoading} resetForm={resetForm} />
    </form>
  );
}

function EmailForm({
  hidden,
  setHidden,
  initialEmail,
  refetch,
}: EmailFormProps) {
  const schema = z.object({
    email: z
      .string()
      .min(1, { message: "Please enter your email" })
      .max(64, { message: "Email must not be longer than 64 characters" })
      .email({ message: "Email is incorrect or invalid" }),
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
    getValues,
    reset,
  } = useForm<z.infer<typeof schema>>({ resolver: zodResolver(schema) });

  const { mutate, isLoading } = api.user.updateEmail.useMutation({
    onSuccess: () => {
      setHidden(false);
      refetch();
    },
  });

  const onSubmit = () => mutate({ email: getValues("email") });

  const error = errors.email?.message;

  function resetForm() {
    setHidden(false);
    reset();
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className={`flex justify-between px-3 py-2 ${hidden ? "hidden" : ""}`}
    >
      <div className="flex flex-col">
        <TextInputField
          internalLabel="email"
          visibleLabel="Email"
          maxLength={64}
          error={error}
          defaultValue={initialEmail}
          {...register("email")}
        />
      </div>
      <FormButtons isLoading={isLoading} resetForm={resetForm} />
    </form>
  );
}

function PhoneNumberForm({
  hidden,
  setHidden,
  initialPhoneNumber,
  refetch,
}: PhoneNumberFormProps) {
  const schema = z.object({
    phoneNumber: z
      .string()
      .max(100, {
        message: "Phone number must not be longer than 100 characters",
      })
      .regex(/^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/im, {
        message: "Phone number is incorrect or invalid",
      }),
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
    getValues,
    reset,
  } = useForm<z.infer<typeof schema>>({ resolver: zodResolver(schema) });

  const { mutate, isLoading } = api.user.updatePhoneNumber.useMutation({
    onSuccess: () => {
      setHidden(false);
      refetch();
    },
  });

  const onSubmit = () => mutate({ phoneNumber: getValues("phoneNumber") });

  const error = errors.phoneNumber?.message;

  function resetForm() {
    setHidden(false);
    reset();
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className={`flex justify-between px-3 py-2 ${hidden ? "hidden" : ""}`}
    >
      <div className="flex flex-col">
        <TextInputField
          internalLabel="phoneNUmber"
          visibleLabel="Phone Number"
          maxLength={100}
          error={error}
          defaultValue={initialPhoneNumber}
          {...register("phoneNumber")}
        />
      </div>
      <FormButtons isLoading={isLoading} resetForm={resetForm} />
    </form>
  );
}

function PasswordForm({ hidden, setHidden, refetch }: FormProps) {
  const password = useRef("");
  const confirmPassword = useRef("");

  const schema = z.object({
    currentPassword: z
      .string()
      .min(8, { message: "Password must be longer than 8 characters" })
      .max(1024, {
        message: "Password must not be longer than 1024 characters",
      }),
    password: z
      .string()
      .min(8, { message: "Password must be longer than 8 characters" })
      .max(1024, {
        message: "Password must not be longer than 1024 characters",
      })
      .refine((val) => val === confirmPassword.current, {
        message: "Passwords do not match",
      }),
    confirmPassword: z
      .string()
      .min(8, { message: "Password must be longer than 8 characters" })
      .max(1024, {
        message: "Password must not be longer than 1024 characters",
      })
      .refine((val) => val === password.current, {
        message: "Passwords do not match",
      }),
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
    getValues,
    reset,
  } = useForm<z.infer<typeof schema>>({ resolver: zodResolver(schema) });

  const { mutate, isLoading } = api.user.updatePassword.useMutation({
    onSuccess: () => {
      setHidden(false);
      refetch();
    },
  });

  const onSubmit = () =>
    mutate({
      password: getValues("password"),
      currentPassword: getValues("currentPassword"),
    });

  useEffect(() => {
    password.current = getValues("password");
    confirmPassword.current = getValues("confirmPassword");
  });

  const currentPasswordError = errors.currentPassword?.message;
  const passwordError = errors.password?.message;
  const confirmPasswordError = errors.confirmPassword?.message;

  function resetForm() {
    setHidden(false);
    reset();
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className={`flex justify-between px-3 py-2 ${hidden ? "hidden" : ""}`}
    >
      <TextInputField
        internalLabel="currentPassword"
        visibleLabel="Current password"
        maxLength={1024}
        error={currentPasswordError}
        {...register("currentPassword")}
      />
      <TextInputField
        internalLabel="password"
        visibleLabel="New password"
        maxLength={1024}
        error={passwordError}
        {...register("password")}
      />
      <TextInputField
        internalLabel="confirmPassword"
        visibleLabel="Re-enter password"
        maxLength={25}
        error={confirmPasswordError}
        {...register("confirmPassword")}
      />
      <FormButtons isLoading={isLoading} resetForm={resetForm} />
    </form>
  );
}

function AddressForm({
  hidden,
  setHidden,
  addressId,
  initialAddress,
  refetch,
}: AddressFormProps) {
  const schema = z.object({
    streetAddress: z
      .string()
      .min(1, { message: "Please enter your street address" })
      .max(100, {
        message: "Street address must not be longer than 100 characters",
      }),
    city: z
      .string()
      .min(1, { message: "Please enter your city" })
      .max(100, { message: "City must not be longer than 100 characters" }),
    state: z
      .string()
      .min(1, { message: "Please enter your state" })
      .max(100, { message: "State must not be longer than 100 characters" }),
    country: z
      .string()
      .min(1, { message: "Please enter your country" })
      .max(100, { message: "Country must not be longer than 100 characters" }),
    zipCode: z
      .string()
      .min(5, { message: "ZIP Code must be at least 5 characters" })
      .regex(/(^\d{5}(?:[\s]?[-\s][\s]?\d{4})?$)/, {
        message: "Zip Code is incorrect or invalid",
      }),
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
    getValues,
    reset,
  } = useForm<z.infer<typeof schema>>({ resolver: zodResolver(schema) });

  const { mutate, isLoading } = api.user.updateAddress.useMutation({
    onSuccess: () => {
      setHidden(false);
      refetch();
    },
  });

  const onSubmit = () =>
    mutate({
      id: addressId,
      streetAddress: getValues("streetAddress"),
      city: getValues("city"),
      state: getValues("state"),
      zipCode: getValues("zipCode"),
      country: getValues("country"),
    });

  const streetAddressError = errors.streetAddress?.message;
  const cityError = errors.city?.message;
  const stateError = errors.state?.message;
  const zipCodeError = errors.state?.message;
  const countryError = errors.country?.message;

  function resetForm() {
    setHidden(false);
    reset();
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className={`flex justify-between px-3 py-2 ${hidden ? "hidden" : ""}`}
    >
      <div className="flex w-max flex-col">
        <TextInputField
          internalLabel="streetAddress"
          visibleLabel="Street Address"
          maxLength={100}
          error={streetAddressError}
          defaultValue={initialAddress?.streetAddress}
          {...register("streetAddress")}
        />
        <TextInputField
          internalLabel="city"
          visibleLabel="City"
          maxLength={100}
          error={cityError}
          defaultValue={initialAddress?.city}
          {...register("city")}
        />
        <TextInputField
          internalLabel="state"
          visibleLabel="State"
          maxLength={100}
          error={stateError}
          defaultValue={initialAddress?.state}
          {...register("state")}
        />
        <TextInputField
          internalLabel="zipCode"
          visibleLabel="ZIP code"
          maxLength={100}
          error={zipCodeError}
          defaultValue={initialAddress?.zipCode}
          {...register("zipCode")}
        />
        <TextInputField
          internalLabel="country"
          visibleLabel="Country"
          maxLength={100}
          error={countryError}
          defaultValue={initialAddress?.country}
          {...register("country")}
        />
      </div>
      <FormButtons isLoading={isLoading} resetForm={resetForm} />
    </form>
  );
}

export default SettingsPage;
