import type {
  GetServerSideProps,
  InferGetServerSidePropsType,
  NextPage,
} from "next";
import Layout from "~/components/Layout";
import { api } from "~/utils/api";
import Product from "~/components/Products/Product";
import { useEffect, useState, type ChangeEvent, useRef } from "react";
import RatingStars from "~/components/Reviews/RatingStars";
import PriceInput from "~/components/Search/PriceInput";
import PaginationButtons from "~/components/Search/PaginationButtons";
import Link from "next/link";
import type { getLinkWithAllParamsProps } from "~/customTypes";
import { type DehydratedState, useQueryClient } from "@tanstack/react-query";
import { createProxySSGHelpers } from "@trpc/react-query/ssg";
import { createInnerTRPCContext } from "~/server/api/trpc";
import { appRouter } from "~/server/api/root";
import SuperJSON from "superjson";

const SearchPage: NextPage = (
  props: InferGetServerSidePropsType<typeof getServerSideProps>
) => {
  const {
    textParam,
    pageParam,
    categoryParam,
    ratingParam,
    priceMinParam,
    priceMaxParam,
    includeOutOfStockParam,
  } = props as SSRReturnType;

  const [priceFilter, setPriceFilter] = useState({
    min: priceMinParam,
    max: priceMaxParam,
  });

  const [totalPages, setTotalPages] = useState<number>();

  const includeOutOfStockRef = useRef<HTMLAnchorElement>(null);
  const [includeOutOfStock, setIncludeOutOfStock] = useState(
    includeOutOfStockParam
  );

  useEffect(() => {
    includeOutOfStockRef.current?.click();
  }, [includeOutOfStock]);

  function getLinkWithAllParams({
    text,
    page,
    category,
    rating,
    price,
    includeOutOfStock,
  }: getLinkWithAllParamsProps) {
    const searchText = text ?? textParam;
    const searchPage = page ?? pageParam;
    const searchCategory = category ?? categoryParam ?? "";
    const searchRating = rating ?? ratingParam;
    const searchPrice = price ?? priceFilter;
    const searchIncludeOutOfStock = includeOutOfStock ?? includeOutOfStockParam;

    const link = `/search?text=${searchText}&page=${searchPage}&dept=${searchCategory}&rating=${searchRating}&pmin=${
      searchPrice.min ?? ""
    }&pmax=${searchPrice.max ?? ""}&includeOutOfStock=${String(
      searchIncludeOutOfStock
    )}`;

    return link;
  }

  const { data } = api.product.search.useQuery(
    {
      text: textParam,
      filters: {
        price: {
          min: priceMinParam,
          max: priceMaxParam,
        },
        rating: ratingParam,
        category: categoryParam,
        includeOutOfStock: includeOutOfStockParam,
      },
      page: pageParam,
    },
    {
      keepPreviousData: true,
      staleTime: Infinity,
      onSuccess: () => window.scrollTo({ top: 0, left: 0 }),
    }
  );

  const client = useQueryClient();
  const linkRef = useRef<HTMLAnchorElement>(null);
  function resetFilters() {
    void client.invalidateQueries(["product", "search"]);
    linkRef.current?.click();
  }

  useEffect(() => {
    setTotalPages(data?.totalPages ?? 0);
  }, [data, totalPages]);

  function setPriceListValues(
    e: ChangeEvent<HTMLInputElement>,
    type: "min" | "max"
  ) {
    const { max } = priceFilter;

    const numberToSet = Number(e.currentTarget.value);

    if (numberToSet < 0) return;
    if (numberToSet > 9_999_999) return;

    // don't let min value go over max value
    if (max && type === "min" && numberToSet > max) return;

    if (type === "min")
      return setPriceFilter((prev) => ({
        ...prev,
        min: numberToSet,
      }));

    return setPriceFilter((prev) => ({
      ...prev,
      max: numberToSet,
    }));
  }

  return (
    <Layout
      title={`Search Toshi | ${textParam}`}
      description={`Search results for ${textParam} | Toshi`}
      className="flex flex-col"
    >
      <div className="flex gap-2">
        <div className="flex flex-col gap-2 divide-y divide-neutral-300 p-3">
          <Link
            href={`/search?text=${textParam}`}
            aria-hidden
            className="hidden"
            ref={linkRef}
          />
          <button
            type="button"
            onClick={resetFilters}
            className="rounded-md bg-toshi-red px-2 text-center text-lg font-semibold text-white shadow shadow-neutral-500 transition-shadow hover:shadow-md hover:shadow-neutral-500"
          >
            Clear filters
          </button>
          <div className="flex flex-col gap-1">
            <span className="text-lg font-semibold">Price</span>
            <div className="flex items-center gap-1">
              <PriceInput
                name="Min"
                onChange={(e) => setPriceListValues(e, "min")}
              />
              <span>-</span>
              <PriceInput
                name="Max"
                onChange={(e) => setPriceListValues(e, "max")}
              />
              <Link
                href={getLinkWithAllParams({ price: priceFilter, page: 1 })}
                className="flex h-8 items-center rounded-md bg-toshi-red px-2 text-center text-lg font-semibold text-white shadow shadow-neutral-500 transition-shadow hover:shadow-md hover:shadow-neutral-500"
              >
                Go
              </Link>
            </div>
          </div>
          <div className="flex flex-col gap-1">
            <span className="text-lg font-semibold">Reviews</span>
            <div className="grid">
              <Link
                href={getLinkWithAllParams({ rating: 4, page: 1 })}
                title="4 stars and up"
                className="flex items-center gap-1 whitespace-nowrap border border-transparent hover:border-black"
              >
                <RatingStars rating={4} />
                <span>& Up</span>
              </Link>
              <Link
                href={getLinkWithAllParams({ rating: 3, page: 1 })}
                title="3 stars and up"
                className="flex items-center gap-1 whitespace-nowrap border border-transparent hover:border-black"
              >
                <RatingStars rating={3} />
                <span>& Up</span>
              </Link>
              <Link
                href={getLinkWithAllParams({ rating: 2, page: 1 })}
                title="2 stars and up"
                className="flex items-center gap-1 whitespace-nowrap border border-transparent hover:border-black"
              >
                <RatingStars rating={2} />
                <span>& Up</span>
              </Link>
              <Link
                href={getLinkWithAllParams({ rating: 1, page: 1 })}
                title="1 star and up"
                className="flex items-center gap-1 whitespace-nowrap border border-transparent hover:border-black"
              >
                <RatingStars rating={1} />
                <span>& Up</span>
              </Link>
            </div>
          </div>
          <div>
            <span className="text-lg font-semibold">Department</span>
            <div className="grid">
              {data?.categories.map((category) => (
                <Link
                  href={getLinkWithAllParams({ category, page: 1 })}
                  key={category}
                  className="h-fit transition-colors hover:text-toshi-red"
                >
                  {category}
                </Link>
              ))}
            </div>
          </div>
          <div className="flex gap-2">
            <input
              id="includeOutOfStock"
              type="checkbox"
              onChange={(e) => setIncludeOutOfStock(e.currentTarget.checked)}
              defaultChecked={includeOutOfStock}
              className="hover:cursor-pointer"
            />
            <label htmlFor="includeOutOfStock">Include out of stock</label>
          </div>
          <Link
            href={getLinkWithAllParams({
              includeOutOfStock,
              page: 1,
            })}
            className="hidden"
            ref={includeOutOfStockRef}
          />
        </div>
        <div className="flex w-full flex-col gap-4 bg-white" id="results">
          {data?.products.map((product) =>
            product ? (
              <Product key={product.id} type="alternate" product={product} />
            ) : undefined
          )}
        </div>
      </div>
      <PaginationButtons
        currentPage={pageParam}
        totalPages={totalPages}
        linkTo={getLinkWithAllParams({})}
      />
    </Layout>
  );
};

