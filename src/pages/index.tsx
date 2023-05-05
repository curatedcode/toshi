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

  const { data: topCategoriesData } = api.category.top.useQuery();
  const topCategories = topCategoriesData?.map((category) => (
    <TopCategory
      key={category}
      link={`/search?dept=${category}`}
      name={category}
      imageURL={`/${category.toLowerCase()}-category.jpg`}
    />
  ));

  const { data: bestDealsData } = api.category.bestDeals.useQuery();
  const bestDeals = bestDealsData?.map((product) => (
    <Product key={product.id} product={product} imageLoading="eager" />
  ));

  const { data: topBrandsData } = api.category.topBrands.useQuery();
  const topBrands = topBrandsData?.map((brand) => (
    <TopCompany
      key={brand.name}
      link={`/companies/${brand.id}`}
      name={brand.name}
      imageURL={brand.logoURL}
    />
  ));

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
      <div className="flex h-fit w-full justify-center bg-[#ffcdff]">
        <Image
          className="max-h-80 md:hidden"
          src="/hero-mobile.png"
          alt=""
          loading="eager"
        />
        <Image
          className="hidden max-h-96 md:block"
          src="/hero-desktop.png"
          alt=""
          loading="eager"
        />
      </div>
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
        <section className="flex flex-col items-center gap-4 md:flex-row">
          <section className="w-full rounded-md bg-white px-4 pb-4 pt-2 md:w-1/2">
            <h1 className="mb-2 self-start whitespace-nowrap text-xl font-semibold sm:text-2xl">
              Top Brands
            </h1>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:text-lg">
              {topBrands}
            </div>
          </section>
          <section className="w-full rounded-md bg-white px-4 pb-4 pt-2 md:w-1/2">
            <h1 className="mb-2 self-start whitespace-nowrap text-xl font-semibold sm:text-2xl">
              Top Categories
            </h1>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:text-lg">
              {topCategories}
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

type TopItemProps = {
  link: string;
  name: string;
  imageURL: string;
};

function TopCategory({ link, name, imageURL }: TopItemProps) {
  return (
    <Link
      href={link}
      key={name}
      className="line-clamp-2 flex w-full items-center gap-2 px-6 py-2 text-xl transition-colors hover:bg-neutral-100"
    >
      <Image
        src={imageURL}
        alt=""
        height={50}
        width={50}
        className="aspect-square w-16 rounded-md"
      />
      {name}
    </Link>
  );
}

function TopCompany({ link, name, imageURL }: TopItemProps) {
  return (
    <Link
      href={link}
      key={name}
      className="line-clamp-1 flex w-full items-center gap-2 px-6 py-2 text-xl transition-colors hover:bg-neutral-100"
    >
      <Image
        src={imageURL}
        alt={`${name} logo`}
        height={50}
        width={50}
        className="aspect-square w-16 rounded-md"
      />
      {name}
    </Link>
  );
}

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
      trpc: helpers.dehydrate(),
    },
  };
};

export default Home;
