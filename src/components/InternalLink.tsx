import Link from "next/link";
import type { InternalLinkProps } from "~/customTypes";

function InternalLink({
  href,
  className = "",
  children,
  ...props
}: InternalLinkProps) {
  if (children)
    return (
      <Link
        href={href}
        className={`w-fit text-base text-sky-600 underline underline-offset-1 transition-colors hover:text-toshi-red ${className}`}
        {...props}
      >
        {children}
      </Link>
    );

  return (
    <Link
      href={href}
      className={`w-fit text-base text-sky-600 underline underline-offset-1 transition-colors hover:text-toshi-red ${className}`}
      {...props}
    />
  );
}

export default InternalLink;
