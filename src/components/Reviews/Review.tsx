import type { ReviewProps } from "~/customTypes";
import RatingStars from "./RatingStars";
import Avatar from "../Avatar";
import getRelativeTime from "../Fn/getRelativeDate";
import { useEffect, useRef, useState } from "react";
import { avatarUrls } from "~/customVariables";

function Review({ review }: { review: ReviewProps }) {
  const { id, title, body, rating, createdAt, user } = review;

  const shortenedLastName = user.lastName[0] ? `${user.lastName[0]}.` : "";
  const name = `${user.firstName} ${shortenedLastName}`;

  const [showMore, setShowMore] = useState(false);

  const bodyRef = useRef<HTMLParagraphElement>(null);
  const [isTextInitiallyClamped, setIsTextInitiallyClamped] = useState(false);

  useEffect(() => {
    if (!bodyRef.current) return;
    setIsTextInitiallyClamped(
      bodyRef.current.scrollHeight > bodyRef.current.clientHeight
    );
  }, [bodyRef]);

  return (
    <div key={id} className="pb-2 pt-4">
      <div className="flex flex-col gap-2 pb-2">
        <div className="flex gap-2">
          <Avatar
            alt=""
            src={avatarUrls[user.avatarColor] ?? "/profile-placeholder.jpg"}
          />
          <div className="flex flex-col">
            <span>{name}</span>
            <span className="text-sm">• {getRelativeTime(createdAt)}</span>
          </div>
        </div>
        <RatingStars rating={rating} />
      </div>
      <div>
        <span className="text-lg font-semibold leading-tight">{title}</span>
        <p
          id="reviewBody"
          className={showMore ? "" : "line-clamp-3"}
          ref={bodyRef}
        >
          {body}
        </p>
        {body && (
          <button
            type="button"
            onClick={() => setShowMore((prev) => !prev)}
            className={`text-sm text-sky-600 underline underline-offset-1 ${
              isTextInitiallyClamped ? "" : "hidden"
            }`}
            aria-expanded={showMore}
            aria-controls="reviewBody"
          >
            {showMore ? "Show less..." : "Show more..."}
          </button>
        )}
      </div>
    </div>
  );
}

export default Review;
