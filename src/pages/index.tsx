import type { GetServerSideProps, NextPage } from "next";
import Layout from "~/components/Layout";
import Link from "next/link";
import { api } from "~/utils/api";
import Slider from "~/components/Sliders/Slider";
import Image from "~/components/Image";
import Product from "~/components/Products/Product";
import { createServerSideHelpers } from "@trpc/react-query/server";
import { createInnerTRPCContext } from "~/server/api/trpc";
import { appRouter } from "~/server/api/root";
import SuperJSON from "superjson";

const Home: NextPage = () => {
  const { data: recommendedData } = api.category.recommended.useQuery();
  const recommended = recommendedData?.map((product) => (
    <Product key={product.id} product={product} />
  ));

  const { data: bestDealsData } = api.category.bestDeals.useQuery();
  const bestDeals = bestDealsData?.map((product) => (
    <Product key={product.id} product={product} />
  ));

  const { data: topCategoriesData } = api.category.top.useQuery();
  const topCategories = topCategoriesData?.map((category) => (
    <Link
      href={`/search?dept=${category}`}
      key={category}
      className="flex flex-col items-center rounded-lg text-xl"
    >
      <Image
        src={`/${category.toLowerCase()}-category.jpg`}
        alt=""
        height={50}
        width={50}
        className="aspect-square w-full rounded-t-lg"
      />
      <span className="w-full rounded-b-lg bg-white px-1 py-1.5 text-center font-semibold">
        {category}
      </span>
    </Link>
  ));

  const { data: topBrandsData } = api.category.topBrands.useQuery();
  const topBrands = topBrandsData?.map((brand) => (
    <Link
      href={`/companies/${brand.id}`}
      key={brand.name}
      className="flex flex-col items-center rounded-md"
    >
      <Image
        src={brand.logoURL}
        alt={`${brand.name} logo`}
        height={50}
        width={50}
        className="aspect-square w-full rounded-t-md"
      />
      <span className="w-full rounded-b-md bg-white px-1 py-1.5 text-center font-semibold">
        {brand.name}
      </span>
    </Link>
  ));

  const { data: sellingOutFastData } = api.category.sellingOutFast.useQuery();
  const sellingOutFast = sellingOutFastData?.map((product) => (
    <Product key={product.id} product={product} />
  ));

  return (
    <Layout
      title="Toshi.com. Magical Savings."
      description="Make shopping yours at Toshi.com"
      className="gap-6"
    >
      <picture className="flex justify-center">
        <source srcSet="/hero-desktop.jpg" media="(min-width: 768px)" />
        <img src="/hero-mobile.jpg" alt="" className="w-full" loading="eager" />
      </picture>
      <div className="flex flex-col gap-4">
        <section className="flex flex-col items-center rounded-md py-2">
          <h1 className="mb-3 self-start whitespace-nowrap text-2xl font-semibold">
            Best Deals
          </h1>
          {bestDeals && <Slider slides={bestDeals} />}
        </section>
        <section className="flex flex-col items-center rounded-md py-2">
          <h1 className="mb-3 self-start whitespace-nowrap text-2xl font-semibold">
            Recommendations
          </h1>
          {recommended && <Slider slides={recommended} />}
        </section>
        <section className="flex flex-col items-center rounded-md py-2">
          <h1 className="mb-3 self-start whitespace-nowrap text-2xl font-semibold">
            Top Categories
          </h1>
          {topCategories && <Slider slides={topCategories} smallSlides />}
        </section>
        <section className="flex flex-col items-center rounded-md py-2">
          <h1 className="mb-3 self-start whitespace-nowrap text-2xl font-semibold">
            Top Brands
          </h1>
          {topBrands && <Slider slides={topBrands} smallSlides />}
        </section>
        <section className="flex flex-col items-center rounded-md py-2">
          <h1 className="mb-3 self-start whitespace-nowrap text-2xl font-semibold">
            On This Rise
          </h1>
          {sellingOutFast && <Slider slides={sellingOutFast} />}
        </section>
      </div>
    </Layout>
  );
};

export const getServerSideProps: GetServerSideProps = async () => {
  const helpers = createServerSideHelpers({
    ctx: createInnerTRPCContext({ session: null }),
    router: appRouter,
    transformer: SuperJSON,
  });

  await helpers.category.recommended.prefetch();
  await helpers.category.bestDeals.prefetch();

  return {
    props: {
      trpcState: helpers.dehydrate(),
    },
  };
};

export default Home;
