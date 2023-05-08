import Head from "next/head";
import {
  ChevronDownIcon,
  MagnifyingGlassIcon,
  ShoppingCartIcon,
  UserIcon,
} from "@heroicons/react/24/outline";
import SkipToContentButton from "./SkipToContentButton";
import { api } from "~/utils/api";
import type { LayoutProps } from "~/customTypes";
import Dropdown from "./Dropdown";
import Link from "next/link";
import { type KeyboardEvent, useRef, useState } from "react";
import LogoWithText from "./LogoWithText";
import { Source_Sans_Pro } from "next/font/google";
import { signIn, signOut, useSession } from "next-auth/react";
import InternalLink from "./InternalLink";
const font = Source_Sans_Pro({
  subsets: ["latin"],
  weight: ["200", "300", "400", "600", "700", "900"],
});

function Layout({ title, description, children, className = "" }: LayoutProps) {
  const [searchText, setSearchText] = useState("");
  const linkRef = useRef<HTMLAnchorElement>(null);

  const { status } = useSession();

  const { data: name } = api.user.fullName.useQuery();

  function search(e: KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter" && linkRef.current) {
      linkRef.current.click();
    }
  }

  const inputRef = useRef<HTMLInputElement>(null);

  function handleFocus() {
    inputRef.current?.focus();
  }
  function handleBlur() {
    inputRef.current?.blur();
  }

  const { data: categories } = api.category.getAll.useQuery(undefined, {
    keepPreviousData: true,
    staleTime: Infinity,
  });

  return (
    <div className="relative flex min-h-screen flex-col print:hidden">
      <Head>
        <title>{title}</title>
        <meta name="description" content={description} />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <SkipToContentButton />
      <Link href={`/search?text=${searchText}`} ref={linkRef} hidden />
      <nav className="grid w-full grid-cols-2 bg-toshi-red px-2 py-1.5 text-white md:inline-flex md:gap-4 md:px-4">
        <Link
          href={"/"}
          aria-label="Home"
          className="flex w-fit items-center md:order-1"
        >
          <LogoWithText />
        </Link>
        <div className="inline-flex items-center justify-end gap-6 font-medium md:order-last">
          <Dropdown
            trigger={
              <div
                onClick={
                  status === "authenticated" ? undefined : () => signIn()
                }
                className="inline-flex items-center gap-1"
              >
                <UserIcon className="w-7" aria-hidden />
                <span className="hidden max-w-[96px] overflow-hidden text-ellipsis whitespace-nowrap md:block">
                  {status === "authenticated" ? name?.firstName : "Sign In"}
                </span>
              </div>
            }
            className="place-items-center"
            position="right"
          >
            {status === "authenticated" ? (
              <button
                type="button"
                onClick={() => void signOut()}
                className="col-span-full mb-3 w-full justify-self-center whitespace-nowrap rounded-md bg-toshi-red px-2 py-1 hover:bg-opacity-90"
              >
                Sign Out
              </button>
            ) : (
              <button
                type="button"
                onClick={() => void signIn()}
                className="col-span-full mb-3 w-full justify-self-center whitespace-nowrap rounded-md bg-toshi-red px-2 py-1 hover:bg-opacity-90"
              >
                Sign In
              </button>
            )}
            <div className="mb-2 flex flex-col items-center gap-2 [&>*]:text-center [&>*]:text-sm">
              <InternalLink href={"/account/lists"}>Wish List</InternalLink>
              <InternalLink href={"/account/lists/create"}>
                New Wish List
              </InternalLink>
            </div>
            <div className="flex flex-col items-center gap-2 [&>*]:text-sm">
              <InternalLink href={"/account"}>Account</InternalLink>
              <InternalLink href={"/account/orders"}>Orders</InternalLink>
              <InternalLink href={"/cart"}>Cart</InternalLink>
              <InternalLink href={"/new-releases"}>
                Recommendations
              </InternalLink>
            </div>
          </Dropdown>
          <Link href={"/cart"} className="inline-flex w-fit items-center gap-1">
            <ShoppingCartIcon className="w-7" aria-hidden />
            <span className="hidden md:block">Cart</span>
          </Link>
        </div>
        <div
          className={`col-span-full my-1 inline-flex h-fit w-full cursor-text rounded-lg bg-white pl-2 text-base text-black focus-within:ring-2 focus-within:ring-black md:order-3`}
          onClick={handleFocus}
          onBlur={handleBlur}
        >
          <input
            type="text"
            placeholder="Search"
            className="w-full bg-transparent py-[0.45rem] pl-2 focus:outline-none"
            onFocus={handleFocus}
            onBlur={handleBlur}
            ref={inputRef}
            onChange={(e) => setSearchText(e.currentTarget.value)}
            onKeyDown={search}
          />
          <button
            type="button"
            onClick={() => linkRef.current?.click()}
            aria-label="Submit search"
          >
            <MagnifyingGlassIcon
              className="h-full w-10 rounded-lg border-2 border-l-0 border-white bg-toshi-red p-2 text-white"
              aria-hidden
            />
          </button>
        </div>
        <div className="col-span-full row-start-3 inline-flex items-center justify-evenly gap-4 font-medium md:order-2">
          <Dropdown
            trigger={
              <div className="inline-flex items-center gap-1">
                Categories
                <ChevronDownIcon className="-mb-1 w-5" aria-hidden />
              </div>
            }
            className="auto-cols-min grid-cols-1 lg:grid-cols-2"
            position="left"
          >
            {categories?.map((category) => (
              <Link
                href={`/search?dept=${category.name}`}
                key={category.name}
                className="container px-3 py-2 text-center text-black transition-colors duration-75 hover:bg-neutral-100"
              >
                {category.name}
              </Link>
            ))}
          </Dropdown>
          <Link href={"/new-releases"} className="whitespace-nowrap">
            What&apos;s new
          </Link>
        </div>
      </nav>
      <main className={`min-h-full pb-36 ${font.className} ${className}`}>
        {children}
      </main>
      <footer className="absolute bottom-0 mt-12 inline-flex w-full items-center justify-center bg-toshi-red py-12 text-white">
        FOOTER
      </footer>
    </div>
  );
}

export default Layout;
