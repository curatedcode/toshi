import { taxPercentage } from "~/customVariables";

function getTotals(totalBeforeTax: number): {
  taxToBeCollected: string;
  totalAfterTax: string;
} {
  const taxToBeCollected = (totalBeforeTax * taxPercentage).toFixed(2);
  const totalAfterTax = (totalBeforeTax + parseFloat(taxToBeCollected)).toFixed(
    2
  );

  // if there are no decimals or not 2 trailing zeros. Add them for readability
  function fixDecimal(val: string): string {
    const valAfterDecimal = val.split(".")[1];

    if (!valAfterDecimal) return val.concat(".00");
    if (valAfterDecimal.length >= 2) return val;

    return val.concat("0");
  }

  return {
    totalAfterTax: fixDecimal(totalAfterTax),
    taxToBeCollected: fixDecimal(taxToBeCollected),
  };
}

export default getTotals;
