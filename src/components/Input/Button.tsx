import Link from "next/link";
import type { ButtonProps } from "~/customTypes";

function Button({
  style,
  link,
  className = "",
  children,
  type = "button",
  ...props
}: ButtonProps) {
  const toshiStyle = `whitespace-nowrap rounded-md bg-toshi-red px-4 py-1 text-center font-semibold text-white transition-colors hover:bg-toshi-red/95 disabled:cursor-not-allowed disabled:bg-opacity-40 ${className}`;
  const standardStyle = `whitespace-nowrap text-neutral-600 rounded-md bg-neutral-200 px-4 py-1 text-center font-semibold transition-colors hover:bg-neutral-300 disabled:cursor-not-allowed disabled:bg-opacity-40 ${className}`;

  if (link) {
    if (style === "toshi") {
      return (
        <Link href={link.href} className={toshiStyle} {...props}>
          {children}
        </Link>
      );
    }

    return (
      <Link href={link.href} className={standardStyle} {...props}>
        {children}
      </Link>
    );
  }

  if (style === "toshi") {
    return (
      <button type={type} className={toshiStyle} {...props}>
        {children}
      </button>
    );
  }

  return (
    <button type={type} className={standardStyle} {...props}>
      {children}
    </button>
  );
}

export default Button;
