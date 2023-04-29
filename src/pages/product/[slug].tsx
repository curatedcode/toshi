import { type NextPage } from "next";
import { useRouter } from "next/router";
import Layout from "~/components/Layout";
import { api } from "~/utils/api";
import Custom404 from "../404";
import Carousel from "~/components/Sliders/Carousel";
import Link from "next/link";
import { useState } from "react";
import { MinusIcon, PlusIcon } from "@heroicons/react/24/outline";
import RatingStars from "~/components/RatingStars";
import Avatar from "~/components/Avatar";
import getRelativeTime from "~/components/Fn/getRelativeDate";
import Image from "~/components/Image";

const ProductPage: NextPage = () => {
  const { query } = useRouter();
  const slug = typeof query.slug === "string" ? query.slug : undefined;

  const { data, isLoading } = api.product.getOne.useQuery({ productId: slug });

  const [orderQuantity, setOrderQuantity] = useState(1);

  if (!data && !isLoading) return <Custom404 />;
  if (!data) return <Custom404 />;

  const quantity = 0;

  const { name, price, images, description, company, companyId, reviews } =
    data;

  function handleOrderQuantity(value: number, type: "btn" | "input" = "btn") {
    if (type === "btn") {
      if (value + orderQuantity > quantity) return;
      if (value + orderQuantity < 1) return;
      return setOrderQuantity((prev) => prev + value);
    }
    if (value > quantity) return;
    return setOrderQuantity(value ?? undefined);
  }

  return (
    <Layout
      title={`Toshi | ${name}`}
      description={`${name} on Toshi.com | Make Shopping Yours`}
      className="relative left-1/2 flex max-w-7xl -translate-x-1/2 flex-col px-2 py-4"
    >
      <div className="flex flex-col sm:flex-row sm:justify-between sm:border-b sm:pb-4">
        <div className="flex flex-col items-center gap-3 divide-y sm:flex-row sm:items-start sm:divide-y-0">
          <Carousel
            slides={images.map((image) => (
              <Image
                key={image.url}
                alt={name ?? ""}
                src={image.url}
                className="h-full rounded-md"
              />
            ))}
            thumbnails={images.length > 1}
            controls
          />
          <div className="pt-1">
            <h1 className="line-clamp-2 text-xl font-semibold sm:text-2xl">
              {name}
            </h1>
            <div className="inline-flex">
              <span>$</span>
              <span>{price}</span>
            </div>
            <div className="my-1 border-y py-1 sm:border-b-0">
              <h2 className="text-lg font-semibold">Description</h2>
              <p>{description}</p>
            </div>
          </div>
        </div>
        <div className="mt-1.5 grid w-full grid-cols-2 place-items-center gap-y-4 sm:mt-0 sm:flex sm:w-fit sm:max-w-[210px] sm:flex-col sm:justify-center sm:bg-neutral-100 sm:px-2 sm:py-4">
          {quantity > 1 ? (
            <div className="row-span-2 inline-flex w-fit rounded-md border border-black">
              <button
                type="button"
                aria-label="minus one"
                onClick={() => handleOrderQuantity(-1)}
                className="flex items-center rounded-l-md bg-white px-2"
              >
                <MinusIcon className="w-4" />
              </button>
              <input
                type="number"
                onChange={(e) =>
                  handleOrderQuantity(Number(e.currentTarget.value), "input")
                }
                value={orderQuantity}
                aria-label="set quantity"
                className="w-10 border-x border-black px-1 text-center"
              />
              <button
                type="button"
                aria-label="plus one"
                onClick={() => handleOrderQuantity(1)}
                className="flex items-center rounded-r-md bg-white px-2"
              >
                <PlusIcon className="w-4" />
              </button>
            </div>
          ) : (
            <span className="text-xl font-medium text-toshi-red">
              Out of stock
            </span>
          )}
          <div className="row-span-2 flex flex-col items-center sm:order-first sm:flex-row sm:gap-2 sm:text-xl">
            <span>Subtotal</span>
            <div>
              <span>$</span>
              <span className="font-semibold">{price * orderQuantity}</span>
            </div>
          </div>
          <button
            type="button"
            className="col-span-full w-48 rounded-md bg-toshi-red py-1 font-semibold text-white disabled:cursor-not-allowed disabled:bg-opacity-40"
            disabled={quantity < 1 || orderQuantity < 1}
          >
            Add to cart
          </button>
          <div className="col-span-full inline-flex w-full justify-center gap-2 border-b pb-1.5 text-sm sm:border-b-0">
            <span className="whitespace-nowrap">Sold By:</span>
            <Link
              href={`/companies/${companyId}`}
              className="text-sky-600 underline underline-offset-1"
            >
              {company.name}
            </Link>
          </div>
        </div>
      </div>
      <div id="reviews">
        <h1 className="mb-2 mt-8 text-xl font-semibold">Reviews</h1>
        <div className="flex flex-col gap-4">
          {reviews.data.map((review) => {
            const { id, user, body, rating, createdAt } = review;
            return (
              <div key={id}>
                <RatingStars rating={rating} />
                <div className="flex gap-2">
                  <Avatar
                    alt={user.name ?? ""}
                    src={user.image ?? "/profile-placeholder.jpg"}
                  />
                  <div className="flex flex-col">
                    <span>{user.name}</span>
                    <span className="text-sm">
                      • {getRelativeTime(createdAt.toISOString())}
                    </span>
                  </div>
                </div>
                <p>{body}</p>
              </div>
            );
          })}
        </div>
      </div>
    </Layout>
  );
};

export default ProductPage;
