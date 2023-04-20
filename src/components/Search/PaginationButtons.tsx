import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/outline";
import { PaginationButtons } from "~/customTypes";

function Container({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative left-1/2 my-6 inline-flex w-fit -translate-x-1/2 gap-0 rounded-md border border-neutral-500 text-center shadow shadow-neutral-400 md:text-lg">
      {children}
    </div>
  );
}

function NavButton({
  onClick,
  name,
  disabled,
}: {
  onClick: () => void;
  name: "Previous" | "Next";
  disabled: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`inline-flex items-center gap-1 bg-white transition-colors hover:bg-web-white disabled:text-neutral-400 disabled:hover:bg-white ${
        name === "Previous"
          ? "rounded-l-md pl-1 pr-2 md:pl-3 md:pr-4"
          : "rounded-r-md pl-2 pr-1 md:pl-4 md:pr-3"
      }`}
      disabled={disabled}
    >
      {name === "Previous" && <ChevronLeftIcon className="w-6" />}
      {name}
      {name === "Next" && <ChevronRightIcon className="w-6" />}
    </button>
  );
}

function PaginationButtons({
  totalPages,
  currentPage,
  setPage,
}: PaginationButtons) {
  if (!totalPages) return <></>;

  const className =
    "aspect-square w-8 border transition-colors disabled:hover:bg-white bg-white hover:bg-web-white md:py-2 px-4 md:px-6 font-semibold flex items-center justify-center disabled:text-neutral-400 h-fit";

  if (totalPages > 3) {
    if (currentPage === 1) {
      return (
        <Container>
          <NavButton
            name="Previous"
            onClick={() => setPage(currentPage - 1)}
            disabled
          />
          <button
            type="button"
            onClick={() => setPage(1)}
            className={`${className} border-black`}
            disabled
          >
            {1}
          </button>
          <button
            type="button"
            onClick={() => setPage(2)}
            className={`${className} border-transparent`}
          >
            {2}
          </button>
          <button
            type="button"
            onClick={() => setPage(3)}
            className={`${className} border-transparent`}
          >
            {3}
          </button>
          <div className="flex aspect-square w-8 justify-center border border-transparent bg-white px-4 font-medium text-neutral-400 md:px-6 md:py-2">
            ...
          </div>
          <div className="flex aspect-square w-8 items-center justify-center border border-transparent bg-white px-4 font-medium text-neutral-400 md:px-6 md:py-2">
            {totalPages}
          </div>
          <NavButton
            name="Next"
            onClick={() => setPage(currentPage + 1)}
            disabled={currentPage + 1 > totalPages}
          />
        </Container>
      );
    }

    return (
      <Container>
        <NavButton
          name="Previous"
          onClick={() => setPage(currentPage - 1)}
          disabled={currentPage - 1 > 1}
        />
        <button
          type="button"
          onClick={() => setPage(currentPage - 1)}
          className={`${className} border-transparent`}
        >
          {currentPage - 1}
        </button>
        <button
          type="button"
          onClick={() => setPage(currentPage)}
          className={`${className} border-black`}
          disabled
        >
          {currentPage}
        </button>
        <button
          type="button"
          onClick={() => setPage(currentPage + 1)}
          className={`${className} border-transparent`}
        >
          {currentPage + 1}
        </button>
        <div className="flex aspect-square w-8 justify-center border border-transparent bg-white px-4 font-medium text-neutral-400 md:px-6 md:py-2">
          ...
        </div>
        <div className="flex aspect-square w-8 items-center justify-center border bg-white px-6 py-2 font-medium opacity-50">
          {totalPages}
        </div>
        <NavButton
          name="Next"
          onClick={() => setPage(currentPage + 1)}
          disabled={currentPage + 1 > totalPages}
        />
      </Container>
    );
  }

  return (
    <Container>
      <NavButton
        name="Previous"
        onClick={() => setPage(currentPage - 1)}
        disabled={currentPage - 1 > 1}
      />
      {Array.from({ length: totalPages })
        .fill(null)
        .map((_, i) => {
          const pageIndex = i + 1;
          return (
            <button
              key={pageIndex}
              type="button"
              onClick={() => setPage(pageIndex)}
              className={`${className} ${
                pageIndex === currentPage
                  ? "border-black"
                  : "border-transparent"
              }`}
            >
              {pageIndex}
            </button>
          );
        })}
      <NavButton
        name="Next"
        onClick={() => setPage(currentPage + 1)}
        disabled={currentPage + 1 > totalPages}
      />
    </Container>
  );
}

export default PaginationButtons;
