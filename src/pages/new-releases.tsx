import type { NextPage } from "next";
import Layout from "~/components/Layout";
import Product from "~/components/Products/Product";
import { api } from "~/utils/api";

const NewReleasePage: NextPage = () => {
  const { data } = api.product.newReleases.useQuery();

  return (
    <Layout
      title="New releases | Toshi"
      description="New releases on Toshi.com"
    >
      <h1 className="my-3 text-3xl md:text-4xl">New Releases</h1>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {data?.map((product) => (
          <Product key={product.id} product={product} />
        ))}
      </div>
    </Layout>
  );
};

export default NewReleasePage;
