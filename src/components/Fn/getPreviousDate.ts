import dayjs from "dayjs";

/**
 * @param format short MMM-DD-YYYY; e.g. Jan 1, 2020
 * @param format long MMMM-DD-YYYY; e.g. January 1, 2020
 * @returns date - toSubtract; e.g. Jan 1, 2020 - 10 days = Dec 22, 2019
 */
function getPreviousDate(
  toSubtract: number,
  type: "day" | "week" | "month" | "year",
  format: "short" | "long" = "long"
) {
  const date = Date.now();

  if (format === "short") {
    return dayjs(date).subtract(toSubtract, type).format("MMM D, YYYY");
  }

  return dayjs(date).subtract(toSubtract, type).format("MMMM D, YYYY");
}

export default getPreviousDate;
