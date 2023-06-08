import Head from "next/head";
import {
  ArrowLeftOnRectangleIcon,
  ArrowRightIcon,
  ArrowRightOnRectangleIcon,
  ChevronDownIcon,
  ClipboardDocumentIcon,
  MagnifyingGlassIcon,
  PlusIcon,
  QueueListIcon,
  ShoppingCartIcon,
  Squares2X2Icon,
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
import localFont from "next/font/local";
import { signIn, signOut, useSession } from "next-auth/react";
import InternalLink from "./InternalLink";
import Footer from "./Footer";
import Button from "./Input/Button";
import { Disclosure, Menu, Transition } from "@headlessui/react";
import { createId } from "@paralleldrive/cuid2";
const font = localFont({
  src: "../styles/SourceSans3.ttf",
  display: "swap",
  adjustFontFallback: false,
});

function Layout({
  title,
  description,
  children,
  className = "",
  showSecondaryNav = true,
}: LayoutProps) {
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

  const categoriesCapitalized = categories?.map((category) => {
    const firstLetter = category.name.slice(0, 1);
    const firstLetterCapital = firstLetter.toUpperCase();

    const restOfWord = category.name.slice(1);
    return firstLetterCapital.concat(restOfWord);
  });

  const { data: lists } = api.list.getFiveSimple.useQuery();
  const { data: orders } = api.order.getFiveSimple.useQuery();

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
    <div className="relative mx-auto flex max-w-standard flex-col items-center font-sans print:hidden">
      <Head>
        <title>{title}</title>
        <meta name="description" content={description} />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <SkipToContentButton />
      <Link href={`/search?text=${searchText}`} ref={linkRef} hidden />
      <nav
        className={`absolute top-0 grid w-full max-w-standard grid-cols-2 justify-center bg-toshi-primary px-3 py-1.5 text-white md:inline-flex md:px-4 ${
          showSecondaryNav ? "xl:pl-secondary-navbar" : ""
        }`}
        aria-label="primary"
      >
        <Link
          href={"/"}
          aria-label="Home"
          className={`flex w-fit items-center md:order-1 ${
            showSecondaryNav ? "xl:hidden" : ""
          }`}
          tabIndex={1}
        >
          <LogoWithText />
        </Link>
        <div className="inline-flex items-center justify-end gap-2 font-semibold md:order-last md:gap-1">
          <Link
            href={"/cart"}
            className="flex w-fit items-center gap-1 rounded-md px-2 py-1 transition-colors hover:bg-white/10"
            tabIndex={windowWidth >= 768 ? 6 : 2}
            id="Cart"
          >
            <ShoppingCartIcon className="w-6" aria-hidden />
            <span className="hidden md:block">Cart</span>
          </Link>
          <AccountDropdown status={status} windowWidth={windowWidth} />
        </div>
        <div
          className={`col-span-full my-2 w-full px-4 md:order-2 md:mx-4 md:px-0 ${
            showSecondaryNav ? "xl:ml-1" : ""
          }`}
        >
          <div
            className={`inline-flex h-fit w-full cursor-text rounded-lg bg-white pl-2 text-base text-black focus-within:ring-2 focus-within:ring-black`}
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
              tabIndex={windowWidth >= 768 ? 2 : 4}
            />
            <button
              type="button"
              onClick={() => linkRef.current?.click()}
              aria-label="Submit search"
              tabIndex={windowWidth >= 768 ? 3 : 5}
            >
              <MagnifyingGlassIcon
                className="w-10 rounded-lg border-[3px] border-white bg-toshi-primary p-1.5 text-white transition-colors hover:bg-toshi-primary-lighter"
                aria-hidden
              />
            </button>
          </div>
        </div>
        <div className="col-span-full row-start-3 inline-flex items-center justify-evenly font-semibold md:order-3 md:mr-2 md:gap-1">
          <CategoryDropdown
            categories={categoriesCapitalized}
            windowWidth={windowWidth}
          />
          <Link
            href={"/new-releases"}
            className="whitespace-nowrap rounded-md px-2 py-1 transition-colors hover:bg-white/10"
            tabIndex={windowWidth >= 768 ? 5 : 7}
          >
            What&apos;s new
          </Link>
        </div>
      </nav>
      <div className="flex w-screen max-w-full">
        {showSecondaryNav && (
          <nav
            className="sticky left-0 top-0 hidden h-screen w-52 flex-col items-center justify-between bg-toshi-primary px-4 pb-4 pt-3.5 text-lg text-white xl:flex"
            aria-label="secondary"
          >
            <div className="grid gap-4">
              <Link
                href={"/"}
                aria-label="Home"
                className="mb-4 flex w-fit items-center justify-self-center"
              >
                <LogoWithText />
              </Link>
              <CategoryDisclosure categories={categoriesCapitalized} />
              <ListsDisclosure lists={lists} />
              <OrdersDisclosure orders={orders} />
            </div>
            {status === "authenticated" ? (
              <button
                type="button"
                onClick={() => void signOut()}
                className="inline-flex w-full items-center justify-center gap-2 rounded-md px-4 py-1.5 font-semibold transition-colors hover:bg-white/10"
              >
                <ArrowLeftOnRectangleIcon className="-ml-2 w-7" aria-hidden />
                <span className="whitespace-nowrap">Log out</span>
              </button>
            ) : (
              <button
                type="button"
                onClick={() => void signIn()}
                className="inline-flex w-full items-center justify-center gap-2 rounded-md px-4 py-1.5 font-semibold transition-colors hover:bg-white/10"
              >
                <ArrowRightOnRectangleIcon className="-ml-2 w-7" aria-hidden />
                <span className="whitespace-nowrap">Sign in</span>
              </button>
            )}
          </nav>
        )}
        <div
          className={`flex min-h-screen w-full max-w-full flex-col justify-between pt-navbar-mobile md:pt-navbar-desktop ${
            showSecondaryNav ? "xl:max-w-full-with-side-nav" : ""
          }`}
        >
          <main
            id="main"
            className={`flex w-full flex-col px-5 pt-4 md:pt-6 ${font.className} ${className}`}
          >
            {children}
          </main>
          <Footer />
        </div>
      </div>
    </div>
  );
}

