/* eslint-disable @typescript-eslint/no-misused-promises */
import { TrashIcon } from "@heroicons/react/24/outline";
import { zodResolver } from "@hookform/resolvers/zod";
import { type NextPage } from "next";
import { useRouter } from "next/router";
import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import getFormattedDate from "~/components/Fn/getFormattedDate";
import getRelativeTime from "~/components/Fn/getRelativeDate";
import Layout from "~/components/Layout";
import Product from "~/components/Products/Product";
import TextInputField from "~/components/Input/TextInputField";
import { max_list_title_char } from "~/customVariables";
import { api } from "~/utils/api";

const schema = z.object({
  title: z
    .string()
    .min(1, { message: "Please enter a list title" })
    .max(max_list_title_char, {
      message: `List title must not be longer than ${max_list_title_char} characters`,
    }),
  visibility: z.enum(["Public", "Private"]),
});

const ListPage: NextPage = () => {
  const { query } = useRouter();
  const listId = query.slug as string;

  const hasEditParam = typeof query.edit === "string";

  const editParam = hasEditParam ? (query.edit as string) : undefined;

  const [editing, setEditing] = useState(editParam === "true");

  const { data: list, refetch } = api.list.getOne.useQuery({ listId });

  const { mutate: updateTitle, isLoading: titleSaving } =
    api.list.updateTitle.useMutation();
  const { mutate: updateVisibility, isLoading: visibilitySaving } =
    api.list.updateVisibility.useMutation();
  const { mutate: removeProduct, isLoading: removingProduct } =
    api.list.removeProduct.useMutation();

  const isLoading = useRef(false);

  useEffect(() => {
    if (titleSaving || visibilitySaving || removingProduct) {
      isLoading.current = true;
    }
    isLoading.current = false;
  }, [titleSaving, visibilitySaving, removingProduct]);

  const {
    name = "List",
    products,
    isPrivate,
    createdAt,
    updatedAt,
  } = list || {};

  const {
    register,
    handleSubmit,
    formState: { errors },
    getValues,
    reset,
  } = useForm<z.infer<typeof schema>>({ resolver: zodResolver(schema) });

  const [productsToRemove, setProductsToRemove] = useState<string[]>([]);

  function onSubmit() {
    updateTitle({ listId, name: getValues("title") });
    const isPrivate = getValues("visibility") === "Private";
    updateVisibility({ listId, isPrivate });
    removeProduct({ listId, productId: productsToRemove });
    void refetch();
    setEditing(false);
  }

  const titleError = errors.title?.message;

  function resetForm() {
    reset();
    setEditing(false);
  }

  // warn before exit if editing
  useEffect(() => {
    function handleExit(e: BeforeUnloadEvent) {
      e.preventDefault();
      e.returnValue = "";
    }
    if (editing) {
      window.addEventListener("beforeunload", handleExit);
      return () => window.removeEventListener("beforeunload", handleExit);
    }
  }, [editing]);

  const { mutate: addToCart } = api.cart.addProduct.useMutation();

  return (
    <Layout
      title={`${list?.name ? `${list?.name} list` : "Your list"} | Toshi`}
      description="Your list on Toshi.com"
      className="flex flex-col px-5"
    >
      {editing ? (
        <form
          className="my-2 mt-6 flex max-w-4xl flex-col self-center"
          onSubmit={handleSubmit(onSubmit)}
        >
          <div className="flex gap-2 self-center md:mb-4">
            <button
              type="button"
              disabled={isLoading.current}
              className="h-fit w-20 rounded-md bg-neutral-200 px-2 py-1 transition-colors focus-within:outline-neutral-500 hover:bg-neutral-300"
              onClick={resetForm}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading.current}
              className="h-fit w-20 rounded-md bg-toshi-red px-2 py-1 text-white transition-opacity focus-within:outline-neutral-500 hover:bg-opacity-95"
            >
              {isLoading.current ? "Saving" : "Save"}
            </button>
          </div>
          <div className="my-4 flex flex-col items-center justify-center gap-4 md:flex-row">
            <TextInputField
              internalLabel="title"
              visibleLabel="List title"
              maxLength={max_list_title_char}
              error={titleError}
              defaultValue={list?.name}
              className="w-full md:w-fit"
              classNameContainer="w-full md:w-fit"
              {...register("title")}
            />
            <div className="flex w-full flex-col md:w-[229px]">
              <label htmlFor="visibility" className="ml-1 font-semibold">
                Visibility
              </label>
              <select
                id="visibility"
                className="duration-50 rounded-md border-2 bg-neutral-100 px-3 py-[0.3rem] transition-shadow focus-within:border-neutral-500 focus-within:shadow-md focus-within:shadow-neutral-400 focus-within:outline-none hover:cursor-pointer"
                {...register("visibility")}
              >
                <option value={"Public"}>Public</option>
                <option value={"Private"}>Private</option>
              </select>
            </div>
          </div>
          <div className="flex flex-col">
            <span className="ml-1 font-semibold">Products</span>
            <div className="grid grid-cols-1 gap-4 gap-y-8 md:grid-cols-4">
              {list?.products?.map((product) => (
                <div
                  key={product.id}
                  className={`flex w-fit flex-col ${
                    productsToRemove.includes(product.id) ? "hidden" : ""
                  }`}
                >
                  <Product product={product} />
                  <button
                    type="button"
                    title="Remove from list"
                    onClick={() =>
                      setProductsToRemove((prev) => prev.concat([product.id]))
                    }
                    className="mt-1 w-fit rounded-md bg-toshi-red px-2 py-1 font-semibold text-white"
                  >
                    <TrashIcon className="w-6" aria-hidden />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </form>
      ) : (
        <>
          <h1 className="my-3 text-3xl md:text-4xl">{`${name} ${
            isPrivate ? "" : "(Public)"
          }`}</h1>
          <div className="flex flex-col gap-4 rounded-md border border-neutral-300 pb-4">
            <div className="flex flex-col gap-2 rounded-t-md border-b border-b-neutral-300 bg-neutral-100 px-4 py-3 text-neutral-600 md:flex-row md:gap-16">
              <div className="flex items-start md:flex-col">
                <h2 className="md:text-sm">CREATED ON</h2>
                <span className="mr-2 md:hidden">:</span>
                <span>{createdAt && getFormattedDate(createdAt)}</span>
              </div>
              <div className="flex items-start md:flex-col">
                <h2 className="md:text-sm">LAST UPDATED</h2>
                <span className="mr-2 md:hidden">:</span>
                <span>{updatedAt && getRelativeTime(updatedAt)}</span>
              </div>
              <div className="flex items-start md:ml-auto md:flex-col">
                <h2 className="md:text-sm">PRODUCTS</h2>
                <span className="mr-2 md:hidden">:</span>
                <span>{products ? products.length : 0}</span>
              </div>
              <div className="flex w-full gap-2 md:hidden">
                <button
                  type="button"
                  onClick={() => setEditing(true)}
                  className="w-full min-w-[12rem] rounded-md bg-neutral-200 px-2 py-1 text-center transition-colors hover:bg-neutral-300"
                >
                  Edit list
                </button>
              </div>
            </div>
            <div className="flex flex-col justify-between gap-4 px-4 md:flex-row">
              <div className="order-last hidden w-48 flex-col gap-2 md:flex">
                <button
                  type="button"
                  onClick={() => setEditing(true)}
                  className="w-full min-w-[12rem] rounded-md bg-neutral-200 px-2 py-1 text-center transition-colors hover:bg-neutral-300"
                >
                  Edit list
                </button>
              </div>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                {products?.map((product) => (
                  <div key={product.id}>
                    <Product product={product} />
                    <button
                      type="button"
                      onClick={() =>
                        addToCart({ productId: product.id, quantity: 1 })
                      }
                      className="mb-4 mt-2 w-fit rounded-md bg-toshi-red px-6 py-1 font-semibold text-white"
                    >
                      Add to cart
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </>
      )}
    </Layout>
  );
};

export default ListPage;
