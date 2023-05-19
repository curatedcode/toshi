/* eslint-disable @typescript-eslint/no-misused-promises */
import type { OrderedProductProps } from "~/customTypes";
import Image from "../Image";
import InternalLink from "../InternalLink";
import Link from "next/link";
import { useEffect, useState } from "react";
import { api } from "~/utils/api";
import TextInputField from "../Input/TextInputField";
import { useForm } from "react-hook-form";
import type { z } from "zod";
import {
  max_review_body_char,
  max_review_title_char,
  reviewSchema,
} from "~/customVariables";
import { zodResolver } from "@hookform/resolvers/zod";
import TextAreaInputField from "../Input/TextAreaInputField";
import SelectInputField from "../Input/SelectInputField";
import Button from "../Input/Button";

function OrderedProduct({
  product,
  imageHeight = 150,
  imageWidth = 200,
  buttons,
}: OrderedProductProps) {
  const { priceAtPurchase, product: productData } = product;
  const { id, name, images, company } = productData;

  const productLink = `/products/${id}`;

  const [addingReview, setAddingReview] = useState(false);

  const { mutate: createReview } = api.product.createReview.useMutation({
    onSuccess: () => setAddingReview(false),
  });

  const {
    formState: { errors },
    reset,
    register,
    handleSubmit,
    getValues,
  } = useForm<z.infer<typeof reviewSchema>>({
    resolver: zodResolver(reviewSchema),
  });

  const titleError = errors.title?.message;
  const ratingError = errors.rating?.message;
  const bodyError = errors.body?.message;

  // warn before exit if editing
  useEffect(() => {
    function handleExit(e: BeforeUnloadEvent) {
      e.preventDefault();
      e.returnValue = "";
    }
    if (addingReview) {
      window.addEventListener("beforeunload", handleExit);
      return () => window.removeEventListener("beforeunload", handleExit);
    }
  }, [addingReview]);

  return (
    <div className="flex flex-col justify-between gap-4">
      <div className="flex flex-col gap-1">
        <Link href={`/products/${id}`} className="w-fit">
          <Image
            src={images && images[0] && images[0].url}
            alt={name}
            height={imageHeight}
            width={imageWidth}
            className="w-full rounded-md"
          />
        </Link>
        <div className="flex flex-col">
          <InternalLink
            href={`/products/${id}`}
            className="line-clamp-2 text-lg md:text-xl"
          >
            {name}
          </InternalLink>
          <div className="flex gap-1">
            <span className="whitespace-nowrap text-sm">Sold by:</span>
            <InternalLink
              href={`/companies/${company.id}`}
              className="line-clamp-1 text-sm"
            >
              {company.name}
            </InternalLink>
          </div>
          <Link
            href={productLink}
            className="mt-1 flex w-fit items-center gap-0.5 text-2xl font-medium transition-colors hover:text-toshi-red"
          >
            <span className="-mt-1.5 text-base">$</span>
            <span>{priceAtPurchase}</span>
          </Link>
        </div>
      </div>
      {buttons && (
        <div className="mt-2 flex w-full flex-col gap-2 xl:flex-row">
          <Button
            onClick={() => setAddingReview(true)}
            className="md:basis-1/2"
          >
            Add review
          </Button>
          <Button link={{ href: productLink }} className="md:basis-1/2">
            Buy again
          </Button>
        </div>
      )}
      <form
        onSubmit={handleSubmit(() =>
          createReview({
            productId: id,
            title: getValues("title"),
            body: getValues("body"),
            rating: getValues("rating"),
          })
        )}
        className={addingReview ? "flex w-full flex-col gap-2" : "hidden"}
      >
        <SelectInputField
          internalLabel="rating"
          error={ratingError}
          visibleLabel="Rating"
          options={[1, 1.5, 2, 2.5, 3, 3.5, 4, 4.5, 5]}
          {...register("rating")}
        />
        <TextInputField
          internalLabel="title"
          error={titleError}
          maxLength={max_review_title_char}
          visibleLabel="Title"
          {...register("title")}
        />
        <TextAreaInputField
          internalLabel="body"
          error={bodyError}
          maxLength={max_review_body_char}
          visibleLabel="Body"
          {...register("body")}
        />
        <div className="flex w-full flex-col gap-2 self-end justify-self-end md:flex-row">
          <button
            type="button"
            onClick={() => {
              setAddingReview(false);
              reset();
            }}
            className="rounded-md bg-neutral-200 px-4 py-1 font-semibold transition-colors hover:bg-neutral-300 md:basis-1/2"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="rounded-md bg-toshi-red px-4 py-1 font-semibold text-white transition-opacity hover:bg-opacity-95 md:basis-1/2"
          >
            Submit
          </button>
        </div>
      </form>
    </div>
  );
}

export default OrderedProduct;