function OrdersDisclosure({
  orders,
}: {
  orders: { id: string; createdAt: string }[] | undefined;
}) {
  return (
    <Disclosure as="div">
      {({ open }) => (
        <>
          <Disclosure.Button
            className={`mb-2 inline-flex w-full items-center justify-between gap-2 rounded-md px-4 py-1.5 font-semibold transition-colors hover:bg-white/10 ${
              open ? "bg-black/20" : ""
            }`}
          >
            <div className="flex gap-2">
              <ClipboardDocumentIcon className="w-6" aria-hidden />
              <span>Orders</span>
            </div>
            <ChevronDownIcon
              className={`w-6 transition-transform ${
                open ? "rotate-180 transform" : "rotate-0"
              }`}
              aria-hidden
            />
          </Disclosure.Button>
          <Transition
            as={Fragment}
            enter="transition ease-out duration-50"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-50"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <Disclosure.Panel className="flex flex-col gap-1 px-4">
              {orders?.map((order) => (
                <Link
                  key={createId()}
                  href={`/account/orders/${order.id}`}
                  className="w-fit"
                >
                  {order.createdAt}
                </Link>
              ))}
              <Link
                href={"/account/orders"}
                className="mt-1 inline-flex w-fit items-center gap-1 self-center text-base"
              >
                <span>View all orders</span>
                <ArrowRightIcon className="w-4" aria-hidden />
              </Link>
            </Disclosure.Panel>
          </Transition>
        </>
      )}
    </Disclosure>
  );
}

