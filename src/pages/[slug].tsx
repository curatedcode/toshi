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
import { SearchResultSortBy } from "~/customTypes";
import type { z } from "zod";
import SkipToContentButton from "~/components/SkipToContentButton";

type SearchResultSortByType = z.infer<typeof SearchResultSortBy>;

const SearchPage: NextPage = (
  props: InferGetServerSidePropsType<typeof getServerSideProps>
) => {
  const {
    textParam,
    pageParam,
    sortByParam,
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

  const [sortResults, setSortResults] = useState(sortByParam);
  const sortResultsLinkRef = useRef<HTMLAnchorElement>(null);

  function handleSortByChange(e: ChangeEvent<HTMLSelectElement>) {
    const newSortBy = e.currentTarget.value as
      | SearchResultSortByType
      | undefined;

    if (!newSortBy) {
      return setSortResults("default");
    }

    switch (newSortBy) {
      case "newest":
        return setSortResults("newest");
      case "reviews":
        return setSortResults("reviews");
      case "priceHighToLow":
        return setSortResults("priceHighToLow");
      case "priceLowToHigh":
        return setSortResults("priceLowToHigh");
      default:
        return setSortResults("default");
    }
  }

  useEffect(() => {
    sortResultsLinkRef.current?.click();
  }, [sortResults]);

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
    sortBy,
    category,
    rating,
    price,
    includeOutOfStock,
  }: getLinkWithAllParamsProps) {
    const searchText = text ?? textParam;
    const searchPage = page ?? pageParam;
    const searchSortBy = sortBy ?? sortByParam;
    const searchCategory = category ?? categoryParam ?? "";
    const searchRating = rating ?? ratingParam;
    const searchPrice = price ?? priceFilter;
    const searchIncludeOutOfStock = includeOutOfStock ?? includeOutOfStockParam;

    console.log(searchSortBy);
    const link = `/search?text=${searchText}&page=${searchPage}&sortBy=${searchSortBy}&dept=${searchCategory}&rating=${searchRating}&pmin=${
      searchPrice.min ?? ""
    }&pmax=${searchPrice.max ?? ""}&includeOutOfStock=${String(
      searchIncludeOutOfStock
    )}`;

    return link;
  }

  const { data } = api.product.search.useQuery(
    {
      text: textParam,
      page: pageParam,
      sortBy: sortByParam,
      filters: {
        price: {
          min: priceMinParam,
          max: priceMaxParam,
        },
        rating: ratingParam,
        category: categoryParam,
        includeOutOfStock: includeOutOfStockParam,
      },
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
      <Link
        href={getLinkWithAllParams({ sortBy: sortResults, page: 1 })}
        ref={sortResultsLinkRef}
        hidden
      />
      <div
        id="filters"
        className="mb-3 flex flex-col items-end gap-1 px-4 py-1.5 text-sm shadow-md shadow-neutral-300 md:flex-row md:justify-between"
      >
        {textParam ? (
          <div>
            <span>{data?.totalResults} results for </span>
            <span className="text-toshi-red">&quot;{textParam}&quot;</span>
          </div>
        ) : (
          <span>{data?.totalResults} results</span>
        )}
        <div className="flex items-center gap-2">
          <label htmlFor="sortBy" className="font-semibold text-toshi-red">
            Sort by:
          </label>
          <select
            title="Sort results"
            name="sortBy"
            onChange={handleSortByChange}
            className="rounded-md bg-neutral-200 px-2"
          >
            <option value={"default"} selected={sortByParam === "default"}>
              Relevance
            </option>
            <option
              value={"priceLowToHigh"}
              selected={sortByParam === "priceLowToHigh"}
            >
              Price: Low to High
            </option>
            <option
              value={"priceHighToLow"}
              selected={sortByParam === "priceHighToLow"}
            >
              Price: High to Low
            </option>
            <option value={"reviews"} selected={sortByParam === "reviews"}>
              Avg. Customer Review
            </option>
            <option value={"newest"} selected={sortByParam === "newest"}>
              Newest
            </option>
          </select>
        </div>
      </div>
      <div className="flex">
        <div className="hidden flex-col divide-y divide-neutral-300 px-5 md:flex [&>div]:pb-3 [&>div]:pt-2">
          <SkipToContentButton
            type="inline"
            contentId="#results"
            className="order-first"
            text="Skip to results"
          />
          <Link href={`/search?text=${textParam}`} hidden ref={linkRef} />
          <button
            type="button"
            onClick={resetFilters}
            className="rounded-md bg-toshi-red px-2 text-center text-lg font-semibold text-white shadow shadow-neutral-500 transition-shadow hover:shadow-md hover:shadow-neutral-500"
          >
            Clear filters
          </button>
          <div className="mt-4 flex flex-col gap-1">
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
                className="flex w-fit items-center gap-1 whitespace-nowrap transition-colors hover:text-toshi-red"
              >
                <RatingStars rating={4} />
                <span>& Up</span>
              </Link>
              <Link
                href={getLinkWithAllParams({ rating: 3, page: 1 })}
                title="3 stars and up"
                className="flex w-fit items-center gap-1 whitespace-nowrap transition-colors hover:text-toshi-red"
              >
                <RatingStars rating={3} />
                <span>& Up</span>
              </Link>
              <Link
                href={getLinkWithAllParams({ rating: 2, page: 1 })}
                title="2 stars and up"
                className="flex w-fit items-center gap-1 whitespace-nowrap transition-colors hover:text-toshi-red"
              >
                <RatingStars rating={2} />
                <span>& Up</span>
              </Link>
              <Link
                href={getLinkWithAllParams({ rating: 1, page: 1 })}
                title="1 star and up"
                className="flex w-fit items-center gap-1 whitespace-nowrap transition-colors hover:text-toshi-red"
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
                  className="w-fit transition-colors hover:text-toshi-red"
                >
                  {category}
                </Link>
              ))}
            </div>
          </div>
          <div>
            <div className="flex w-fit gap-1 hover:text-toshi-red [&>*]:hover:cursor-pointer">
              <input
                id="includeOutOfStock"
                type="checkbox"
                onChange={(e) => setIncludeOutOfStock(e.currentTarget.checked)}
                defaultChecked={includeOutOfStock}
              />
              <label htmlFor="includeOutOfStock">Include out of stock</label>
            </div>
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
        <div className="flex w-full flex-col gap-4 bg-white px-3" id="results">
          {data?.products.map((product) => (
            <Product key={product.id} type="alternate" product={product} />
          ))}
          <SkipToContentButton
            type="inline"
            contentId="#filters"
            className="w-fit px-4"
            text="Go back to filter menu"
          />
        </div>
      </div>
      <PaginationButtons
        currentPage={pageParam}
        totalPages={data?.totalPages}
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
  sortByParam: SearchResultSortByType;
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
  const hasSortBy = typeof query.sortBy === "string" && query.sortBy !== "";

  const text = hasText ? (query.text as string) : "";
  const page = hasPage ? Number(query.page) : 1;
  const category = hasCategory ? (query.dept as string) : null;
  const rating = hasRating ? Number(query.rating) : 0;
  const priceMin = hasPriceMin ? Number(query.pmin) : null;
  const priceMax = hasPriceMax ? Number(query.pmax) : null;
  const includeOutOfStock =
    hasIncludeOutOfStock && query.includeOutOfStock === "true";

  function getSortBy() {
    const sortEnum = SearchResultSortBy.Enum;

    if (query.sortBy === sortEnum.newest) {
      return sortEnum.newest;
    }
    if (query.sortBy === sortEnum.reviews) {
      return sortEnum.reviews;
    }
    if (query.sortBy === sortEnum.priceHighToLow) {
      return sortEnum.priceHighToLow;
    }
    if (query.sortBy === sortEnum.priceLowToHigh) {
      return sortEnum.priceLowToHigh;
    }
    return sortEnum.default;
  }

  const sortBy = hasSortBy ? getSortBy() : "default";

  await helpers.product.search.prefetch({
    text,
    page,
    sortBy,
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
    sortByParam: sortBy,
  };
  return { props: dataToReturn };
};

export default SearchPage;
