import type {
  GetServerSideProps,
  InferGetServerSidePropsType,
  NextPage,
} from "next";
import Layout from "~/components/Layout";
import { api } from "~/utils/api";
import Carousel from "~/components/Sliders/Carousel";
import Link from "next/link";
import { useState } from "react";
import Image from "~/components/Image";
import Rating from "~/components/Reviews/Rating";
import Review from "~/components/Reviews/Review";
import { createProxySSGHelpers } from "@trpc/react-query/ssg";
import { appRouter } from "~/server/api/root";
import { createInnerTRPCContext } from "~/server/api/trpc";
import superjson from "superjson";
import Slider from "~/components/Sliders/Slider";
import Product from "~/components/Products/Product";
import QuantityControls from "~/components/Products/QuantityControls";

const ProductPage: NextPage = (
  props: InferGetServerSidePropsType<typeof getServerSideProps>
) => {
  const productId = props.productId as string;

  const { data: mainData } = api.product.getOne.useQuery({ productId });

  const { data: similarData } = api.product.similar.useQuery({
    category: mainData?.categories[0]?.name,
  });
  const similarProducts = similarData?.map((product) => (
    <Product key={product.id} product={product} />
  ));

  const { name, price, images, description, company, reviews, quantity } =
    mainData || {
      name: "",
      price: 0,
      images: [],
      description: "",
      company: { name: "", id: "" },
      reviews: { rating: 0, _count: 0, data: [] },
      quantity: 0,
    };

  const [orderQuantity, setOrderQuantity] = useState(1);

  return (
    <Layout
      title={`Toshi | ${name}`}
      description={`${name} on Toshi.com | Make Shopping Yours`}
      className="flex flex-col gap-4 divide-y divide-neutral-300 px-3 py-4 md:divide-y-0"
    >
      <div className="flex flex-col md:flex-row md:gap-4">
        <div className="flex w-full flex-col gap-3 divide-y divide-neutral-300 md:flex-row md:items-start md:divide-y-0">
          <Carousel
            slides={images.map((image) => (
              <Image
                key={image.url}
                alt={name}
                src={image.url}
                loading="eager"
                className="w-full rounded-md"
                height={150}
                width={200}
              />
            ))}
            thumbnails={images.length > 1}
            controls
          />
          <div className="-mt-2 w-full border-none pt-2">
            <h1 className="line-clamp-2 text-xl">{name}</h1>
            <Rating
              rating={reviews.rating}
              _count={reviews._count}
              link={"#reviews"}
            />
            <div className="my-3 border-y border-neutral-300 py-3 md:pb-4">
              <h1 className="text-lg font-semibold">About</h1>
              <div className="flex flex-col gap-2">
                <p>{description}</p>
                <div className="flex items-center gap-2">
                  <span className="whitespace-nowrap">Sold By:</span>
                  <Link
                    href={`/companies/${company.id}`}
                    className="text-sky-600 underline underline-offset-1"
                  >
                    {company.name}
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="flex flex-col gap-2 pb-3 md:mt-12 md:h-fit md:items-center md:rounded-md md:bg-neutral-100 md:px-3 md:py-3">
          <div className="flex items-center gap-2 md:gap-1">
            <span className="text-lg">Price:</span>
            <span className="text-xl">${price}</span>
          </div>
          <p
            className={`text-lg font-semibold text-toshi-red md:hidden ${
              quantity <= 10 && quantity > 0 ? "" : "hidden"
            }`}
          >{`Only ${quantity} left in stock - order soon.`}</p>
          {quantity > 0 ? (
            <QuantityControls
              maxQuantity={quantity}
              quantity={orderQuantity}
              setQuantity={setOrderQuantity}
            />
          ) : (
            <span className="mb-2 text-xl font-medium text-toshi-red">
              Out of stock
            </span>
          )}
          <button
            type="button"
            className="w-full rounded-md bg-toshi-red py-2 text-lg font-semibold text-white disabled:cursor-not-allowed disabled:bg-opacity-40 sm:w-48"
            disabled={quantity < 1 || orderQuantity < 1}
          >
            Add to cart
          </button>
        </div>
      </div>
      <div id="reviews" className="pt-4 md:pt-0">
        <h1 className="mb-2 text-xl font-semibold">Reviews</h1>
        <div className="flex flex-col gap-2 divide-y divide-neutral-300 md:divide-y-0">
          {reviews.data.map((review) => (
            <Review key={review.id} review={review} />
          ))}
        </div>
      </div>
      {similarProducts && (
        <div className="pt-4">
          <h1 className="mb-2 text-xl font-semibold">Similar products</h1>
          <div>
            <Slider slides={similarProducts} controls />
          </div>
        </div>
      )}
    </Layout>
  );
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  const helper = createProxySSGHelpers({
    router: appRouter,
    ctx: createInnerTRPCContext({ session: null }),
    transformer: superjson,
  });
  const { query } = context;
  const productId = query.slug as string;

  await helper.product.getOne.prefetch({ productId });

  return { props: { trpcState: helper.dehydrate(), productId } };
};

export default ProductPage;
