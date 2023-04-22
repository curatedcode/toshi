import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/outline";
import { useCallback } from "react";
import { AnimatePresence, motion } from "framer-motion";
import type { SliderControlProps } from "~/customTypes";

function Controls({ api, visible, type = "filled" }: SliderControlProps) {
  const scrollPrev = useCallback(() => api && api.scrollPrev(), [api]);
  const scrollNext = useCallback(() => api && api.scrollNext(), [api]);

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
              type === "filled" ? "bg-white" : "bg-white bg-opacity-30"
            }`}
            onClick={scrollPrev}
            aria-label="previous"
          >
            <ChevronLeftIcon className="w-12" />
          </button>
          <button
            type="button"
            className={`absolute right-0 top-1/2 flex h-20 -translate-y-1/2 items-center justify-center rounded-md border-2 border-transparent focus-within:border-sky-400 ${
              type === "filled" ? "bg-white" : "bg-white bg-opacity-30"
            }`}
            onClick={scrollNext}
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
