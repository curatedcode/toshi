import type { OrderedProductProps } from "~/customTypes";
import Image from "../Image";
import InternalLink from "../InternalLink";
import Link from "next/link";

function OrderedProduct({
  product,
  imageHeight = 150,
  imageWidth = 200,
}: OrderedProductProps) {
  const { priceAtPurchase, product: productData } = product;
  const { id, name, images, company } = productData;

  return (
    <div className="flex flex-col justify-between gap-4">
      <div className="flex flex-col gap-2">
        <Link href={`/products/${id}`} className="w-fit">
          <Image
            src={images && images[0] && images[0].url}
            alt={name}
            height={imageHeight}
            width={imageWidth}
            className="w-full rounded-md"
          />
        </Link>
        <div className="grid gap-1">
          <InternalLink
            href={`/products/${id}`}
            className="line-clamp-2 text-xl"
          >
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
          <div className="flex w-fit items-center gap-0.5 text-2xl font-medium">
            <span className="-mt-1.5 text-base">$</span>
            <span>{priceAtPurchase}</span>
          </div>
        </div>
      </div>
      <Link
        href={`/products/${id}`}
        className="mt-2 w-full self-end justify-self-end rounded-md bg-neutral-200 px-4 py-1 text-center transition-colors hover:bg-neutral-300"
      >
        Buy again
      </Link>
    </div>
  );
}

export default OrderedProduct;
