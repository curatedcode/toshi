import type { NextPage } from "next";
import { useSession } from "next-auth/react";
import CustomLink from "~/components/Input/CustomLink";
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
            <div className="flex h-fit w-full flex-col items-end gap-40 px-3 pb-3 pt-4 md:hidden">
              <div className="flex w-fit flex-col gap-2">
                <div className="flex gap-1 text-lg">
                  <span>
                    Subtotal ({totals?.quantity}{" "}
                    {totals.quantity > 1 ? "items" : "item"}):
                  </span>
                  <span className="text-xl font-semibold text-toshi-green">
                    ${totals?.totalPrice}
                  </span>
                </div>
                <CustomLink href={"/checkout"} style="toshi">
                  Proceed to checkout
                </CustomLink>
              </div>
            </div>
          </div>
          <div className="mt-6 hidden h-fit flex-col gap-4 rounded-md bg-neutral-200 px-3 pb-3 pt-2 md:flex">
            <div className="flex gap-3 text-lg">
              <span className="whitespace-nowrap">
                Subtotal ({totals?.quantity}{" "}
                {totals.quantity > 1 ? "items" : "item"}):
              </span>
              <span className="text-xl font-semibold">
                ${totals?.totalPrice}
              </span>
            </div>
            <CustomLink href={"/checkout"} style="toshi">
              Proceed to checkout
            </CustomLink>
          </div>
        </div>
      ) : (
        <p className="mt-2 text-lg">
          Behold, the noble and brave empty shopping cart, patiently waiting for
          its destined purpose amidst a sea of products!{" "}
          <InternalLink href="/" className="text-lg">
            Continue shopping.{" "}
          </InternalLink>
          or{" "}
          <InternalLink href="/account/lists" className="text-lg">
            view your lists.
          </InternalLink>
        </p>
      )}
    </Layout>
  );
};

export default Cart;
