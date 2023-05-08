import type { NextPage } from "next";
import Layout from "~/components/Layout";
import Product from "~/components/Products/Product";
import { api } from "~/utils/api";

const NewReleasePage: NextPage = () => {
  const { data } = api.product.newReleases.useQuery();

  return (
    <Layout
      title="New Releases | Toshi"
      description="New releases on Toshi"
      className="flex flex-col px-5 pt-8"
    >
      <h1 className="my-3 ml-1 text-3xl font-semibold md:text-4xl">
        New Releases
      </h1>
      <div className="grid grid-cols-1 gap-6 gap-y-12 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {data?.map((product) => (
          <Product key={product.id} product={product} />
        ))}
      </div>
    </Layout>
  );
};

export default NewReleasePage;
