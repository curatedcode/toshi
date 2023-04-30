import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/outline";
import { useCallback, useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import type { SliderControlProps } from "~/customTypes";

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
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.9 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
          <button
            type="button"
            className={`absolute left-0 top-1/2 flex h-20 -translate-y-1/2 items-center justify-center rounded-md border-2 border-transparent focus-within:border-sky-400 ${
              type === "filled"
                ? "bg-white disabled:bg-opacity-30"
                : "bg-white bg-opacity-30 disabled:bg-opacity-20"
            }`}
            onClick={scrollPrev}
            disabled={!canScrollPrev}
            aria-label="previous"
          >
            <ChevronLeftIcon className="w-12" />
          </button>
          <button
            type="button"
            className={`absolute right-0 top-1/2 flex h-20 -translate-y-1/2 items-center justify-center rounded-md border-2 border-transparent focus-within:border-sky-400 ${
              type === "filled"
                ? "bg-white disabled:bg-opacity-30"
                : "bg-white bg-opacity-30 disabled:bg-opacity-20"
            }`}
            onClick={scrollNext}
            disabled={!canScrollNext}
            aria-label="next"
          >
            <ChevronRightIcon className="w-12" />
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default Controls;