type SSRReturnType = {
  trpcState: DehydratedState;
  textParam: string;
  pageParam: number;
  categoryParam: string | null;
  ratingParam: number;
  priceMinParam: number | null;
  priceMaxParam: number | null;
  includeOutOfStockParam: boolean;
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  const helpers = createProxySSGHelpers({
    router: appRouter,
    ctx: createInnerTRPCContext({ session: null }),
    transformer: SuperJSON,
  });

  const { query } = context;

  const hasText = typeof query.text === "string" && query.text !== "";
  const hasPage = typeof query.page === "string" && query.page !== "";
  const hasCategory = typeof query.dept === "string" && query.dept !== "";
  const hasRating = typeof query.rating === "string" && query.rating !== "";
  const hasPriceMin = typeof query.pmin === "string" && query.pmin !== "";
  const hasPriceMax = typeof query.pmax === "string" && query.pmax !== "";
  const hasIncludeOutOfStock =
    typeof query.includeOutOfStock === "string" &&
    query.includeOutOfStock !== "";

  const text = hasText ? (query.text as string) : "";
  const page = hasPage ? Number(query.page) : 1;
  const category = hasCategory ? (query.dept as string) : null;
  const rating = hasRating ? Number(query.rating) : 0;
  const priceMin = hasPriceMin ? Number(query.pmin) : null;
  const priceMax = hasPriceMax ? Number(query.pmax) : null;
  const includeOutOfStock =
    hasIncludeOutOfStock && query.includeOutOfStock === "true";
  console.log({ hasIncludeOutOfStock, includeOutOfStock });
  await helpers.product.search.prefetch({
    text,
    page,
    filters: {
      price: {
        min: priceMin,
        max: priceMax,
      },
      rating,
      category,
      includeOutOfStock,
    },
  });

  const dataToReturn: SSRReturnType = {
    trpcState: helpers.dehydrate(),
    textParam: text,
    pageParam: page,
    categoryParam: category,
    priceMinParam: priceMin,
    priceMaxParam: priceMax,
    ratingParam: rating,
    includeOutOfStockParam: includeOutOfStock,
  };
  return { props: dataToReturn };
};

export default SearchPage;
