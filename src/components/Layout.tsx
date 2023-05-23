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
import Link from "next/link";
import {
  type KeyboardEvent,
  useRef,
  useState,
  useEffect,
  Fragment,
} from "react";
import LogoWithText from "./LogoWithText";
import { Source_Sans_3 } from "next/font/google";
import { signIn, signOut, useSession } from "next-auth/react";
import InternalLink from "./InternalLink";
import Footer from "./Footer";
import Button from "./Input/Button";
import { Menu, Transition } from "@headlessui/react";
const font = Source_Sans_3({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  adjustFontFallback: false,
});

function Layout({ title, description, children, className = "" }: LayoutProps) {
  const [searchText, setSearchText] = useState("");
  const linkRef = useRef<HTMLAnchorElement>(null);

  const [windowWidth, setWindowWidth] = useState(0);

  const { status } = useSession();

  const inputRef = useRef<HTMLInputElement>(null);

  function search(e: KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter" && linkRef.current) {
      linkRef.current.click();
      inputRef.current?.blur();
    }
  }

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

  useEffect(() => {
    function searchTrigger(e: globalThis.KeyboardEvent) {
      if (e.key !== "k" || !e.ctrlKey) return;
      e.preventDefault();
      inputRef.current?.focus();
    }
    document.addEventListener("keydown", searchTrigger);
    return () => removeEventListener("keydown", searchTrigger);
  });

  useEffect(() => {
    function resize() {
      const newWidth = window.innerWidth;
      if (windowWidth === newWidth) return;
      setWindowWidth(newWidth);
    }
    window.addEventListener("resize", resize);
    return () => window.removeEventListener("resize", resize);
  }, [windowWidth]);

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
          tabIndex={1}
        >
          <LogoWithText />
        </Link>
        <div className="inline-flex items-center justify-end gap-6 font-semibold md:order-last">
          <AccountDropdown status={status} windowWidth={windowWidth} />
          <Link
            href={"/cart"}
            className="inline-flex w-fit items-center gap-1"
            tabIndex={windowWidth >= 768 ? 7 : 3}
            id="Cart"
          >
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
            tabIndex={4}
          />
          <button
            type="button"
            onClick={() => linkRef.current?.click()}
            aria-label="Submit search"
            tabIndex={5}
          >
            <MagnifyingGlassIcon
              className="h-full w-10 rounded-lg border-2 border-l-0 border-white bg-toshi-red p-2 text-white"
              aria-hidden
            />
          </button>
        </div>
        <div className="col-span-full row-start-3 inline-flex items-center justify-evenly gap-4 font-semibold md:order-2">
          <CategoryDropdown categories={categories} windowWidth={windowWidth} />
          <Link
            href={"/new-releases"}
            className="whitespace-nowrap"
            tabIndex={windowWidth >= 768 ? 3 : 7}
          >
            What&apos;s new
          </Link>
        </div>
      </nav>
      <main
        className={`relative left-1/2 mb-64 flex min-h-full max-w-standard -translate-x-1/2 flex-col px-5 pt-4 font-sans md:mb-52 md:pt-6 ${font.className} ${className}`}
      >
        {children}
      </main>
      <Footer bgColor="red" />
    </div>
  );
}

function AccountDropdown({
  status,
  windowWidth,
}: {
  status: "loading" | "authenticated" | "unauthenticated";
  windowWidth: number;
}) {
  return (
    <Menu
      as="div"
      className="relative inline-block text-left"
      tabIndex={windowWidth >= 768 ? 6 : 2}
    >
      <Menu.Button className="flex items-center gap-1" id="Account">
        <UserIcon className="w-7" aria-hidden />
        <div className="hidden flex-col items-start whitespace-nowrap md:flex">
          {status === "authenticated" ? (
            "Account"
          ) : (
            <>
              <span className="-mb-1 text-xs">Hello,</span>
              <span className="-mb-1">Sign In</span>
            </>
          )}
        </div>
      </Menu.Button>
      <Transition
        as={Fragment}
        enter="transition ease-out duration-100"
        enterFrom="transform opacity-0 scale-95"
        enterTo="transform opacity-100 scale-100"
        leave="transition ease-in duration-75"
        leaveFrom="transform opacity-100 scale-100"
        leaveTo="transform opacity-0 scale-95"
      >
        <Menu.Items className="absolute -right-14 z-10 mt-2 w-72 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-neutral-400 focus:outline-none md:-right-[90%]">
          <div className="flex flex-col items-center p-2">
            {status === "authenticated" ? (
              <>
                <Menu.Item>
                  <Button
                    style="toshi"
                    onClick={() => void signOut()}
                    className="col-span-full mb-3 w-full"
                  >
                    Sign Out
                  </Button>
                </Menu.Item>
                <Menu.Item>
                  <InternalLink href="/account/lists">Wish Lists</InternalLink>
                </Menu.Item>
                <Menu.Item>
                  <InternalLink href="/account/lists/create">
                    New Wish List
                  </InternalLink>
                </Menu.Item>
                <Menu.Item>
                  <InternalLink href="/account">Account</InternalLink>
                </Menu.Item>
                <Menu.Item>
                  <InternalLink href="/account/orders">Orders</InternalLink>
                </Menu.Item>
                <Menu.Item>
                  <InternalLink href="/cart">Cart</InternalLink>
                </Menu.Item>
                <Menu.Item>
                  <InternalLink href="/new-releases">
                    Recommendations
                  </InternalLink>
                </Menu.Item>
              </>
            ) : (
              <>
                <Button
                  style="toshi"
                  onClick={() => void signIn()}
                  className="col-span-full mb-2 w-full"
                >
                  Sign In
                </Button>
                <InternalLink href="/auth/sign-up">Create Account</InternalLink>
              </>
            )}
          </div>
        </Menu.Items>
      </Transition>
    </Menu>
  );
}

function CategoryDropdown({
  categories,
  windowWidth,
}: {
  categories: { name: string }[] | undefined;
  windowWidth: number;
}) {
  return (
    <Menu as="div" className="relative" tabIndex={windowWidth >= 768 ? 2 : 6}>
      <Menu.Button className="inline-flex items-center gap-2">
        <span>Categories</span>
        <ChevronDownIcon className="w-5" aria-hidden />
      </Menu.Button>
      <Transition
        as={Fragment}
        enter="transition ease-out duration-100"
        enterFrom="transform opacity-0 scale-95"
        enterTo="transform opacity-100 scale-100"
        leave="transition ease-in duration-75"
        leaveFrom="transform opacity-100 scale-100"
        leaveTo="transform opacity-0 scale-95"
      >
        <Menu.Items className="absolute -left-16 z-10 mt-2 w-72 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-neutral-400 focus:outline-none md:-left-[90%]">
          <div className="flex flex-col p-1">
            {categories?.map((category) => (
              <Menu.Item key={category.name}>
                <Link
                  href={`/search?dept=${category.name}`}
                  className="container px-3 py-2 text-center text-black transition-colors duration-75 hover:bg-neutral-100"
                >
                  {category.name}
                </Link>
              </Menu.Item>
            ))}
          </div>
        </Menu.Items>
      </Transition>
    </Menu>
  );
}

export default Layout;
