import { type NextPage } from "next";
import { useRouter } from "next/router";
import { useEffect } from "react";
import getFormattedDate from "~/components/Fn/getFormattedDate";
import Button from "~/components/Input/Button";
import Layout from "~/components/Layout";
import LogoWithText from "~/components/LogoWithText";
import OrderedProduct from "~/components/Products/OrderedProduct";
import { api } from "~/utils/api";

const OrderPage: NextPage = () => {
  const { query } = useRouter();
  const orderId = query.slug as string;

  const printQuery = typeof query.print === "string" && query.print === "true";

  const { data: order } = api.order.getOne.useQuery({ orderId });

  const {
    id = "",
    products,
    createdAt = "",
    deliveredAt = "",
    total,
    status = "",
  } = order || {};

  useEffect(() => {
    if (printQuery) {
      print();
    }
  }, [printQuery]);

  const createdDate = getFormattedDate(createdAt);

  return (
    <>
      <Layout
        title={`${
          createdAt ? `Your order from ${createdDate}` : "Your previous order"
        } | Toshi`}
        description="Your previous order on Toshi.com"
        className="flex flex-col px-5 print:hidden"
      >
        <h1 className="my-3 text-3xl md:text-4xl">
          Your order from {createdDate}
        </h1>
        <div className="flex flex-col gap-4 rounded-md border border-neutral-300 pb-4">
          <div className="flex flex-col gap-2 rounded-t-md border-b border-b-neutral-300 bg-neutral-100 px-4 py-3 text-neutral-600 md:flex-row md:gap-16">
            <div className="flex items-start md:flex-col">
              <h2 className="md:text-sm">ORDER PLACED</h2>
              <span className="mr-2 md:hidden">:</span>
              <span>{createdDate}</span>
            </div>
            <div className="flex items-start md:flex-col">
              <h2 className="md:text-sm">STATUS</h2>
              <span className="mr-2 md:hidden">:</span>
              <span>{status.toUpperCase()}</span>
            </div>
            {status === "delivered" && (
              <div className="flex items-start md:flex-col">
                <h2 className="md:text-sm">DELIVERED ON</h2>
                <span className="mr-2 md:hidden">:</span>
                <span>{getFormattedDate(deliveredAt as Date)}</span>
              </div>
            )}
            <div className="flex items-start md:flex-col">
              <h2 className="md:text-sm">TOTAL</h2>
              <span className="mr-2 md:hidden">:</span>
              <span>${total}</span>
            </div>
            <div className="flex flex-col items-start md:ml-auto">
              <div className="flex">
                <h2 className="md:text-sm">ORDER #</h2>
                <span className="md:hidden">:</span>
              </div>
              <span>{id.toUpperCase()}</span>
            </div>
            <div className="flex w-full flex-col gap-2 sm:flex-row md:hidden">
              <Button onClick={() => print()} className="w-full min-w-[12rem]">
                Print invoice
              </Button>
            </div>
          </div>
          <div className="flex flex-col justify-between gap-4 px-4 md:flex-row">
            <div className="order-last hidden w-48 flex-col gap-2 md:flex">
              <Button onClick={() => print()} className="w-full min-w-[12rem]">
                Print invoice
              </Button>
            </div>
            <div className="flex flex-col gap-8 sm:grid sm:grid-cols-2 md:grid-cols-4 md:gap-4">
              {products?.map((product) => (
                <OrderedProduct key={product.product.id} product={product} />
              ))}
            </div>
          </div>
        </div>
      </Layout>
      <div className="hidden flex-col px-5 pt-4 print:flex">
        <LogoWithText color="red" className="mb-12 self-center" />
        <div className="mb-4 ml-1 grid">
          <div className="flex gap-1">
            <span className="font-semibold">Order Placed:</span>
            <span>{createdDate}</span>
          </div>
          <div className="flex gap-1">
            <span className="font-semibold">Order Number:</span>
            <span>{id.toUpperCase()}</span>
          </div>
          <div className="flex gap-1">
            <span className="font-semibold">Order Total:</span>
            <span>${total}</span>
          </div>
        </div>
        <div className="mb-4 flex flex-col border-2 border-black">
          <h1 className="w-full border-b-2 border-black py-1 text-center text-xl font-semibold">
            Delivered on {createdDate}
          </h1>
          <div className="flex flex-col divide-y-2 divide-black">
            <div className="px-3 py-2">
              <div className="mb-2 flex justify-between">
                <h2 className="font-semibold">Items Ordered</h2>
                <h2 className="font-semibold">Price</h2>
              </div>
              <div className="flex flex-col gap-2">
                {products?.map((productData) => {
                  const { product, priceAtPurchase } = productData;
                  const { id, name, company } = product;

                  return (
                    <div key={id} className="flex justify-between">
                      <div className="flex flex-col">
                        <span>{name}</span>
                        <span className="text-sm">Sold by: {company.name}</span>
                      </div>
                      <span>${priceAtPurchase}</span>
                    </div>
                  );
                })}
              </div>
            </div>
            <div className="px-3 py-2">
              <h2 className="mb-2 font-semibold">Delivery Address</h2>
              <div className="flex justify-between">
                <div className="flex flex-col">
                  <span>Street address</span>
                  <span>City</span>
                  <span>State</span>
                  <span>Zip</span>
                  <span>Country</span>
                </div>
                <div className="grid auto-cols-min grid-cols-2">
                  <span className="justify-self-end">Item(s) Subtotal: </span>
                  <span className="justify-self-end">$444</span>
                  <span className="justify-self-end">Shipping: </span>
                  <span className="justify-self-end">$10</span>
                  <span className="justify-self-end">Total: </span>
                  <span className="justify-self-end">${total}</span>
                  <span className="justify-self-end">Discount: </span>
                  <span className="justify-self-end">0%</span>
                  <span className="mt-1 justify-self-end border-t border-black pt-1 font-semibold">
                    Grand Total:{" "}
                  </span>
                  <span className="mt-1 border-t border-black pt-1 text-end">
                    ${total}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="mb-4 flex flex-col border-2 border-black">
          <h1 className="w-full border-b-2 border-black py-1 text-center text-xl font-semibold">
            Payment Information
          </h1>
          <div className="flex flex-col gap-4 px-3 py-4">
            <div className="flex flex-col gap-2">
              <h2 className="font-semibold">Payment Method</h2>
              <span>Credit/Debit Card | Ending in: 4444</span>
            </div>
            <div className="flex flex-col gap-2">
              <h2 className="font-semibold">Invoice Address</h2>
              <div className="flex flex-col">
                <span>Street address</span>
                <span>City</span>
                <span>State</span>
                <span>Zip</span>
                <span>Country</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default OrderPage;
