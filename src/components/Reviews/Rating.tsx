import Link from "next/link";
import RatingStars from "./RatingStars";
import type { RatingProps } from "~/customTypes";

function Rating({ rating, link, _count }: RatingProps) {
  return (
    <Link
      href={link}
      className="flex w-fit items-center gap-1"
      title={rating ? `${rating} out of 5 stars` : "No reviews"}
    >
      <RatingStars rating={rating} />
      <span className="-mt-0.5 w-fit text-sky-600 transition-colors hover:text-toshi-red">
        {_count}
      </span>
    </Link>
  );
}

export default Rating;
