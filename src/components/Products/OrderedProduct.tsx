import type { OrderedProductProps } from "~/customTypes";
import Image from "../Image";
import InternalLink from "../InternalLink";
import Link from "next/link";

function OrderedProduct({
  product,
  imageHeight = 150,
  imageWidth = 200,
}: OrderedProductProps) {
  const { id, name, price, images, company } = product;

  return (
    <div className="flex justify-between">
      <div className="grid auto-cols-min grid-cols-2">
        <Image
          src={images && images[0] && images[0].url}
          alt={name}
          height={imageHeight}
          width={imageWidth}
          className="row-span-full"
        />
        <p>{name}</p>
        <div className="flex">
          <span>Sold by:</span>
          <InternalLink href={company.id}>{company.name}</InternalLink>
        </div>
        <span className="text-toshi-red">${price}</span>
      </div>
      <Link
        href={`/product/${id}#reviews`}
        className="rounded-md bg-web-white px-2 py-1"
      >
        Leave a review
      </Link>
    </div>
  );
}

export default OrderedProduct;
