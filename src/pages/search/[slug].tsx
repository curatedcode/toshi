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

const SearchPage: NextPage = () => {
  const { query } = useRouter();
  const slug = typeof query.slug === "string" ? query.slug : undefined;

  const queryClient = useQueryClient();

  const [priceListChoice, setPriceListChoice] = useState({
    min: undefined,
    max: undefined,
  } as { min: number | undefined; max: number | undefined });
  const prevPriceListChoice = useRef(priceListChoice);
  const [priceMin, setPriceMin] = useState<number>();
  const [priceMax, setPriceMax] = useState<number>();

  const [reviewListChoice, setReviewListChoice] = useState<number>();
  const prevReviewListChoice = useRef(reviewListChoice);

  const [categoryListChoice, setCategoryListChoice] = useState<string>();
  const prevCategoryListChoice = useRef(categoryListChoice);

  const [includeOutOfStock, setIncludeOutOfStock] = useState(false);
  const prevIncludeOutOfStock = useRef(includeOutOfStock);

  const [categoriesOnPage, setCategoriesOnPage] = useState<string[]>([]);

  const [totalPages, setTotalPages] = useState<number>();
  const [currentPage, setCurrentPage] = useState(1);
  const prevPage = useRef(currentPage);

  const { data, isFetching, refetch } = api.product.search.useQuery(
    {
      text: slug,
      filters: {
        price: priceListChoice,
        rating: reviewListChoice,
        category: categoryListChoice,
        includeOutOfStock,
      },
      categoriesOnPage,
      page: currentPage,
    },
    {
      keepPreviousData: true,
      staleTime: Infinity,
      onSuccess: () => window.scrollTo({ top: 0, left: 0 }),
    }
  );

  const categoryNames = data?.categories.map((category) => category);

  useEffect(() => {
    if (currentPage > 1) return;
    if (prevPage.current !== currentPage) {
      prevPage.current = currentPage;
      return void refetch();
    }
    setTotalPages(data?.totalPages ?? 0);
  }, [data, currentPage, refetch]);

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

  const ratings = [4, 3, 2, 1];

  function resetFilters() {
    setPriceListChoice({ min: undefined, max: undefined });
    setReviewListChoice(undefined);
    setCategoryListChoice(undefined);
    setIncludeOutOfStock(false);
    void queryClient.invalidateQueries(["product", "search"]);
    return void refetch();
  }

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

    function resetQuery() {
      setCurrentPage(1);
      return void refetch();
    }
    if (priceListChoice !== prevPriceListChoice.current) {
      prevPriceListChoice.current = priceListChoice;
      resetQuery();
    }
    if (reviewListChoice !== prevReviewListChoice.current) {
      prevReviewListChoice.current = reviewListChoice;
      resetQuery();
    }
    if (categoryListChoice !== prevCategoryListChoice.current) {
      prevCategoryListChoice.current = categoryListChoice;
      resetQuery();
    }
    if (includeOutOfStock !== prevIncludeOutOfStock.current) {
      prevIncludeOutOfStock.current = includeOutOfStock;
      resetQuery();
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
      title={`Search Toshi | ${slug ?? ""}`}
      description={`Search results for ${slug ?? ""} | Toshi`}
      className="flex flex-col"
    >
      <div className="flex">
        <div className="hidden w-fit bg-white md:flex md:flex-col">
          <button
            type="button"
            onClick={resetFilters}
            className="rounded-md border border-black border-opacity-60 bg-white px-2 text-lg shadow shadow-neutral-500 transition-colors hover:bg-neutral-100"
          >
            Reset filters
          </button>
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
              {ratings.map((rating) => (
                <button
                  type="button"
                  key={rating}
                  aria-label={`${rating} stars and up`}
                  onClick={() => setReviewListChoice(rating)}
                  className="inline-flex items-center gap-1 whitespace-nowrap border border-transparent hover:border-black"
                >
                  <RatingStars rating={rating} />
                  <span>& Up</span>
                </button>
              ))}
            </div>
          </div>
          <div>
            <span className="text-lg font-semibold">Department</span>
            <div className="grid">
              {data?.categories.map((category) => (
                <button
                  type="button"
                  value={category}
                  onChange={() => setCategoryListChoice(category)}
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
        currentPage={currentPage}
        setPage={setCurrentPage}
        totalPages={totalPages}
      />
    </Layout>
  );
};

export default SearchPage;
