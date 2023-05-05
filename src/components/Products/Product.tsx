import Link from "next/link";
import type { ProductProps } from "~/customTypes";
import Image from "../Image";
import Rating from "../Reviews/Rating";

function Product({
  product,
  type = "default",
  imageHeight = 150,
  imageWidth = 200,
}: ProductProps) {
  const { id, name, price, images, reviews } = product;
  const { rating, _count } = reviews;

  const link = `/products/${id}`;

  if (type === "alternate") {
    return (
      <div className="inline-flex max-w-full bg-white">
        <Link href={link} aria-label={`Visit product page for ${name}`}>
          <Image
            src={images && images[0] && images[0].url}
            alt={name}
            height={imageHeight}
            width={imageWidth}
          />
        </Link>
        <div className="flex w-full flex-col">
          <Link
            href={link}
            className="line-clamp-2 text-xl font-medium transition-colors hover:text-toshi-red"
          >
            {name}
          </Link>
          <Rating rating={rating} _count={_count} link={`${link}#reviews`} />
          <Link href={link} className="text-lg font-medium">
            ${price}
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="w-fit max-w-full rounded-md">
      <Link
        href={link}
        aria-label={`Visit product page for ${name}`}
        className="w-fit"
      >
        <Image
          src={images && images[0] && images[0].url}
          alt={name}
          className="w-full"
          height={imageHeight}
          width={imageWidth}
        />
      </Link>
      <div className="flex flex-col">
        <Link
          href={link}
          className="line-clamp-1 w-fit text-sky-600 transition-colors hover:text-toshi-red"
        >
          {name}
        </Link>
        <Rating rating={rating} _count={_count} link={`${link}#reviews`} />
        <Link href={link} className="w-fit text-lg font-medium">
          ${price}
        </Link>
      </div>
    </div>
  );
}

export default Product;
