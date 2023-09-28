import type {
  GetServerSideProps,
  InferGetServerSidePropsType,
  NextPage,
} from "next";
import Layout from "~/components/Layout";
import { api } from "~/utils/api";
import Product from "~/components/Products/Product";
import { useEffect, useState, type ChangeEvent, useRef, Fragment } from "react";
import RatingStars from "~/components/Reviews/RatingStars";
import PriceInput from "~/components/Search/PriceInput";
import PaginationButtons from "~/components/Search/PaginationButtons";
import Link from "next/link";
import type { getLinkWithAllParamsProps } from "~/customTypes";
import { type DehydratedState, useQueryClient } from "@tanstack/react-query";
import { createServerSideHelpers } from "@trpc/react-query/server";
import { createInnerTRPCContext } from "~/server/api/trpc";
import { appRouter } from "~/server/api/root";
import SuperJSON from "superjson";
import { SearchResultSortBy } from "~/customTypes";
import type { z } from "zod";
import SkipToContentButton from "~/components/SkipToContentButton";
import { FunnelIcon } from "@heroicons/react/24/outline";
import { Menu, Transition } from "@headlessui/react";
import Button from "~/components/Input/Button";
import CustomLink from "~/components/Input/CustomLink";

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
      title={`${textParam === "" ? "Search" : textParam} | Toshi`}
      description={`Search results for ${textParam} on Toshi.com`}
      className="!p-0"
    >
      <Link
        href={getLinkWithAllParams({ sortBy: sortResults, page: 1 })}
        ref={sortResultsLinkRef}
        hidden
      />
      <div className="mb-5 flex items-end justify-between gap-1 px-4 py-1.5 text-sm shadow-md shadow-neutral-300 md:hidden">
        <div className="flex flex-col">
          {data &&
            data.products &&
            data.products.length > 0 &&
            (textParam ? (
              <div>
                <span>{data?.totalResults} results for </span>
                <span className="text-toshi-green">
                  &quot;{textParam}&quot;
                </span>
              </div>
            ) : (
              <span>{data?.totalResults} results</span>
            ))}
          <div className="flex items-center gap-2">
            <label htmlFor="sortBy" className="font-semibold text-toshi-green">
              Sort by:
            </label>
            <select
              title="Sort results"
              name="sortBy"
              onChange={handleSortByChange}
              className="rounded-md bg-neutral-200 px-2 hover:cursor-pointer"
              defaultValue={sortByParam}
            >
              <option value={"default"}>Relevance</option>
              <option value={"priceLowToHigh"}>Price: Low to High</option>
              <option value={"priceHighToLow"}>Price: High to Low</option>
              <option value={"reviews"}>Avg. Customer Review</option>
              <option value={"newest"}>Newest</option>
            </select>
          </div>
        </div>
        <Menu as="div" className="relative">
          <Menu.Button className="inline-flex items-center gap-1">
            <span className="font-semibold text-toshi-green">Filters</span>
            <FunnelIcon className="w-5 stroke-toshi-green" aria-hidden />
          </Menu.Button>
          <Transition
            as={Fragment}
            enter="transition ease-out duration-50"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-50"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <Menu.Items className="absolute -right-4 z-10 mt-2 w-72 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-neutral-400 focus:outline-none md:-right-[90%]">
              <div className="flex flex-col divide-y divide-neutral-300 p-2">
                <Link href={`/search?text=${textParam}`} hidden ref={linkRef} />
                <Menu.Item>
                  <Button style="standard" onClick={resetFilters}>
                    Clear filters
                  </Button>
                </Menu.Item>
                <div className="mt-2 flex flex-col gap-1 p-1">
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
                    <CustomLink
                      href={getLinkWithAllParams({
                        price: priceFilter,
                        page: 1,
                      })}
                      className="py-1.5"
                    >
                      Go
                    </CustomLink>
                  </div>
                </div>
                <div className="mb-2 mt-2 flex flex-col gap-1 p-1">
                  <span className="text-lg font-semibold">Reviews</span>
                  <div className="grid">
                    <Link
                      href={getLinkWithAllParams({ rating: 4, page: 1 })}
                      title="4 stars and up"
                      className="flex w-fit items-center gap-1 whitespace-nowrap transition-colors hover:text-toshi-green"
                    >
                      <RatingStars rating={4} />
                      <span>& Up</span>
                    </Link>
                    <Link
                      href={getLinkWithAllParams({ rating: 3, page: 1 })}
                      title="3 stars and up"
                      className="flex w-fit items-center gap-1 whitespace-nowrap transition-colors hover:text-toshi-green"
                    >
                      <RatingStars rating={3} />
                      <span>& Up</span>
                    </Link>
                    <Link
                      href={getLinkWithAllParams({ rating: 2, page: 1 })}
                      title="2 stars and up"
                      className="flex w-fit items-center gap-1 whitespace-nowrap transition-colors hover:text-toshi-green"
                    >
                      <RatingStars rating={2} />
                      <span>& Up</span>
                    </Link>
                    <Link
                      href={getLinkWithAllParams({ rating: 1, page: 1 })}
                      title="1 star and up"
                      className="flex w-fit items-center gap-1 whitespace-nowrap transition-colors hover:text-toshi-green"
                    >
                      <RatingStars rating={1} />
                      <span>& Up</span>
                    </Link>
                  </div>
                </div>
                <Menu.Item>
                  <div className="flex gap-1 p-1 pt-2 transition-colors hover:text-toshi-green [&>*]:hover:cursor-pointer">
                    <input
                      id="includeOutOfStockMobile"
                      type="checkbox"
                      onChange={(e) =>
                        setIncludeOutOfStock(e.currentTarget.checked)
                      }
                      defaultChecked={includeOutOfStock}
                    />
                    <label htmlFor="includeOutOfStockMobile">
                      Include out of stock
                    </label>
                  </div>
                </Menu.Item>
                <Link
                  href={getLinkWithAllParams({
                    includeOutOfStock,
                    page: 1,
                  })}
                  className="hidden"
                  ref={includeOutOfStockRef}
                />
              </div>
            </Menu.Items>
          </Transition>
        </Menu>
      </div>
      <div className="mb-5 hidden shadow-md shadow-neutral-300 md:block">
        <div
          id="filters"
          className="relative left-1/2 hidden max-w-standard -translate-x-1/2 flex-col items-end gap-1 px-4 py-1.5 text-sm md:flex md:flex-row md:justify-between"
        >
          {textParam ? (
            <div>
              <span>{data?.totalResults} results for </span>
              <span className="text-toshi-green">&quot;{textParam}&quot;</span>
            </div>
          ) : (
            <span>{data?.totalResults} results</span>
          )}
          <div className="flex items-center gap-2">
            <label htmlFor="sortBy" className="font-semibold text-toshi-green">
              Sort by:
            </label>
            <select
              title="Sort results"
              name="sortBy"
              onChange={handleSortByChange}
              className="rounded-md bg-neutral-200 px-2 hover:cursor-pointer"
              defaultValue={sortByParam}
            >
              <option value={"default"}>Relevance</option>
              <option value={"priceLowToHigh"}>Price: Low to High</option>
              <option value={"priceHighToLow"}>Price: High to Low</option>
              <option value={"reviews"}>Avg. Customer Review</option>
              <option value={"newest"}>Newest</option>
            </select>
          </div>
        </div>
      </div>
      <div className="flex gap-5 px-5">
        <div className="hidden flex-col divide-y divide-neutral-300 md:flex [&>div]:pb-3 [&>div]:pt-2">
          <SkipToContentButton
            type="inline"
            contentId="#results"
            className="order-first"
            text="Skip to results"
          />
          <Link href={`/search?text=${textParam}`} hidden ref={linkRef} />
          <Button style="standard" onClick={resetFilters}>
            Clear filters
          </Button>
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
              <CustomLink
                href={getLinkWithAllParams({
                  price: priceFilter,
                  page: 1,
                })}
                className="py-1.5"
              >
                Go
              </CustomLink>
            </div>
          </div>
          <div className="flex flex-col gap-1">
            <span className="text-lg font-semibold">Reviews</span>
            <div className="grid">
              <Link
                href={getLinkWithAllParams({ rating: 4, page: 1 })}
                title="4 stars and up"
                className="flex w-fit items-center gap-1 whitespace-nowrap transition-colors hover:text-toshi-green"
              >
                <RatingStars rating={4} />
                <span>& Up</span>
              </Link>
              <Link
                href={getLinkWithAllParams({ rating: 3, page: 1 })}
                title="3 stars and up"
                className="flex w-fit items-center gap-1 whitespace-nowrap transition-colors hover:text-toshi-green"
              >
                <RatingStars rating={3} />
                <span>& Up</span>
              </Link>
              <Link
                href={getLinkWithAllParams({ rating: 2, page: 1 })}
                title="2 stars and up"
                className="flex w-fit items-center gap-1 whitespace-nowrap transition-colors hover:text-toshi-green"
              >
                <RatingStars rating={2} />
                <span>& Up</span>
              </Link>
              <Link
                href={getLinkWithAllParams({ rating: 1, page: 1 })}
                title="1 star and up"
                className="flex w-fit items-center gap-1 whitespace-nowrap transition-colors hover:text-toshi-green"
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
                  className="w-fit transition-colors hover:text-toshi-green"
                >
                  {category}
                </Link>
              ))}
            </div>
          </div>
          <div>
            <div className="flex w-fit gap-1 transition-colors hover:text-toshi-green [&>*]:hover:cursor-pointer">
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
        <div
          className={
            data && data.products && data.products.length > 0
              ? "grid gap-4 bg-white"
              : "w-full bg-white pt-8"
          }
          id="results"
        >
          {data && data.products && data.products.length > 0 ? (
            data?.products.map((product) => (
              <Product key={product.id} type="alternate" product={product} />
            ))
          ) : (
            <div className="flex flex-col items-center font-semibold">
              <picture>
                <source
                  srcSet="/toshi-sad-desktop.png"
                  media="(min-width: 768px)"
                  className="w-max"
                />
                <img
                  src="/toshi-sad-mobile.png"
                  alt="toshi sad face logo"
                  className="w-max"
                />
              </picture>
              {textParam ? (
                <p>
                  We didn&apos;t find any results for &quot;{textParam}&quot;
                </p>
              ) : (
                <p>We didn&apos;t find any results</p>
              )}
            </div>
          )}
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
  const helpers = createServerSideHelpers({
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
