import { useEffect, useState } from "react";
import type { CartProductProps } from "~/customTypes";
import QuantityControls from "./QuantityControls";
import { api } from "~/utils/api";
import Link from "next/link";
import Image from "../Image";
import Rating from "../Reviews/Rating";
import InternalLink from "../InternalLink";
import Button from "../Input/Button";
import { TrashIcon } from "@heroicons/react/24/outline";

function CartProduct({ data, cookieId, refetch }: CartProductProps) {
  const { product, quantity: initialQuantity } = data;

  const [quantity, setQuantity] = useState(initialQuantity);

  const { mutate: updateQuantity } = api.cart.updateQuantity.useMutation();

  const { mutate: removeProduct } = api.cart.removeProduct.useMutation({
    onSuccess: () => refetch(),
  });

  useEffect(() => {
    updateQuantity({ cartProductId: data.id, quantity, cookieId });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [quantity]);

  const {
    id,
    name,
    images,
    company,
    price,
    quantity: maxQuantity,
    reviews,
  } = product;

  const link = `/products/${id}`;

  return (
    <div className="flex flex-col justify-between gap-2 pb-4 pt-6 md:flex-row">
      <div className="flex flex-col gap-2 md:flex-row">
        <Link href={link} aria-label={`Visit product page for ${name}`}>
          <div className="bg-neutral-200 md:max-w-ss lg:max-w-xxs">
            <Image
              src={images && images[0] && images[0].url}
              alt={name}
              height={612}
              width={612}
              className="w-full rounded-md"
            />
          </div>
        </Link>
        <div className="flex flex-col">
          <Link
            href={link}
            className="line-clamp-2 w-fit text-lg font-medium leading-tight transition-colors hover:text-toshi-green lg:text-xl"
          >
            {name}
          </Link>
          <div className="flex gap-1">
            <span className="whitespace-nowrap">Sold by:</span>
            <InternalLink
              href={`/companies/${company.id}`}
              className="line-clamp-1"
            >
              {company.name}
            </InternalLink>
          </div>
          <Rating
            rating={reviews.rating}
            _count={reviews._count}
            link={`${link}#reviews`}
          />
          <Link
            href={link}
            className="flex w-fit items-center gap-0.5 text-2xl font-medium transition-colors hover:text-toshi-green"
          >
            <span className="-mt-1.5 text-base">$</span>
            <span id="price">{price}</span>
          </Link>
        </div>
      </div>
      <div className="flex justify-between gap-4 md:flex-col">
        <div className="flex w-fit flex-col items-center gap-1 self-center md:self-start">
          <div className="flex items-center gap-2">
            <span className="md:hidden">Qty:</span>
            <QuantityControls
              maxQuantity={maxQuantity}
              quantity={quantity}
              setQuantity={setQuantity}
              className="mt-3 self-center md:mt-0"
            />
          </div>
        </div>
        <Button
          style="toshi"
          className="mb-2.5 self-end md:mb-0 md:w-full"
          title="Delete from cart"
          onClick={() => removeProduct({ productId: product.id, cookieId })}
        >
          <TrashIcon
            className="relative left-1/2 w-6 -translate-x-1/2"
            aria-hidden
          />
        </Button>
      </div>
    </div>
  );
}

export default CartProduct;
