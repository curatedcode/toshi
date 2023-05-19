import Link from "next/link";
import type { ProductProps } from "~/customTypes";
import Image from "../Image";
import Rating from "../Reviews/Rating";
import InternalLink from "../InternalLink";

function Product({
  product,
  type = "default",
  imageHeight = 150,
  imageWidth = 200,
  imageLoading = "lazy",
}: ProductProps) {
  const { id, name, price, images, reviews, company } = product;
  const { rating, _count } = reviews;

  const link = `/products/${id}`;

  if (type === "alternate") {
    return (
      <div className="flex flex-col gap-2 md:flex-row">
        <Link href={link} aria-label={`Visit product page for ${name}`}>
          <div className="bg-neutral-200 md:max-w-xs">
            <Image
              src={images && images[0] && images[0].url}
              alt={name}
              height={imageHeight}
              width={imageWidth}
              loading={imageLoading}
              className="w-full rounded-md"
            />
          </div>
        </Link>
        <div className="flex flex-col">
          <Link
            href={link}
            className="line-clamp-2 w-fit text-xl font-medium leading-tight transition-colors hover:text-toshi-red md:text-2xl"
          >
            {name}
          </Link>
          {company && (
            <div className="flex gap-1">
              <span className="whitespace-nowrap text-sm">Sold by:</span>
              <InternalLink
                href={`/companies/${company.id}`}
                className="line-clamp-1 text-sm"
              >
                {company.name}
              </InternalLink>
            </div>
          )}
          <Rating rating={rating} _count={_count} link={`${link}#reviews`} />
          <Link
            href={link}
            className="flex w-fit items-center gap-0.5 text-2xl font-medium transition-colors hover:text-toshi-red"
          >
            <span className="-mt-1.5 text-base">$</span>
            <span>{price}</span>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-2">
      <Link
        href={link}
        aria-label={`Visit product page for ${name}`}
        className="w-fit"
      >
        <Image
          src={images && images[0] && images[0].url}
          alt={name}
          height={imageHeight}
          width={imageWidth}
          loading={imageLoading}
          className="w-full rounded-md"
        />
      </Link>
      <div className="flex w-full flex-col">
        <InternalLink
          href={link}
          className="line-clamp-2 w-fit text-lg font-medium leading-tight transition-colors hover:text-toshi-red"
        >
          {name}
        </InternalLink>
        <Rating rating={rating} _count={_count} link={`${link}#reviews`} />
        <Link
          href={link}
          className="flex w-fit items-center gap-0.5 text-2xl font-medium transition-colors hover:text-toshi-red"
        >
          <span className="-mt-1.5 text-base">$</span>
          <span>{price}</span>
        </Link>
      </div>
    </div>
  );
}

export default Product;
