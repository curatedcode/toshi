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
import useDimensions from "./Fn/useDimensions";
import { Source_Sans_3 } from "next/font/google";
const font = Source_Sans_3({ subsets: ["latin"] });

function Layout({ title, description, children, className = "" }: LayoutProps) {
  const [searchText, setSearchText] = useState("");
  const linkRef = useRef<HTMLAnchorElement>(null);

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

  const { ref, width: navWidth } = useDimensions();

  const { data } = api.category.getAll.useQuery();

  const categories = data?.map((category) => (
    <Link
      href={`/categories/${category.name}`}
      key={category.name}
      className="container px-3 py-1 text-black transition-colors duration-75 hover:bg-web-white"
    >
      {category.name}
    </Link>
  ));

  return (
    <div className="relative flex min-h-screen flex-col">
      <Head>
        <title>{title}</title>
        <meta name="description" content={description} />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <SkipToContentButton />
      <Link href={`/search/${searchText}`} ref={linkRef} hidden />
      <nav
        className="grid w-full grid-cols-2 bg-toshi-red px-2 py-1.5 text-white md:inline-flex md:gap-4 md:px-4"
        ref={ref}
      >
        <Link
          href={"/"}
          aria-label="Home"
          className="md: -mt-0.5 flex w-fit items-center md:order-1"
        >
          <LogoWithText />
        </Link>
        <div className="inline-flex items-center gap-6 justify-self-end font-medium md:order-last">
          <Link
            href={"/account"}
            className="inline-flex w-fit items-center gap-1"
          >
            <UserIcon className="w-7" />
            <span className="hidden md:block">Account</span>
          </Link>
          <Link href={"/cart"} className="inline-flex w-fit items-center gap-1">
            <ShoppingCartIcon className="w-7" />
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
            <MagnifyingGlassIcon className="h-full w-10 rounded-lg border-2 border-l-0 border-white bg-toshi-red p-2 text-white" />
          </button>
        </div>
        <div className="col-span-full row-start-3 inline-flex items-center justify-evenly gap-4 font-medium md:order-2">
          <Dropdown
            trigger={
              <div className="inline-flex items-center gap-1">
                Categories
                <ChevronDownIcon className="-mb-1 w-5" />
              </div>
            }
            placement={navWidth >= 768 ? "bottom-start" : "bottom"}
            offset={navWidth >= 768 ? 20 : 6}
            className={{
              children: "grid grid-cols-2 bg-white",
            }}
          >
            {categories}
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
