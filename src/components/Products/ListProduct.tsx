import type { ListProductProps } from "~/customTypes";
import Image from "../Image";
import Link from "next/link";
import RatingStars from "../RatingStars";

function ListProduct({
  product,
  imageHeight = 150,
  imageWidth = 200,
}: ListProductProps) {
  const { id, name, price, images, reviews } = product;
  const { rating, _count } = reviews;

  const link = `/products/${id}`;

  return (
    <div className="flex">
      <Link href={link} aria-label={`Visit product page for ${name}`}>
        <Image
          src={images && images[0] && images[0].url}
          alt={name}
          loading="eager"
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
        <Link
          href={`${link}#reviews`}
          className="flex w-fit items-center gap-1"
          title={rating ? `${rating} out of 5 stars` : "No reviews"}
        >
          <RatingStars rating={rating} />
          <span className="w-fit text-sky-600 transition-colors hover:text-toshi-red">
            {_count}
          </span>
        </Link>
        <Link href={link} className="text-lg font-medium">
          ${price}
        </Link>
      </div>
      <div>
        <button type="button" onClick={() => "add to cart"}>
          Add to cart
        </button>
        {/**
         * @TODO After adding to cart "view cart" link needs to be visible
         * @TODO if in cart be able to adjust quantity
         */}
      </div>
    </div>
  );
}

export default ListProduct;
