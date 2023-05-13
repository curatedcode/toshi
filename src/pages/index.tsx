import type { GetServerSideProps, NextPage } from "next";
import Layout from "~/components/Layout";
import Link from "next/link";
import { api } from "~/utils/api";
import Slider from "~/components/Sliders/Slider";
import Image from "~/components/Image";
import Product from "~/components/Products/Product";
import { createProxySSGHelpers } from "@trpc/react-query/ssg";
import { createInnerTRPCContext } from "~/server/api/trpc";
import { appRouter } from "~/server/api/root";
import SuperJSON from "superjson";

const Home: NextPage = () => {
  const { data: recommendedData } = api.category.recommended.useQuery();
  const recommended = recommendedData?.map((product) => (
    <Product key={product.id} product={product} imageLoading="eager" />
  ));

  const { data: topCategories } = api.category.top.useQuery();

  const { data: bestDealsData } = api.category.bestDeals.useQuery();
  const bestDeals = bestDealsData?.map((product) => (
    <Product key={product.id} product={product} imageLoading="eager" />
  ));

  const { data: topBrands } = api.category.topBrands.useQuery();

  const { data: sellingOutFastData } = api.category.sellingOutFast.useQuery();
  const sellingOutFast = sellingOutFastData?.map((product) => (
    <Product key={product.id} product={product} />
  ));

  return (
    <Layout
      title="Toshi | Make Shopping Yours"
      description="Make shopping yours at Toshi."
      className="flex flex-col gap-6 bg-neutral-100"
    >
      <picture className="flex justify-center bg-[#ffcdff]">
        <source srcSet="/hero-desktop.png" media="(min-width: 768px)" />
        <img
          src="/hero-mobile.png"
          alt=""
          className="w-full max-w-5xl"
          loading="eager"
        />
      </picture>
      <div className="flex flex-col gap-8 px-2 md:gap-10 md:px-4">
        <section className="flex flex-col items-center rounded-md bg-white px-4 py-2">
          <h1 className="mb-2 self-start whitespace-nowrap text-xl font-semibold sm:text-2xl">
            Recommendations
          </h1>
          {recommended && <Slider slides={recommended} />}
        </section>
        <section className="flex flex-col items-center rounded-md bg-white px-4 py-2">
          <h1 className="mb-2 self-start whitespace-nowrap text-xl font-semibold sm:text-2xl">
            Best Deals
          </h1>
          {bestDeals && <Slider slides={bestDeals} />}
        </section>
        <section className="flex flex-col gap-4">
          <section className="flex w-full flex-col items-center rounded-md bg-white px-4 pb-4 pt-2">
            <h1 className="mb-2 text-xl font-semibold sm:text-3xl">
              Top Categories
            </h1>
            <div className="grid grid-cols-2 gap-4 md:grid-cols-3 md:text-lg lg:grid-cols-6">
              {topCategories?.map((category) => (
                <Link
                  href={`/search?dept=${category}`}
                  key={category}
                  className="flex w-full flex-col items-center gap-2 px-6 py-2 text-xl transition-colors hover:bg-neutral-100"
                >
                  <Image
                    src={`/${category.toLowerCase()}-category.jpg`}
                    alt=""
                    height={50}
                    width={50}
                    className="aspect-square w-full rounded-md"
                  />
                  {category}
                </Link>
              ))}
            </div>
          </section>
          <section className="flex w-full flex-col items-center rounded-md bg-white px-4 pb-4 pt-2">
            <h1 className="mb-2 text-xl font-semibold sm:text-3xl">
              Top Brands
            </h1>
            <div className="grid grid-cols-2 gap-4 md:grid-cols-6 md:text-lg">
              {topBrands?.map((brand) => (
                <Link
                  href={`/companies/${brand.id}`}
                  key={brand.name}
                  className="flex w-full flex-col items-center gap-2 px-6 py-2 text-center leading-tight transition-colors hover:bg-neutral-100"
                >
                  <Image
                    src={brand.logoURL}
                    alt={`${brand.name} logo`}
                    height={50}
                    width={50}
                    className="aspect-square w-full rounded-md"
                  />
                  {brand.name}
                </Link>
              ))}
            </div>
          </section>
        </section>
        <section className="flex flex-col items-center rounded-md bg-white px-4 py-2">
          <h1 className="mb-2 self-start whitespace-nowrap text-xl font-semibold sm:text-2xl">
            On The Rise
          </h1>
          <div className="grid grid-cols-1 gap-x-4 gap-y-2 xs:grid-cols-2 sm:grid-cols-3 md:grid-cols-4">
            {sellingOutFast}
          </div>
        </section>
      </div>
    </Layout>
  );
};

export const getServerSideProps: GetServerSideProps = async () => {
  const helpers = createProxySSGHelpers({
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
