import { expect, it } from "vitest";
import getProductRating from "~/components/Fn/getProductRating";

it("should return rating of 4.6", () => {
  const reviews = [
    { rating: 2.6 },
    { rating: 5 },
    { rating: 1.3 },
    { rating: 4 },
    { rating: 2.1 },
    { rating: 3.5 },
  ];

  expect(getProductRating(reviews)).toEqual(3.1);
});
