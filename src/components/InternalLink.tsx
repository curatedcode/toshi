import Link from "next/link";
import { forwardRef } from "react";
import type { InternalLinkProps } from "~/customTypes";

const InternalLink = forwardRef<HTMLAnchorElement, InternalLinkProps>(
  function InternalLink(
    { href, className = "", children, ...props }: InternalLinkProps,
    ref
  ) {
    if (children)
      return (
        <Link
          href={href}
          className={`w-fit text-base text-sky-600 underline underline-offset-1 transition-colors hover:text-toshi-red ${className}`}
          ref={ref}
          {...props}
        >
          {children}
        </Link>
      );

    return (
      <Link
        href={href}
        className={`w-fit text-base text-sky-600 underline underline-offset-1 transition-colors hover:text-toshi-red ${className}`}
        ref={ref}
        {...props}
      />
    );
  }
);

export default InternalLink;
