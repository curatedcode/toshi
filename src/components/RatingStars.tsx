import { HalfStar, Star, StarFill } from "./Star";

function RatingStars({ rating }: { rating: number | null }) {
  if (!rating || rating < 0.5) {
    return (
      <div className="-mt-0.5 inline-flex w-fit items-center" aria-hidden>
        <Star className="fill-amber-400" />
        <Star className="fill-amber-400" />
        <Star className="fill-amber-400" />
        <Star className="fill-amber-400" />
        <Star className="fill-amber-400" />
      </div>
    );
  }

  if (rating < 1) {
    return (
      <div className="-mt-0.5 inline-flex w-fit items-center" aria-hidden>
        <HalfStar className="fill-amber-400" />
        <Star className="fill-amber-400" />
        <Star className="fill-amber-400" />
        <Star className="fill-amber-400" />
        <Star className="fill-amber-400" />
      </div>
    );
  }

  if (rating < 1.5) {
    return (
      <div className="-mt-0.5 inline-flex w-fit items-center" aria-hidden>
        <StarFill className="fill-amber-400" />
        <Star className="fill-amber-400" />
        <Star className="fill-amber-400" />
        <Star className="fill-amber-400" />
        <Star className="fill-amber-400" />
      </div>
    );
  }

  if (rating < 2) {
    return (
      <div className="-mt-0.5 inline-flex w-fit items-center" aria-hidden>
        <StarFill className="fill-amber-400" />
        <HalfStar className="fill-amber-400" />
        <Star className="fill-amber-400" />
        <Star className="fill-amber-400" />
        <Star className="fill-amber-400" />
      </div>
    );
  }

  if (rating < 2.5) {
    return (
      <div className="-mt-0.5 inline-flex w-fit items-center" aria-hidden>
        <StarFill className="fill-amber-400" />
        <StarFill className="fill-amber-400" />
        <Star className="fill-amber-400" />
        <Star className="fill-amber-400" />
        <Star className="fill-amber-400" />
      </div>
    );
  }

  if (rating < 3) {
    return (
      <div className="-mt-0.5 inline-flex w-fit items-center" aria-hidden>
        <StarFill className="fill-amber-400" />
        <StarFill className="fill-amber-400" />
        <HalfStar className="fill-amber-400" />
        <Star className="fill-amber-400" />
        <Star className="fill-amber-400" />
      </div>
    );
  }

  if (rating < 3.5) {
    return (
      <div className="-mt-0.5 inline-flex w-fit items-center" aria-hidden>
        <StarFill className="fill-amber-400" />
        <StarFill className="fill-amber-400" />
        <StarFill className="fill-amber-400" />
        <Star className="fill-amber-400" />
        <Star className="fill-amber-400" />
      </div>
    );
  }

  if (rating < 4) {
    return (
      <div className="-mt-0.5 inline-flex w-fit items-center" aria-hidden>
        <StarFill className="fill-amber-400" />
        <StarFill className="fill-amber-400" />
        <StarFill className="fill-amber-400" />
        <HalfStar className="fill-amber-400" />
        <Star className="fill-amber-400" />
      </div>
    );
  }

  if (rating < 4.5) {
    return (
      <div className="-mt-0.5 inline-flex w-fit items-center" aria-hidden>
        <StarFill className="fill-amber-400" />
        <StarFill className="fill-amber-400" />
        <StarFill className="fill-amber-400" />
        <StarFill className="fill-amber-400" />
        <Star className="fill-amber-400" />
      </div>
    );
  }

  if (rating < 5) {
    return (
      <div className="-mt-0.5 inline-flex w-fit items-center" aria-hidden>
        <StarFill className="fill-amber-400" />
        <StarFill className="fill-amber-400" />
        <StarFill className="fill-amber-400" />
        <StarFill className="fill-amber-400" />
        <HalfStar className="fill-amber-400" />
      </div>
    );
  }

  return (
    <div className="-mt-0.5 inline-flex w-fit items-center" aria-hidden>
      <StarFill className="fill-amber-400" />
      <StarFill className="fill-amber-400" />
      <StarFill className="fill-amber-400" />
      <StarFill className="fill-amber-400" />
      <StarFill className="fill-amber-400" />
    </div>
  );
}

export default RatingStars;
