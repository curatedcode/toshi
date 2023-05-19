import { type NextPage } from "next";
import { signIn, useSession } from "next-auth/react";
import Link from "next/link";
import Avatar from "~/components/Avatar";
import getFormattedDate from "~/components/Fn/getFormattedDate";
import getRelativeTime from "~/components/Fn/getRelativeDate";
import Button from "~/components/Input/Button";
import InternalLink from "~/components/InternalLink";
import Layout from "~/components/Layout";
import OrderedProduct from "~/components/Products/OrderedProduct";
import Product from "~/components/Products/Product";
import { avatarUrls } from "~/customVariables";
import { api } from "~/utils/api";

const AccountPage: NextPage = () => {
  const { status } = useSession();

  const { data: user } = api.user.getCurrentProfile.useQuery();

  const AddressLine = () => {
    if (!user) return null;
    if (!user.addresses) return null;
    if (!user.addresses[0]) return null;
    const { streetAddress, city, state, zipCode, country } = user.addresses[0];

    const address = `${streetAddress}, ${city} ${state}, ${zipCode}, ${country}`;
    return (
      <p className="max-w-[300px] overflow-hidden text-ellipsis md:whitespace-nowrap">
        {address}
      </p>
    );
  };

  if (status !== "authenticated")
    return (
      <Layout
        title="Your Account"
        description="Your account on Toshi | Make Shopping Yours"
        className="flex flex-col items-center pt-16 text-lg"
      >
        <p>
          Please{" "}
          <button
            type="button"
            onClick={() => void signIn()}
            className="text-sky-600 underline underline-offset-1 transition-colors hover:text-toshi-red"
          >
            sign in
          </button>{" "}
          to view your account.
        </p>
        <div className="flex w-32 items-center before:mt-0.5 before:flex-1 before:border-t before:border-neutral-300 after:mt-0.5 after:flex-1 after:border-t after:border-neutral-300">
          <span className="mx-2">or</span>
        </div>
        <InternalLink href="/" className="text-lg">
          Continue shopping
        </InternalLink>
      </Layout>
    );

  const fullName = `${user?.firstName ?? ""} ${user?.lastName ?? ""}`;

  return (
    <Layout
      title="Your account | Toshi"
      description="Your account on Toshi.com"
      className="flex flex-col gap-6 px-5 md:gap-16"
    >
      <section className="mt-4 flex w-fit flex-col place-items-center gap-2 self-center text-center md:flex-row md:place-items-start md:text-start">
        <Avatar
          alt="Your profile picture"
          src={
            user?.avatarColor
              ? avatarUrls[user.avatarColor]
              : "/profile-placeholder.png"
          }
          size="lg"
        />
        <div>
          <span className="text-2xl font-semibold">{fullName}</span>
          {user?.addresses ? (
            <AddressLine />
          ) : (
            <InternalLink href="/account/settings#addresses">
              Add an address
            </InternalLink>
          )}
          <InternalLink href={"/account/settings"} className="w-fit">
            Edit account settings
          </InternalLink>
        </div>
      </section>
      <section id="orders">
        <h1 className="mb-3 text-3xl md:text-4xl">Your Orders</h1>
        {user?.orders ? (
          <div className="grid gap-8 md:gap-16">
            {user.orders.map((order) => {
              const { id, products, createdAt, total, deliveredAt, status } =
                order;
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
                    <div className="flex w-full gap-2 md:hidden">
                      <Button
                        link={{ href: orderLink }}
                        className="w-full min-w-[12rem]"
                      >
                        Order details
                      </Button>
                      <Button
                        link={{ href: `${orderLink}#invoice` }}
                        className="w-full min-w-[12rem]"
                      >
                        View invoice
                      </Button>
                    </div>
                  </div>
                  <div className="flex flex-col justify-between gap-4 px-4 md:flex-row">
                    <div className="order-last hidden w-48 flex-col gap-2 md:flex">
                      <Button
                        link={{ href: orderLink }}
                        className="w-full min-w-[12rem]"
                      >
                        Order details
                      </Button>
                      <Button
                        link={{ href: `${orderLink}#invoice` }}
                        className="w-full min-w-[12rem]"
                      >
                        View invoice
                      </Button>
                    </div>
                    <div className="grid grid-cols-1 gap-4 gap-y-8 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
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
        ) : (
          <p>
            You have no orders.{" "}
            <InternalLink href="/">Continue shopping</InternalLink>
          </p>
        )}
      </section>
      <section id="lists">
        <h1 className="mb-3 text-3xl md:text-4xl">Your Lists</h1>
        <div className="grid gap-8 md:gap-16">
          {user?.lists?.map((list) => {
            const { id, name, products, isPrivate, createdAt, updatedAt } =
              list;
            const listLink = `/account/lists/${id}`;

            return (
              <div
                key={id}
                className={`flex flex-col gap-4 rounded-md border border-neutral-300 ${
                  products.length > 4 ? "" : "pb-4"
                }`}
              >
                <div className="flex flex-col gap-2 rounded-t-md border-b border-b-neutral-300 bg-neutral-100 px-4 py-3 text-neutral-600 md:flex-row md:gap-16">
                  <div className="flex items-start md:flex-col">
                    <h2 className="md:text-sm">NAME</h2>
                    <span className="mr-2 md:hidden">:</span>
                    <span>{`${name} ${isPrivate ? "" : "(Public)"}`}</span>
                  </div>
                  <div className="flex items-start md:flex-col">
                    <h2 className="md:text-sm">CREATED ON</h2>
                    <span className="mr-2 md:hidden">:</span>
                    <span>{getFormattedDate(createdAt)}</span>
                  </div>
                  <div className="flex items-start md:flex-col">
                    <h2 className="md:text-sm">LAST UPDATED</h2>
                    <span className="mr-2 md:hidden">:</span>
                    <span>{getRelativeTime(updatedAt)}</span>
                  </div>
                  <div className="flex items-start md:ml-auto md:flex-col">
                    <h2 className="md:text-sm">PRODUCTS</h2>
                    <span className="mr-2 md:hidden">:</span>
                    <span>{products.length}</span>
                  </div>
                  <div className="flex w-full gap-2 md:hidden">
                    <Link
                      href={listLink}
                      className="w-full min-w-[12rem] rounded-md bg-neutral-200 px-2 py-1 text-center transition-colors hover:bg-neutral-300"
                    >
                      View list
                    </Link>
                    <Link
                      href={`${listLink}?edit=true`}
                      className="w-full min-w-[12rem] rounded-md bg-neutral-200 px-2 py-1 text-center transition-colors hover:bg-neutral-300"
                    >
                      Edit list
                    </Link>
                  </div>
                </div>
                <div className="flex flex-col justify-between gap-4 px-4 md:flex-row">
                  <div className="order-last hidden w-48 flex-col gap-2 md:flex">
                    <Link
                      href={listLink}
                      className="w-full min-w-[12rem] rounded-md bg-neutral-200 px-2 py-1 text-center transition-colors hover:bg-neutral-300"
                    >
                      View list
                    </Link>
                    <Link
                      href={`${listLink}?edit=true`}
                      className="w-full min-w-[12rem] rounded-md bg-neutral-200 px-2 py-1 text-center transition-colors hover:bg-neutral-300"
                    >
                      Edit list
                    </Link>
                  </div>
                  <div className="flex flex-col gap-4 md:flex-row">
                    {products.map((product, index) => {
                      if (index >= 4) return null;
                      return <Product key={product.id} product={product} />;
                    })}
                  </div>
                </div>
                {products.length > 4 && (
                  <div className="flex justify-center rounded-b-md border-b border-b-neutral-300 bg-neutral-100 px-4 py-3 text-neutral-600">
                    <InternalLink href={listLink}>
                      View all items...
                    </InternalLink>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>
    </Layout>
  );
};

export default AccountPage;
