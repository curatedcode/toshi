import Link from "next/link";
import { forwardRef } from "react";
import type { CustomLinkProps } from "~/customTypes";

const CustomLink = forwardRef<HTMLAnchorElement, CustomLinkProps>(
  function CustomLink(
    { style, className = "", children, ...props }: CustomLinkProps,
    ref
  ) {
    if (style === "toshi") {
      return (
        <Link
          className={`whitespace-nowrap rounded-md bg-toshi-green px-4 py-1 text-center font-semibold text-white transition-colors hover:bg-toshi-green/95 disabled:cursor-not-allowed disabled:bg-opacity-40 ${className}`}
          ref={ref}
          {...props}
        >
          {children}
        </Link>
      );
    }

    return (
      <Link
        className={`whitespace-nowrap rounded-md bg-neutral-200 px-4 py-1 text-center font-semibold text-neutral-600 transition-colors hover:bg-neutral-300 disabled:cursor-not-allowed disabled:bg-opacity-40 ${className}`}
        ref={ref}
        {...props}
      >
        {children}
      </Link>
    );
  }
);

export default CustomLink;
