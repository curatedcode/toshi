import type { NextPage } from "next";
import { useSession } from "next-auth/react";
import Link from "next/link";
import Button from "~/components/Input/Button";
import InternalLink from "~/components/InternalLink";
import Layout from "~/components/Layout";
import CartProduct from "~/components/Products/CartProduct";
import { api } from "~/utils/api";

const Cart: NextPage = () => {
  const { status } = useSession();

  let cookieId: string | undefined = undefined;

  if (status !== "authenticated" && typeof window !== "undefined") {
    cookieId = localStorage.getItem("toshiCart") ?? undefined;
  }

  const { data, refetch } = api.cart.get.useQuery({ cookieId });

  const { products } = data || {};

  const allProducts = products?.map((data) => ({
    totalPrice: data.quantity * data.product.price,
    quantity: data.quantity,
  }));

  const totals =
    allProducts && allProducts.length > 0
      ? allProducts.reduce((prev, total) => ({
          totalPrice: (total.totalPrice += prev.totalPrice),
          quantity: (total.quantity += prev.quantity),
        }))
      : { totalPrice: 0, quantity: 0 };

  return (
    <Layout title="My cart | Toshi" description="Your cart on Toshi.com">
      <h1 className="my-3 text-3xl md:text-4xl">Shopping Cart</h1>
      {allProducts && allProducts.length > 0 ? (
        <div className="flex flex-col justify-between gap-2 md:flex-row md:gap-12">
          <div className="flex w-full flex-col divide-y divide-neutral-300">
            {products &&
              products.map((data) => (
                <CartProduct
                  key={data.product.id}
                  data={data}
                  cookieId={cookieId}
                  refetch={refetch}
                />
              ))}
            <div className="flex h-fit justify-end px-3 pb-6 pt-4 md:hidden">
              <div className="flex w-fit flex-col gap-2">
                <div className="flex gap-1 text-lg font-semibold">
                  <span>Subtotal ({totals?.quantity} items):</span>
                  <span className="text-xl text-toshi-red">
                    ${totals?.totalPrice}
                  </span>
                </div>
                <Button link={{ href: "/checkout" }}>
                  Proceed to checkout
                </Button>
              </div>
            </div>
          </div>
          <div className="mt-6 hidden h-fit flex-col gap-2 bg-neutral-100 px-3 pb-6 pt-2 md:flex">
            <div className="flex gap-1 text-lg font-semibold">
              <span className="whitespace-nowrap">
                Subtotal ({totals?.quantity} items):
              </span>
              <span className="text-xl text-toshi-red">
                ${totals?.totalPrice}
              </span>
            </div>
            <Link
              href={"/checkout"}
              className="whitespace-nowrap rounded-md bg-toshi-red px-2 py-1 text-center font-semibold text-white"
            >
              Proceed to checkout
            </Link>
          </div>
        </div>
      ) : (
        <p className="mt-2 text-lg">
          No items in your cart.{" "}
          <InternalLink href="/" className="text-lg">
            Continue shopping.
          </InternalLink>
        </p>
      )}
    </Layout>
  );
};

export default Cart;