function ListsDisclosure({
  lists,
}: {
  lists: { id: string; name: string }[] | undefined;
}) {
  return (
    <Disclosure as="div">
      {({ open }) => (
        <>
          <Disclosure.Button
            className={`mb-2 inline-flex w-full items-center justify-between gap-2 rounded-md px-4 py-1.5 font-semibold transition-colors hover:bg-white/10 ${
              open ? "bg-black/20" : ""
            }`}
          >
            <div className="flex gap-2">
              <QueueListIcon className="w-6" aria-hidden />
              <span>Lists</span>
            </div>
            <ChevronDownIcon
              className={`w-6 transition-transform ${
                open ? "rotate-180 transform" : "rotate-0"
              }`}
              aria-hidden
            />
          </Disclosure.Button>
          <Transition
            as={Fragment}
            enter="transition ease-out duration-50"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-50"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <Disclosure.Panel className="flex flex-col gap-1 px-4">
              <Link
                href={"/account/lists/create"}
                className="mb-1 mt-1 inline-flex w-fit items-center gap-1"
              >
                <PlusIcon className="w-5" aria-hidden />
                <span className="whitespace-nowrap">Create a list</span>
              </Link>
              {lists?.map((list) => (
                <Link
                  key={createId()}
                  href={`/account/lists/${list.id}`}
                  className="w-fit"
                >
                  {list.name}
                </Link>
              ))}
              <Link
                href={"/account/lists"}
                className="mt-1 inline-flex w-fit items-center gap-1 self-center text-base"
              >
                <span className="whitespace-nowrap">View all lists</span>
                <ArrowRightIcon className="w-4" aria-hidden />
              </Link>
            </Disclosure.Panel>
          </Transition>
        </>
      )}
    </Disclosure>
  );
}

function CategoryDisclosure({
  categories,
}: {
  categories: string[] | undefined;
}) {
  return (
    <Disclosure as="div">
      {({ open }) => (
        <>
          <Disclosure.Button
            className={`mb-2 inline-flex w-full items-center justify-between gap-2 rounded-md px-4 py-1.5 font-semibold transition-colors hover:bg-white/10 ${
              open ? "bg-black/20" : ""
            }`}
          >
            <div className="flex gap-2">
              <Squares2X2Icon className="w-6" aria-hidden />
              <span>Categories</span>
            </div>
            <ChevronDownIcon
              className={`w-6 transition-transform ${
                open ? "rotate-180 transform" : "rotate-0"
              }`}
              aria-hidden
            />
          </Disclosure.Button>
          <Transition
            as={Fragment}
            enter="transition ease-out duration-50"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-50"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <Disclosure.Panel className="flex flex-col gap-1 px-4">
              {categories?.map((category) => (
                <Link
                  key={category}
                  href={`/search?dept=${category}`}
                  className="w-fit"
                >
                  {category}
                </Link>
              ))}
            </Disclosure.Panel>
          </Transition>
        </>
      )}
    </Disclosure>
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
    <Menu as="div" className="relative">
      <Menu.Button
        className="flex w-fit items-center gap-1 rounded-md px-2 py-1 transition-colors hover:bg-white/10"
        id="Account"
        tabIndex={windowWidth >= 768 ? 7 : 3}
      >
        <UserIcon className="w-6" aria-hidden />
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
        enter="transition ease-out duration-50"
        enterFrom="opacity-0"
        enterTo="opacity-100"
        leave="ease-in duration-50"
        leaveFrom="opacity-100"
        leaveTo="opacity-0"
      >
        <Menu.Items className="absolute -right-3 z-10 mt-1.5 w-72 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-neutral-400 focus:outline-none md:-right-[0.9rem] md:mt-3">
          <div className="flex flex-col items-center gap-1 p-2 md:gap-0">
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
  categories: string[] | undefined;
  windowWidth: number;
}) {
  return (
    <Menu as="div" className="relative">
      <Menu.Button
        className="rounded-md px-2 py-1 transition-colors hover:bg-white/10"
        tabIndex={windowWidth >= 768 ? 4 : 6}
      >
        <span>Categories</span>
      </Menu.Button>
      <Transition
        as={Fragment}
        enter="transition ease-out duration-50"
        enterFrom="opacity-0"
        enterTo="opacity-100"
        leave="ease-in duration-50"
        leaveFrom="opacity-100"
        leaveTo="opacity-0"
      >
        <Menu.Items className="absolute -left-16 z-10 mt-1.5 w-72 rounded-md bg-white shadow-lg ring-1 ring-neutral-400 focus:outline-none md:mt-3">
          <div className="grid grid-cols-2">
            {categories?.map((category) => (
              <Menu.Item key={category}>
                <Link
                  href={`/search?dept=${category}`}
                  className="rounded-md px-4 py-2 text-center text-black transition-colors duration-75 hover:bg-neutral-100"
                >
                  {category}
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
