import Link from "next/link";
import Image from "../Image";
import Rating from "../Reviews/Rating";
import InternalLink from "../InternalLink";
import type { ProductType } from "~/customTypes";

function ListProduct({ product }: { product: ProductType }) {
  const {
    id,
    name,
    price,
    images,
    reviews,
    company = { id: "", name: "" },
  } = product || {};
  const { rating, _count } = reviews;

  const link = `/products/${id}`;

  return (
    <div className="flex flex-col gap-2" id="product">
      <Link
        href={link}
        aria-label={`Visit product page for ${name}`}
        className="w-fit"
      >
        <Image
          src={images && images[0] && images[0].url}
          alt={name}
          height={150}
          width={200}
          className="w-full rounded-md"
        />
      </Link>
      <div className="flex flex-col">
        <InternalLink href={link} className="line-clamp-2 text-xl">
          {name}
        </InternalLink>
        <div className="flex gap-1">
          <span className="whitespace-nowrap">Sold by:</span>
          <InternalLink
            href={`/companies/${company.id}`}
            className="line-clamp-1"
          >
            {company.name}
          </InternalLink>
        </div>
        <Rating rating={rating} _count={_count} link={`${link}#reviews`} />
        <Link
          href={link}
          className="flex w-fit items-center gap-0.5 text-2xl font-medium transition-colors hover:text-toshi-green"
        >
          <span className="-mt-1.5 text-base">$</span>
          <span id="price">{price}</span>
        </Link>
      </div>
    </div>
  );
}

export default ListProduct;
