import type { NextPage } from "next";
import { useRouter } from "next/router";
import Layout from "~/components/Layout";
import { api } from "~/utils/api";
import Product from "~/components/Product";
import { useEffect, useState, type ChangeEvent } from "react";
import RatingStars from "~/components/RatingStars";
import PriceInput from "~/components/Search/PriceInput";
import PaginationButtons from "~/components/Search/PaginationButtons";
import Link from "next/link";
import type { getLinkWithAllParamsProps } from "~/customTypes";

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

  const [priceFilter, setPriceFilter] = useState({
    min: undefined,
    max: undefined,
  } as { min: number | undefined; max: number | undefined });

  const [totalPages, setTotalPages] = useState<number>();

  function getLinkWithAllParams({
    text,
    page,
    category,
    rating,
    price,
    includeOutOfStock,
  }: getLinkWithAllParamsProps) {
    const searchText = text ? text : queryParamText ?? "";
    const searchPage = page ? page : queryParamPage;
    const searchCategory = category ? category : queryParamCategory ?? "";
    const searchRating = rating ? rating : Number(queryParamRating);
    const searchPrice = price ?? priceFilter;
    const searchIncludeOutOfStock = includeOutOfStock
      ? includeOutOfStock
      : queryParamIncludeOutOfStock;

    const link = `/search/${searchText}?page=${searchPage}&dept=${searchCategory}&rating=${searchRating}&pmin=${
      searchPrice.min ?? ""
    }&pmax=${searchPrice.max ?? ""}&includeOutOfStock=${String(
      searchIncludeOutOfStock
    )}`;

    return link;
  }

  const [queryEnabled, setQueryEnabled] = useState(true);

  const { data, isLoading } = api.product.search.useQuery(
    {
      text: queryParamText,
      filters: {
        price: {
          min: queryParamPriceMin ? Number(queryParamPriceMin) : undefined,
          max: queryParamPriceMax ? Number(queryParamPriceMax) : undefined,
        },
        rating: queryParamRating ? Number(queryParamRating) : undefined,
        category: queryParamCategory,
        includeOutOfStock: queryParamIncludeOutOfStock,
      },
      page: queryParamPage,
    },
    {
      keepPreviousData: true,
      staleTime: Infinity,
      onSuccess: () => window.scrollTo({ top: 0, left: 0 }),
      enabled: queryEnabled,
    }
  );

  useEffect(() => {
    if (isLoading) return;
    setQueryEnabled(false);
  }, [isLoading]);

  useEffect(() => {
    if (data && data.totalPages === totalPages) return;
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
              <Link
                href={getLinkWithAllParams({ price: priceFilter, page: 1 })}
                className="ml-1 h-8 rounded-md border border-black border-opacity-60 bg-white px-2 text-lg shadow shadow-neutral-500 transition-colors hover:bg-neutral-100"
              >
                Go
              </Link>
            </div>
          </div>
          <div className="flex flex-col gap-1">
            <span className="text-lg font-semibold">Customer Reviews</span>
            <div className="grid">
              <Link
                href={getLinkWithAllParams({ rating: 4, page: 1 })}
                aria-label="4 stars and up"
                className="inline-flex items-center gap-1 whitespace-nowrap border border-transparent hover:border-black"
              >
                <RatingStars rating={4} />
                <span>& Up</span>
              </Link>
              <Link
                href={getLinkWithAllParams({ rating: 3, page: 1 })}
                aria-label="3 stars and up"
                className="inline-flex items-center gap-1 whitespace-nowrap border border-transparent hover:border-black"
              >
                <RatingStars rating={3} />
                <span>& Up</span>
              </Link>
              <Link
                href={getLinkWithAllParams({ rating: 2, page: 1 })}
                aria-label="2 stars and up"
                className="inline-flex items-center gap-1 whitespace-nowrap border border-transparent hover:border-black"
              >
                <RatingStars rating={2} />
                <span>& Up</span>
              </Link>
              <Link
                href={getLinkWithAllParams({ rating: 1, page: 1 })}
                aria-label="1 star and up"
                className="inline-flex items-center gap-1 whitespace-nowrap border border-transparent hover:border-black"
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
                  className="transition-colors hover:text-toshi-red"
                >
                  {category}
                </Link>
              ))}
            </div>
          </div>
          <Link
            href={getLinkWithAllParams({ includeOutOfStock: true, page: 1 })}
            className="transition-colors hover:text-toshi-red"
          >
            Include out of stock
          </Link>
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
        linkTo={getLinkWithAllParams({})}
      />
    </Layout>
  );
};

export default SearchPage;
