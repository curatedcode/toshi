import { type NextPage } from "next";
import Layout from "~/components/Layout";
import Link from "next/link";
import { api } from "~/utils/api";
import Slider from "~/components/Sliders/Slider";
import Image from "~/components/Image";
import Product from "~/components/Product";

const Home: NextPage = () => {
  const { data: recommendedData } = api.category.recommended.useQuery();
  const recommended = recommendedData?.map((product) => (
    <Product key={product.id} product={product} />
  ));

  const { data: topCategoriesData } = api.category.top.useQuery();
  const topCategories = topCategoriesData?.map((category) => (
    <TopItem key={category} link={`/category/${category}`} name={category} />
  ));

  const { data: bestDealsData } = api.category.bestDeals.useQuery();
  const bestDeals = bestDealsData?.map((product) => (
    <Product key={product.id} product={product} />
  ));

  const { data: topBrandsData } = api.category.topBrands.useQuery();
  const topBrands = topBrandsData?.map((brand) => (
    <TopItem
      key={brand.name}
      link={`/company/${brand.name}`}
      name={brand.name}
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
      className="flex flex-col gap-6 bg-web-white"
    >
      <div className="flex h-fit w-full justify-center bg-[#ffcdff]">
        <Image className="max-h-80 md:hidden" src="/hero-mobile.png" alt="" />
        <Image
          className="hidden max-h-96 md:block"
          src="/hero-desktop.png"
          alt=""
        />
      </div>
      <div className="flex flex-col gap-8 px-2 md:gap-10 md:px-4">
        <section className="flex flex-col items-center bg-white ">
          <h1 className="mb-2 self-start whitespace-nowrap text-xl font-semibold sm:text-2xl">
            Recommended
          </h1>
          {recommended && <Slider slides={recommended} />}
        </section>
        <section className="flex flex-col items-center bg-white">
          <h1 className="mb-2 self-start whitespace-nowrap text-xl font-semibold sm:text-2xl">
            Best Deals
          </h1>
          {bestDeals && <Slider slides={bestDeals} />}
        </section>
        <section className="flex flex-col items-center gap-4 md:flex-row">
          <section className="w-full bg-white md:w-1/2">
            <h1 className="mb-2 self-start whitespace-nowrap text-xl font-semibold sm:text-2xl">
              Top Brands
            </h1>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:text-lg">
              {topBrands}
            </div>
          </section>
          <section className="w-full bg-white md:w-1/2">
            <h1 className="mb-2 self-start whitespace-nowrap text-xl font-semibold sm:text-2xl">
              Top Categories
            </h1>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:text-lg">
              {topCategories}
            </div>
          </section>
        </section>
        <section className="flex flex-col items-center bg-white">
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

function TopItem({ link, name }: { link: string; name: string }) {
  return (
    <Link
      href={link}
      key={name}
      className="flex w-full items-center gap-2 rounded-md bg-web-white px-6 py-2 text-center font-medium"
    >
      <Image src="" alt="" height={50} width={50} />
      {name}
    </Link>
  );
}

export default Home;
