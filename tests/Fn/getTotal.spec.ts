import { expect, it } from "vitest";
import getTotals from "~/components/Fn/getTotals";

it("should return 449.40", () => {
  const totalBeforeTax = 420;
  const totals = getTotals(totalBeforeTax);

  expect(totals).toStrictEqual({
    taxToBeCollected: "29.40",
    totalAfterTax: "449.40",
  });
});

it("should return 428.00", () => {
  const totalBeforeTax = 400;
  const totals = getTotals(totalBeforeTax);

  expect(totals).toStrictEqual({
    taxToBeCollected: "28.00",
    totalAfterTax: "428.00",
  });
});
