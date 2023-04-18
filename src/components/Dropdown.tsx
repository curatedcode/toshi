import {
  autoUpdate,
  flip,
  FloatingFocusManager,
  offset as offsetFunc,
  shift,
  useClick,
  useDismiss,
  useFloating,
  useInteractions,
  useRole,
  useTransitionStyles,
} from "@floating-ui/react";
import { useState } from "react";
import { type PopoverProps } from "~/customTypes";

export default function Dropdown({
  trigger,
  children,
  offset = 10,
  placement = "bottom",
  className,
}: PopoverProps) {
  const [isOpen, setIsOpen] = useState(false);

  const { x, y, strategy, refs, context } = useFloating({
    open: isOpen,
    onOpenChange: setIsOpen,
    middleware: [offsetFunc(offset), flip(), shift()],
    whileElementsMounted: autoUpdate,
    placement: placement,
  });

  const click = useClick(context);
  const dismiss = useDismiss(context);
  const role = useRole(context);

  const { getReferenceProps, getFloatingProps } = useInteractions([
    click,
    dismiss,
    role,
  ]);

  const { isMounted, styles } = useTransitionStyles(context, {
    duration: 125,
    initial: {
      opacity: 0,
    },
    common: {
      opacity: 1,
    },
  });

  return (
    <>
      <button
        ref={refs.setReference}
        {...getReferenceProps()}
        className={className?.trigger}
        onClick={() => setIsOpen((prev) => !prev)}
        aria-label="Toggle Menu"
      >
        {trigger}
      </button>
      {isMounted && (
        <FloatingFocusManager context={context}>
          <div
            ref={refs.setFloating}
            style={{
              position: strategy,
              top: y ?? 0,
              left: x ?? 0,
              ...styles,
            }}
            {...getFloatingProps()}
            className={`absolute z-50 w-max select-none rounded-md px-3 py-2 text-lg text-black dark:text-white ${
              className?.children ?? ""
            }`}
          >
            {children}
          </div>
        </FloatingFocusManager>
      )}
    </>
  );
}
