import { type NextPage } from "next";
import { signIn, useSession } from "next-auth/react";
import Avatar from "~/components/Avatar";
import getRelativeTime from "~/components/Fn/getRelativeDate";
import InternalLink from "~/components/InternalLink";
import Layout from "~/components/Layout";
import Product from "~/components/Products/Product";
import Carousel from "~/components/Sliders/Carousel";
import Slider from "~/components/Sliders/Slider";
import { api } from "~/utils/api";

const AccountPage: NextPage = () => {
  const { status, data: session } = useSession();

  const { data: user } = api.user.getCurrentProfile.useQuery();

  const { data: recommended } = api.category.recommended.useQuery();

  if (status !== "authenticated")
    return (
      <Layout
        title="Your Account"
        description="Your account on Toshi | Make Shopping Yours"
        className="flex flex-col items-center pt-12 text-lg"
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

  return (
    <Layout
      title="Your Account"
      description="Your account on Toshi | Make Shopping Yours"
    >
      <section className="grid grid-rows-2">
        <Avatar
          alt="Your profile picture"
          src={user?.image}
          className="row-span-full"
        />
        <span>{user?.name ?? session.user.name}</span>
        <p>{user?.address}</p>
      </section>
      <section id="orders">
        <h1>Order Again</h1>
        {user?.orders ? (
          <div className="line-clamp-2">
            {user.orders.map((order) => {
              const { id, products, createdAt } = order;

              const orderProducts = products.map((product) => (
                <Product key={product.id} product={product} />
              ));
              return (
                <div key={id} className="grid auto-rows-min">
                  <h2>{getRelativeTime(createdAt)}</h2>
                  <Slider slides={orderProducts} />
                </div>
              );
            })}
          </div>
        ) : (
          <p>
            You have no orders.{" "}
            <InternalLink href="/">continue shopping</InternalLink>
          </p>
        )}
      </section>
      <section id="recommended">
        <h1>Our recommendations</h1>
        {recommended && (
          <div className="line-clamp-2">
            {recommended.map((product) => (
              <Product key={product.id} product={product} />
            ))}
          </div>
        )}
      </section>
      <section id="lists">
        <div className="flex">
          <h1>Your Lists</h1>
          <InternalLink href="create-list">Create a list</InternalLink>
        </div>
        <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
          {user?.lists?.map((list) => {
            const products = list.products.map((product) => (
              <Product key={product.id} product={product} />
            ));
            return <Carousel key={list.id} slides={products} />;
          })}
        </div>
      </section>
    </Layout>
  );
};

export default AccountPage;
