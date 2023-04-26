import type { NextPage } from "next";
import Layout from "~/components/Layout";
import Product from "~/components/Product";
import { api } from "~/utils/api";

const NewReleasePage: NextPage = () => {
  const { data } = api.product.newReleases.useQuery();

  return (
    <Layout
      title="New Releases | Toshi"
      description="New releases on Toshi"
      className="grid grid-cols-1 gap-4 p-4 sm:grid-cols-2 lg:grid-cols-3"
    >
      {data?.map((product) => (
        <Product key={product.id} product={product} />
      ))}
    </Layout>
  );
};

export default NewReleasePage;
