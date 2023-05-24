import { forwardRef } from "react";
import type { ButtonProps } from "~/customTypes";

const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  { style, className = "", children, type = "button", ...props }: ButtonProps,
  ref
) {
  if (style === "toshi") {
    return (
      <button
        type={type}
        className={`whitespace-nowrap rounded-md bg-toshi-red px-4 py-1 text-center font-semibold text-white transition-colors hover:bg-toshi-red/95 disabled:cursor-not-allowed disabled:bg-opacity-40 ${className}`}
        ref={ref}
        {...props}
      >
        {children}
      </button>
    );
  }

  return (
    <button
      type={type}
      className={`whitespace-nowrap rounded-md bg-neutral-200 px-4 py-1 text-center font-semibold text-neutral-600 transition-colors hover:bg-neutral-300 disabled:cursor-not-allowed disabled:bg-opacity-40 ${className}`}
      ref={ref}
      {...props}
    >
      {children}
    </button>
  );
});

export default Button;
