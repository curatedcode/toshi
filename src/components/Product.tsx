import Link from "next/link";
import type { ProductProps } from "~/customTypes";
import Image from "./Image";
import RatingStars from "./RatingStars";

function Product({
  product,
  type = "default",
}: {
  product: ProductProps;
  type?: "default" | "alternate";
}) {
  const { id, name, price, image, reviews } = product;
  const { rating, _count } = reviews;

  const link = `/product/${id}`;

  const reviewTitle = rating ? `${rating} out of 5 stars` : "No reviews";

  if (type === "alternate") {
    return (
      <Link href={link} className="inline-flex max-w-full bg-white">
        <Image
          src={image?.url}
          alt={name}
          loading="eager"
          className="bg-white"
          height={150}
          width={200}
        />
        <div className="flex w-full flex-col">
          <span className="line-clamp-2 text-xl font-medium transition-colors hover:text-toshi-red">
            {name}
          </span>
          <div className="flex w-fit items-center gap-1" title={reviewTitle}>
            <RatingStars rating={rating} />
            <span className="w-fit text-sky-600 transition-colors hover:text-toshi-red">
              {_count}
            </span>
          </div>
          <div className="inline-flex items-center font-medium">
            <span>$</span>
            <span className="text-xl">{price}</span>
          </div>
        </div>
      </Link>
    );
  }

  return (
    <Link href={link} className="max-w-full rounded-md">
      <Image
        src={image?.url}
        alt={name}
        loading="eager"
        className="w-full"
        height={150}
        width={200}
      />
      <div className="flex flex-col">
        <span className="line-clamp-1 w-fit text-sky-600 transition-colors hover:text-toshi-red">
          {name}
        </span>
        <div className="flex w-fit items-center gap-1" title={reviewTitle}>
          <RatingStars rating={rating} />
          <span className="w-fit text-sky-600 transition-colors hover:text-toshi-red">
            {_count}
          </span>
        </div>
        <span className="text-lg font-medium">${price}</span>
      </div>
    </Link>
  );
}

export default Product;
