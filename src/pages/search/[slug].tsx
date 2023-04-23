import type { NextPage } from "next";
import { useRouter } from "next/router";
import Layout from "~/components/Layout";
import { api } from "~/utils/api";
import Product from "~/components/Product";
import { useEffect, useRef, useState, type ChangeEvent } from "react";
import RatingStars from "~/components/RatingStars";
import { useQueryClient } from "@tanstack/react-query";
import PriceInput from "~/components/Search/PriceInput";
import PaginationButtons from "~/components/Search/PaginationButtons";
import Link from "next/link";

const SearchPage: NextPage = () => {
  const { query } = useRouter();

  const queryParamText =
    typeof query.slug === "string" ? query.slug : undefined;
  const queryParamPage =
    typeof query.page === "string" ? Number(query.page) : 1;
  const queryParamCategory =
    typeof query.dept === "string" ? query.dept : undefined;
  const queryParamRating =
    typeof query.rating === "string" ? query.rating : undefined;
  const queryParamPriceMin =
    typeof query.pmin === "string" ? query.pmin : undefined;
  const queryParamPriceMax =
    typeof query.pmax === "string" ? query.pmax : undefined;
  const queryParamIncludeOutOfStock =
    typeof query.includeOutOfStock === "string"
      ? query.includeOutOfStock === "true"
        ? true
        : false
      : false;

  const queryClient = useQueryClient();

  const [priceListChoice, setPriceListChoice] = useState({
    min: queryParamPriceMin,
    max: queryParamPriceMax,
  } as { min: number | undefined; max: number | undefined });
  const prevPriceListChoice = useRef(priceListChoice);
  const [priceMin, setPriceMin] = useState<number>();
  const [priceMax, setPriceMax] = useState<number>();

  const [reviewListChoice, setReviewListChoice] = useState(
    queryParamRating ? Number(queryParamRating) : undefined
  );
  const prevReviewListChoice = useRef(reviewListChoice);

  const [categoryListChoice, setCategoryListChoice] =
    useState(queryParamCategory);
  const prevCategoryListChoice = useRef(categoryListChoice);

  const [includeOutOfStock, setIncludeOutOfStock] = useState(
    queryParamIncludeOutOfStock
  );
  const prevIncludeOutOfStock = useRef(includeOutOfStock);

  const [categoriesOnPage, setCategoriesOnPage] = useState<string[]>([]);

  const [totalPages, setTotalPages] = useState<number>();

  const linkWithAllParams = `/search/${
    queryParamText ?? ""
  }?page=${queryParamPage}&dept=${queryParamCategory ?? ""}&rating=${
    reviewListChoice ?? ""
  }&pmin=${priceListChoice.min ?? ""}&pmax=${
    priceListChoice.max ?? ""
  }&includeOutOfStock=${includeOutOfStock ? "true" : "false"}`;

  const { data, isFetching, refetch } = api.product.search.useQuery(
    {
      text: queryParamText,
      filters: {
        price: priceListChoice,
        rating: reviewListChoice,
        category: categoryListChoice,
        includeOutOfStock: includeOutOfStock,
      },
      categoriesOnPage,
      page: queryParamPage,
    },
    {
      keepPreviousData: true,
      staleTime: Infinity,
      onSuccess: () => window.scrollTo({ top: 0, left: 0 }),
    }
  );

  const categoryNames = data?.categories.map((category) => category);

  useEffect(() => {
    if (data && data.totalPages === totalPages) return;
    setTotalPages(data?.totalPages ?? 0);
  }, [data, totalPages]);

  useEffect(() => {
    if (!categoryNames) return;
    if (categoryNames.length < 1) return;
    if (categoryNames === categoriesOnPage) return;

    const newCategories: string[] = [];
    for (const category of categoryNames) {
      if (typeof category !== "string") continue;
      if (!categoriesOnPage.includes(category)) continue;
      newCategories.push(category);
    }
    if (newCategories.length < 1) return;
    if (newCategories === categoriesOnPage) return;
    setCategoriesOnPage((prev) => prev.concat(newCategories));
  }, [categoryNames, categoriesOnPage]);

  function setPriceListValues(
    e: ChangeEvent<HTMLInputElement>,
    type: "min" | "max"
  ) {
    const numberToSet = Number(e.currentTarget.value);
    if (numberToSet < 0) return;
    if (numberToSet > 9_999_999) return;

    // don't let min value go over max value
    if (priceMax && type === "min" && numberToSet > priceMax) return;

    if (type === "min") return setPriceMin(numberToSet);
    setPriceMax(numberToSet);
  }

  useEffect(() => {
    if (isFetching) return;

    if (priceListChoice !== prevPriceListChoice.current) {
      prevPriceListChoice.current = priceListChoice;
      return void refetch();
    }
    if (reviewListChoice !== prevReviewListChoice.current) {
      prevReviewListChoice.current = reviewListChoice;
      return void refetch();
    }
    if (categoryListChoice !== prevCategoryListChoice.current) {
      prevCategoryListChoice.current = categoryListChoice;
      return void refetch();
    }
    if (includeOutOfStock !== prevIncludeOutOfStock.current) {
      prevIncludeOutOfStock.current = includeOutOfStock;
      return void refetch();
    }
  }, [
    priceListChoice,
    reviewListChoice,
    categoryListChoice,
    includeOutOfStock,
    refetch,
    isFetching,
    queryClient,
  ]);

  return (
    <Layout
      title={`Search Toshi | ${queryParamText ?? ""}`}
      description={`Search results for ${queryParamText ?? ""} | Toshi`}
      className="flex flex-col"
    >
      <div className="flex">
        <div className="hidden w-fit bg-white md:flex md:flex-col">
          <Link
            href={`/search/${queryParamText ?? ""}`}
            className="rounded-md border border-black border-opacity-60 bg-white px-2 text-center text-lg shadow shadow-neutral-500 transition-colors hover:bg-neutral-100"
          >
            Reset filters
          </Link>
          <div className="flex flex-col gap-1">
            <label className="text-lg font-semibold">Price</label>
            <div className="inline-flex items-center gap-1">
              <PriceInput
                name="Min"
                onChange={(e) => setPriceListValues(e, "min")}
              />
              <span>-</span>
              <PriceInput
                name="Max"
                onChange={(e) => setPriceListValues(e, "max")}
              />
              <button
                type="button"
                className="ml-1 h-8 rounded-md border border-black border-opacity-60 bg-white px-2 text-lg shadow shadow-neutral-500 transition-colors hover:bg-neutral-100"
                onClick={() =>
                  setPriceListChoice({ min: priceMin, max: priceMax })
                }
              >
                Go
              </button>
            </div>
          </div>
          <div className="flex flex-col gap-1">
            <span className="text-lg font-semibold">Customer Reviews</span>
            <div className="grid">
              <button
                type="button"
                aria-label="4 stars and up"
                onClick={() => setReviewListChoice(4)}
                className="inline-flex items-center gap-1 whitespace-nowrap border border-transparent hover:border-black"
              >
                <RatingStars rating={4} />
                <span>& Up</span>
              </button>
              <button
                type="button"
                aria-label="3 stars and up"
                onClick={() => setReviewListChoice(3)}
                className="inline-flex items-center gap-1 whitespace-nowrap border border-transparent hover:border-black"
              >
                <RatingStars rating={3} />
                <span>& Up</span>
              </button>
              <button
                type="button"
                aria-label="2 stars and up"
                onClick={() => setReviewListChoice(2)}
                className="inline-flex items-center gap-1 whitespace-nowrap border border-transparent hover:border-black"
              >
                <RatingStars rating={2} />
                <span>& Up</span>
              </button>
              <button
                type="button"
                aria-label="1 star and up"
                onClick={() => setReviewListChoice(1)}
                className="inline-flex items-center gap-1 whitespace-nowrap border border-transparent hover:border-black"
              >
                <RatingStars rating={1} />
                <span>& Up</span>
              </button>
            </div>
          </div>
          <div>
            <span className="text-lg font-semibold">Department</span>
            <div className="grid">
              {data?.categories.map((category) => (
                <button
                  type="button"
                  value={category}
                  onClick={() => setCategoryListChoice(category)}
                  key={category}
                  className="transition-colors hover:text-toshi-red"
                >
                  {category}
                </button>
              ))}
            </div>
          </div>
          <button
            type="button"
            className="transition-colors hover:text-toshi-red"
            onClick={() => setIncludeOutOfStock(true)}
          >
            Include out of stock
          </button>
        </div>
        <div className="grid w-full">
          {data?.products.map((product) =>
            product ? (
              <Product key={product.id} type="alternate" product={product} />
            ) : undefined
          )}
        </div>
      </div>
      <PaginationButtons
        currentPage={queryParamPage}
        totalPages={totalPages}
        linkTo={linkWithAllParams}
      />
    </Layout>
  );
};

export default SearchPage;
