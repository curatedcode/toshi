import type { OrderedProductProps } from "~/customTypes";
import Image from "../Image";
import InternalLink from "../InternalLink";

function OrderedProduct({
  product,
  imageHeight = 150,
  imageWidth = 200,
}: OrderedProductProps) {
  const { priceAtPurchase, product: productData } = product;
  const { id, name, images, company } = productData;

  return (
    <div className="flex flex-col gap-2 md:flex-row">
      <Image
        src={images && images[0] && images[0].url}
        alt={name}
        height={imageHeight}
        width={imageWidth}
        className="w-full md:max-w-xs"
      />
      <div className="flex flex-col justify-between">
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
          <span className="text-toshi-red">${priceAtPurchase}</span>
        </div>
        <div className="md:w-48">
          <button
            type="button"
            onClick={() => {
              null;
            }}
            className="mt-2 min-w-full rounded-md bg-neutral-200 px-4 py-1 transition-colors hover:bg-neutral-300 md:mt-0 md:w-fit"
          >
            Buy again
          </button>
        </div>
      </div>
    </div>
  );
}

export default OrderedProduct;
