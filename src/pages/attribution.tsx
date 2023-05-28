import type { NextPage } from "next";
import Layout from "~/components/Layout";

const AttributionPage: NextPage = () => {
  return (
    <Layout
      title="Attribution | Toshi"
      description="Art attribution for Toshi.com"
      className="items-center pt-12 text-lg"
    >
      <p>
        Hero image by{" "}
        <a
          href="https://pixabay.com/users/huoadg5888-8934889/"
          className="underline underline-offset-1"
        >
          huoadg5888
        </a>
      </p>
      <p>
        All other images sourced from{" "}
        <a href="https://pixabay.com/" className="underline underline-offset-1">
          Pixabay
        </a>
      </p>
    </Layout>
  );
};

export default AttributionPage;
