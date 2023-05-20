import dayjs from "dayjs";

/**
 * @param type short MMM D, YYYY; e.g. Jan 1, 2020
 * @param type - long MMMM D, YYYY; e.g. January 1, 2020 - Default
 */
function getFormattedDate(
  date: Date | string,
  type: "short" | "long" = "long"
) {
  if (type === "short") {
    return dayjs(date).format("MMM D, YYYY");
  }

  return dayjs(date).format("MMMM D, YYYY");
}

export default getFormattedDate;
