import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/outline";
import { useCallback, useEffect, useState } from "react";
import type { SliderControlProps } from "~/customTypes";
import { Transition } from "@headlessui/react";

function Controls({ api, visible, type = "filled" }: SliderControlProps) {
  const scrollPrev = useCallback(() => api && api.scrollPrev(), [api]);
  const scrollNext = useCallback(() => api && api.scrollNext(), [api]);

  const [canScrollPrev, setCanScrollPrev] = useState(api?.canScrollPrev());
  const [canScrollNext, setCanScrollNext] = useState<boolean | undefined>(true);

  const onSelect = useCallback(() => {
    setCanScrollPrev(api?.canScrollPrev());
    setCanScrollNext(api?.canScrollNext());
  }, [api]);

  useEffect(() => {
    if (!api) return;
    api.on("select", onSelect);
    api.on("reInit", onSelect);
  }, [api, onSelect]);

  return (
    <Transition
      show={visible}
      enter="transition-opacity duration-150"
      enterFrom="opacity-0"
      enterTo="opacity-100"
      leave="transition-opacity duration-150"
      leaveFrom="opacity-100"
      leaveTo="opacity-0"
    >
      <button
        type="button"
        className={`absolute left-0 top-1/2 flex h-20 -translate-y-1/2 items-center justify-center rounded-md border-2 border-transparent focus-within:border-sky-400 ${
          type === "filled"
            ? "bg-white aria-disabled:bg-opacity-30"
            : "bg-white bg-opacity-30 aria-disabled:bg-opacity-20"
        } ${canScrollPrev ? "" : "cursor-default"}`}
        onClick={scrollPrev}
        aria-disabled={!canScrollPrev}
        title={canScrollPrev ? "Go back a slide" : "No previous slides"}
        aria-label="previous"
      >
        <ChevronLeftIcon className="w-12" aria-hidden />
      </button>
      <button
        type="button"
        className={`absolute right-0 top-1/2 flex h-20 -translate-y-1/2 items-center justify-center rounded-md border-2 border-transparent focus-within:border-sky-400 ${
          type === "filled"
            ? "bg-white aria-disabled:bg-opacity-30"
            : "bg-white bg-opacity-30 aria-disabled:bg-opacity-20"
        } ${canScrollNext ? "" : "cursor-default"}`}
        onClick={scrollNext}
        aria-disabled={!canScrollNext}
        title={canScrollNext ? "Go forward a slide" : "No next slides"}
        aria-label="next"
      >
        <ChevronRightIcon className="w-12" aria-hidden />
      </button>
    </Transition>
  );
}

export default Controls;
