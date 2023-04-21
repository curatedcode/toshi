import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/outline";
import Link from "next/link";
import type { NavButtonProps, PaginationButtonsProps } from "~/customTypes";

function Container({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative left-1/2 my-6 inline-flex w-fit -translate-x-1/2 gap-0 rounded-md border border-neutral-500 text-center shadow shadow-neutral-400 md:text-lg">
      {children}
    </div>
  );
}

function NavButton({ name, href }: NavButtonProps) {
  return (
    <Link
      href={href}
      className={`inline-flex items-center gap-1 bg-white transition-colors hover:bg-neutral-100 ${
        name === "Previous"
          ? "rounded-l-md pl-1 pr-2 md:pl-3 md:pr-4"
          : "rounded-r-md pl-2 pr-1 md:pl-4 md:pr-3"
      }`}
    >
      {name === "Previous" && <ChevronLeftIcon className="w-6" />}
      {name}
      {name === "Next" && <ChevronRightIcon className="w-6" />}
    </Link>
  );
}

function PaginationButtons({
  totalPages,
  currentPage,
  searchText,
}: PaginationButtonsProps) {
  if (!totalPages || !searchText) return <></>;

  const className =
    "aspect-square w-8 border transition-colors bg-white hover:bg-neutral-100 md:py-2 px-4 md:px-6 font-semibold flex items-center justify-center h-fit";

  const baseLink = `/search/${searchText}?page=`;

  if (totalPages > 3) {
    if (currentPage === 1) {
      return (
        <Container>
          <NavButton name="Previous" href={`${baseLink}${currentPage - 1}`} />
          <Link
            href={`${baseLink}${1}`}
            className={`${className} border-black`}
          >
            {1}
          </Link>
          <Link
            href={`${baseLink}${2}`}
            className={`${className} border-transparent`}
          >
            {2}
          </Link>
          <Link
            href={`${baseLink}${3}`}
            className={`${className} border-transparent`}
          >
            {3}
          </Link>
          <div className="flex aspect-square w-8 justify-center border border-transparent bg-white px-4 font-medium text-neutral-400 md:px-6 md:py-2">
            ...
          </div>
          <div className="flex aspect-square w-8 items-center justify-center border border-transparent bg-white px-4 font-medium text-neutral-400 md:px-6 md:py-2">
            {totalPages}
          </div>
          <NavButton name="Next" href={`${baseLink}${currentPage + 1}`} />
        </Container>
      );
    }

    return (
      <Container>
        <NavButton name="Previous" href={`${baseLink}${currentPage - 1}`} />
        <Link
          href={`${baseLink}${currentPage - 1}`}
          className={`${className} border-transparent`}
        >
          {currentPage - 1}
        </Link>
        <Link
          href={`${baseLink}${currentPage}`}
          className={`${className} border-black`}
        >
          {currentPage}
        </Link>
        <Link
          href={`${baseLink}${currentPage + 1}`}
          className={`${className} border-transparent`}
        >
          {currentPage + 1}
        </Link>
        <div className="flex aspect-square w-8 justify-center border border-transparent bg-white px-4 font-medium text-neutral-400 md:px-6 md:py-2">
          ...
        </div>
        <div className="flex aspect-square w-8 items-center justify-center border bg-white px-6 py-2 font-medium opacity-50">
          {totalPages}
        </div>
        <NavButton name="Next" href={`${baseLink}${currentPage + 1}`} />
      </Container>
    );
  }

  return (
    <Container>
      <NavButton name="Previous" href={`${currentPage - 1}`} />
      {Array.from({ length: totalPages })
        .fill(null)
        .map((_, i) => {
          const pageIndex = i + 1;
          return (
            <Link
              key={pageIndex}
              href={`${baseLink}${pageIndex}`}
              className={`${className} ${
                currentPage === pageIndex
                  ? "border-black"
                  : "border-transparent"
              }`}
            >
              {pageIndex}
            </Link>
          );
        })}
      <NavButton name="Next" href={`${baseLink}${currentPage + 1}`} />
    </Container>
  );
}

export default PaginationButtons;
