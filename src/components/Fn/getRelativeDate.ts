import dayjs from "dayjs";
import updateLocale from "dayjs/plugin/updateLocale";
import relativeTime from "dayjs/plugin/relativeTime";
dayjs.extend(relativeTime);
dayjs.extend(updateLocale);

const localeList = dayjs.Ls;

const thresholds = [
  { l: "s", r: 1 },
  { l: "m", r: 1 },
  { l: "mm", r: 59, d: "minute" },
  { l: "h", r: 1 },
  { l: "hh", r: 23, d: "hour" },
];

dayjs.updateLocale("en", {
  relativeTime: {
    ...localeList["en"]?.relativeTime,
    s: "%ds",
    m: "1m",
    mm: "%dm",
    h: "1h",
    hh: "%dh",
  },
  config: {
    thresholds: thresholds,
  },
});

function getRelativeTime(date: Date) {
  const currentDate = dayjs(new Date());

  const isSameYear = currentDate.isSame(date, "year");
  const isSameDay = currentDate.isSame(date, "day");

  if (!isSameYear) {
    return dayjs(date).format("MMM D YYYY");
  }

  if (!isSameDay) {
    return dayjs(date).format("MMM D");
  }

  return `${currentDate.from(date, true)} ago`;
}

export default getRelativeTime;
