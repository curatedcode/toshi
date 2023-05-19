import type { GetServerSideProps, NextPage } from "next";
import getFormattedDate from "~/components/Fn/getFormattedDate";
import getRelativeTime from "~/components/Fn/getRelativeDate";
import Button from "~/components/Input/Button";
import InternalLink from "~/components/InternalLink";
import Layout from "~/components/Layout";
import Product from "~/components/Products/Product";
import { getServerAuthSession } from "~/server/auth";
import { api } from "~/utils/api";

const ListPage: NextPage = () => {
  const { data: lists } = api.list.getAll.useQuery();

  return (
    <Layout
      title="Your lists | Toshi"
      description="Your lists on Toshi.com"
      className="px-5"
    >
      <h1 className="my-3 text-3xl md:text-4xl">Your Lists</h1>
      <div className="grid gap-8 md:gap-16">
        {lists?.map((list) => {
          const { id, name, products, isPrivate, createdAt, updatedAt } = list;
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
                <div className="flex w-full flex-col gap-2 md:hidden">
                  <Button
                    link={{ href: listLink }}
                    className="w-full min-w-[12rem]"
                  >
                    View list
                  </Button>
                  <Button
                    link={{ href: `${listLink}?edit=true` }}
                    className="w-full min-w-[12rem]"
                  >
                    Edit list
                  </Button>
                </div>
              </div>
              <div className="flex flex-col justify-between gap-4 px-4 md:flex-row">
                <div className="order-last hidden w-48 flex-col gap-2 md:flex">
                  <Button
                    link={{ href: listLink }}
                    className="w-full min-w-[12rem]"
                  >
                    View list
                  </Button>
                  <Button
                    link={{ href: `${listLink}?edit=true` }}
                    className="w-full min-w-[12rem]"
                  >
                    Edit list
                  </Button>
                </div>
                <div className="flex flex-col gap-4 sm:grid sm:grid-cols-2 md:grid-cols-4">
                  {products.map((product, index) => {
                    if (index >= 4) return null;
                    return <Product key={product.id} product={product} />;
                  })}
                </div>
              </div>
              {products.length > 4 && (
                <div className="flex justify-center rounded-b-md border-b border-b-neutral-300 bg-neutral-100 px-4 py-3 text-neutral-600">
                  <InternalLink href={listLink}>View all items...</InternalLink>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </Layout>
  );
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  const session = await getServerAuthSession(context);

  if (!session) {
    return {
      redirect: {
        destination: "/auth/sign-in",
        permanent: false,
      },
    };
  }
  return {
    props: { session },
  };
};

export default ListPage;
