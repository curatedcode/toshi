import type { ReviewProps } from "~/customTypes";
import RatingStars from "./RatingStars";
import Avatar from "../Avatar";
import getRelativeTime from "../Fn/getRelativeDate";
import { useState } from "react";

function Review({ review }: { review: ReviewProps }) {
  const { id, title, body, rating, createdAt, user } = review;

  const shortenedLastName = user.lastName[0] ? `${user.lastName[0]}.` : "";
  const name = `${user.firstName} ${shortenedLastName}`;

  const [showMore, setShowMore] = useState(false);

  return (
    <div key={id} className="pb-2 pt-4">
      <div className="flex flex-col gap-2 pb-2">
        <div className="flex gap-2">
          <Avatar alt="" src={user.image ?? "/profile-placeholder.jpg"} />
          <div className="flex flex-col">
            <span>{name}</span>
            <span className="text-sm">• {getRelativeTime(createdAt)}</span>
          </div>
        </div>
        <RatingStars rating={rating} />
      </div>
      <div>
        <span className="text-lg font-semibold leading-tight">{title}</span>
        <p className={showMore ? "" : "line-clamp-3"}>{body}</p>
        {body && (
          <button
            type="button"
            onClick={() => setShowMore((prev) => !prev)}
            className="text-sm text-sky-600 underline underline-offset-1"
          >
            {showMore ? "Show less..." : "Show more..."}
          </button>
        )}
      </div>
    </div>
  );
}

export default Review;
