import { type NextPage } from "next";
import Link from "next/link";
import { useState } from "react";
import getFormattedDate from "~/components/Fn/getFormattedDate";
import InternalLink from "~/components/InternalLink";
import Layout from "~/components/Layout";
import OrderedProduct from "~/components/Products/OrderedProduct";
import type { OrderPlacedOnType } from "~/customTypes";
import { api } from "~/utils/api";

const OrdersPage: NextPage = () => {
  const [createdAfter, setCreatedAfter] = useState<
    OrderPlacedOnType | undefined
  >(undefined);

  const { data: orders } = api.order.getAll.useQuery({
    createdAfter,
  });

  function OrderLabel() {
    if (!orders || orders.length < 1) return <span>0 orders placed in </span>;
    return <span>{orders.length} orders placed in </span>;
  }

  return (
    <Layout
      title="Your orders | Toshi"
      description="All of your orders on Toshi.com"
      className="flex flex-col gap-2 px-5"
    >
      <h1 className="my-3 text-3xl md:text-4xl">Your Orders</h1>
      <div>
        <OrderLabel />
        <select
          title="Filter by order date"
          className="mb-2 rounded-md bg-neutral-200 px-2 py-0.5"
          onChange={(e) => {
            const value = e.currentTarget.value
              ? (e.currentTarget.value as OrderPlacedOnType)
              : undefined;
            setCreatedAfter(value);
          }}
        >
          <option value={"pastDay"} selected={createdAfter === "pastDay"}>
            past day
          </option>
          <option value={"pastWeek"} selected={createdAfter === "pastWeek"}>
            past week
          </option>
          <option value={"pastMonth"} selected={createdAfter === "pastMonth"}>
            past month
          </option>
          <option
            value={"pastThreeMonths"}
            selected={createdAfter === "pastThreeMonths"}
          >
            past 3 months
          </option>
          <option
            value={"pastSixMonths"}
            selected={createdAfter === "pastSixMonths"}
          >
            past 6 months
          </option>
          <option value={"pastYear"} selected={createdAfter === "pastYear"}>
            past year
          </option>
          <option
            value={undefined}
            selected={typeof createdAfter === "undefined"}
          >
            anytime
          </option>
        </select>
      </div>
      {orders && orders.length > 0 ? (
        <div className="flex flex-col">
          <div className="grid gap-8 md:gap-16">
            {orders.map((order) => {
              const { id, products, total, createdAt, deliveredAt } = order;
              const orderLink = `/account/orders/${id}`;

              return (
                <div
                  key={id}
                  className="flex flex-col gap-4 rounded-md border border-neutral-300 pb-4"
                >
                  <div className="flex flex-col gap-2 rounded-t-md border-b border-b-neutral-300 bg-neutral-100 px-4 py-3 text-neutral-600 md:flex-row md:gap-16">
                    <div className="flex items-start md:flex-col">
                      <h2 className="md:text-sm">ORDER PLACED</h2>
                      <span className="mr-2 md:hidden">:</span>
                      <span>{getFormattedDate(createdAt)}</span>
                    </div>
                    <div className="flex items-start md:flex-col">
                      <h2 className="md:text-sm">DELIVERED ON</h2>
                      <span className="mr-2 md:hidden">:</span>
                      <span>{getFormattedDate(deliveredAt)}</span>
                    </div>
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
                      <Link
                        href={orderLink}
                        className="w-full rounded-md bg-neutral-200 py-1 text-center transition-colors hover:bg-neutral-300"
                      >
                        Order details
                      </Link>
                      <Link
                        href={`${orderLink}#invoice`}
                        className="w-full rounded-md bg-neutral-200 py-1 text-center transition-colors hover:bg-neutral-300"
                      >
                        View invoice
                      </Link>
                    </div>
                  </div>
                  <div className="flex flex-col justify-between px-4 md:flex-row">
                    <div className="order-last hidden w-48 flex-col gap-2 md:flex">
                      <Link
                        href={orderLink}
                        className="w-full rounded-md bg-neutral-200 py-1 text-center transition-colors hover:bg-neutral-300"
                      >
                        Order details
                      </Link>
                      <Link
                        href={`${orderLink}#invoice`}
                        className="w-full rounded-md bg-neutral-200 py-1 text-center transition-colors hover:bg-neutral-300"
                      >
                        View invoice
                      </Link>
                    </div>
                    <div className="flex flex-col gap-8 md:gap-4">
                      {products.map((product) => (
                        <OrderedProduct
                          key={product.product.id}
                          product={product}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        <div className="self-center pt-12 text-lg md:text-center">
          <span>You have no previous orders.</span>
          <div>
            <InternalLink href="/" className="text-lg">
              Continue shopping{" "}
            </InternalLink>
            <span>or change the order date filter above.</span>
          </div>
        </div>
      )}
    </Layout>
  );
};

export default OrdersPage;
