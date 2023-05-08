/* eslint-disable @typescript-eslint/no-misused-promises */
import { Transition } from "@headlessui/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { type NextPage } from "next";
import { Fragment, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import InternalLink from "~/components/InternalLink";
import Layout from "~/components/Layout";
import TextInputField from "~/components/TextInputField";
import { max_list_desc_char, max_list_title_char } from "~/customVariables";
import { api } from "~/utils/api";

const schema = z.object({
  title: z
    .string()
    .min(1, { message: "Please enter a list title" })
    .max(max_list_title_char),
  description: z.string().max(max_list_desc_char).nullish(),
  isPrivate: z.enum(["private", "public"]),
});

const CreateListPage: NextPage = () => {
  const [listCreated, setListCreated] = useState(false);
  const [newListId, setNewListId] = useState("");

  const { mutate: createList, data } = api.list.create.useMutation({
    onSuccess: () => {
      setListCreated(true);
      if (!data?.listId) return;
      setNewListId(data.listId);
    },
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
    getValues,
  } = useForm<z.infer<typeof schema>>({ resolver: zodResolver(schema) });

  function onSubmit() {
    const isPrivate = getValues("isPrivate") === "private";
    createList({
      name: getValues("title"),
      isPrivate,
      description: getValues("description"),
    });
  }

  const titleError = errors.title?.message;
  const descriptionError = errors.description?.message;

  useEffect(() => {
    if (listCreated) return;

    const setListCreatedFalse = setTimeout(() => setListCreated(false), 3000);
    return () => clearTimeout(setListCreatedFalse);
  }, [listCreated]);

  return (
    <Layout
      title="Create a list | Toshi"
      description="Create a list on Toshi.com"
      className="relative w-full max-w-md self-center px-5"
    >
      <h1 className="my-3 ml-1 text-3xl font-semibold md:text-4xl">
        Create a list
      </h1>
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-2">
        <TextInputField
          error={titleError}
          maxLength={max_list_title_char}
          internalLabel="title"
          visibleLabel="List title"
          {...register("title")}
        />
        <div className="flex flex-col">
          <label htmlFor="description" className="ml-1 font-semibold">
            Description
          </label>
          <textarea
            id="description"
            className={`duration-50 resize-none rounded-md border-2 bg-neutral-100 px-3 py-1 transition-shadow focus-within:border-neutral-500 focus-within:shadow-md focus-within:shadow-neutral-400 focus-within:outline-none ${
              descriptionError
                ? "border-red-500 focus-within:border-red-500"
                : ""
            }`}
            maxLength={max_list_desc_char}
            rows={4}
          />
          <div
            className={`ml-1 flex items-center gap-1 text-sm text-red-500 ${
              descriptionError ? "" : "hidden"
            }`}
          >
            <span className="text-lg font-semibold">!</span>
            <p
              role="alert"
              aria-hidden={descriptionError ? "false" : "true"}
              className="text-red-500"
            >
              {descriptionError}
            </p>
          </div>
        </div>
        <div className="flex flex-col">
          <label htmlFor="visibility" className="ml-1 font-semibold">
            Visibility
          </label>
          <select
            id="visibility"
            className="duration-50 rounded-md border-2 bg-neutral-100 px-3 py-1 transition-shadow focus-within:border-neutral-500 focus-within:shadow-md focus-within:shadow-neutral-400 focus-within:outline-none"
          >
            <option value={"true"}>Private</option>
            <option value="public">Public</option>
          </select>
        </div>
        <button
          type="submit"
          className="mt-2 w-fit self-end rounded-md bg-toshi-red px-4 py-1 font-semibold text-white"
        >
          Create list
        </button>
      </form>
      <Transition
        as={Fragment}
        show={listCreated}
        enter="transition ease-out duration-200"
        enterFrom="opacity-0 translate-y-1"
        enterTo="opacity-100 translate-y-0"
        leave="transition ease-in duration-150"
        leaveFrom="opacity-100 translate-y-0"
        leaveTo="opacity-0 translate-y-1"
      >
        <div
          role="alert"
          className="absolute bottom-0 left-1/2 flex -translate-x-1/2 items-center gap-1 self-center rounded-md bg-toshi-red px-4 py-2 text-lg text-white"
        >
          <span>List created.</span>
          <InternalLink
            href={`/account/lists/${newListId}`}
            className="text-sky-300 hover:text-sky-400"
          >
            Go to list
          </InternalLink>
        </div>
      </Transition>
    </Layout>
  );
};

export default CreateListPage;
