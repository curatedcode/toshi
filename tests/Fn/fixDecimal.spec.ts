import { expect, it } from "vitest";
import { fixDecimal } from "~/components/Fn/getTotals";

it("should return 420.00", () => {
  const totalBeforeTax = "420";

  expect(fixDecimal(totalBeforeTax)).toBe("420.00");
});

it("should return 420.10", () => {
  const totalBeforeTax = "420.1";

  expect(fixDecimal(totalBeforeTax)).toBe("420.10");
});

it("should return 420.10", () => {
  const totalBeforeTax = "420.1";

  expect(fixDecimal(totalBeforeTax)).toBe("420.10");
});
