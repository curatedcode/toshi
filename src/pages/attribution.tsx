import type { NextPage } from "next";
import Layout from "~/components/Layout";

const AttributionPage: NextPage = () => {
  return (
    <Layout
      title="Attribution | Toshi"
      description="Art attribution for Toshi.com"
      className="flex flex-col items-center px-5 pt-12 text-lg"
    >
      <p>
        Hero image made in part by{" "}
        <a
          href="https://www.vecteezy.com/members/emojoez"
          className="underline underline-offset-1"
        >
          Chalermsuk
        </a>
      </p>
      <p>
        Hero image made in part by{" "}
        <a
          href="https://www.vecteezy.com/members/nurochman3278415"
          className="underline underline-offset-1"
        >
          Nurochman
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
