import { useEffect, useState } from "react";
import type { CartProductProps } from "~/customTypes";
import QuantityControls from "./QuantityControls";
import { api } from "~/utils/api";
import Link from "next/link";
import Image from "../Image";
import Rating from "../Reviews/Rating";
import InternalLink from "../InternalLink";

function CartProduct({ data, cookieId }: CartProductProps) {
  const { product, quantity: initialQuantity } = data;

  const [quantity, setQuantity] = useState(initialQuantity);

  const { mutate: updateQuantity } = api.cart.updateQuantity.useMutation();

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

  const productLink = `/products/${id}`;

  return (
    <div className="flex flex-col justify-between gap-2 pb-4 pt-6 md:flex-row">
      <div className="flex max-w-full flex-col gap-1 md:flex-row">
        <Link href={productLink} aria-label={`Visit product page for ${name}`}>
          <div className="bg-neutral-200">
            <Image
              src={images && images[0] && images[0].url}
              alt={name}
              height={150}
              width={200}
              loading="eager"
              className="w-full rounded-md md:max-w-md"
            />
          </div>
        </Link>
        <div className="flex w-full flex-col gap-1">
          <Link
            href={productLink}
            className="line-clamp-3 w-fit text-xl font-medium leading-tight transition-colors hover:text-toshi-red"
          >
            {name}
          </Link>
          <div>
            <span>Sold by: </span>
            <InternalLink href={`/companies/${company.id}`}>
              {company.name}
            </InternalLink>
          </div>
          <Rating
            rating={reviews.rating}
            _count={reviews._count}
            link={`${productLink}#reviews`}
          />
          <Link
            href={productLink}
            className="flex w-fit items-center gap-0.5 text-2xl font-medium"
          >
            <span className="-mt-1.5 text-base">$</span>
            <span>{price}</span>
          </Link>
        </div>
      </div>
      <div className="flex w-fit flex-col items-center gap-2 self-center md:self-start">
        <span className="text-lg">Quantity</span>
        <QuantityControls
          maxQuantity={maxQuantity}
          quantity={quantity}
          setQuantity={setQuantity}
        />
      </div>
    </div>
  );
}

export default CartProduct;