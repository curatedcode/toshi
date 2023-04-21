import type { ButtonProps } from "~/customTypes";

export default function Button({
  variant = "default",
  icon,
  radius = "md",
  className = "",
  children,
  alignIcon = "start",
  ...props
}: ButtonProps) {
  switch (variant) {
    case "filled":
      return (
        <button
          className={`bg-logo-blue inline-flex h-fit w-fit items-center gap-1 whitespace-nowrap px-4 py-[0.45rem] text-base text-white transition-opacity focus-within:ring-2 focus-within:ring-black hover:opacity-80 rounded-${radius} ${className}`}
          {...props}
        >
          {icon && alignIcon === "start" && icon}
          {children}
          {icon && alignIcon === "end" && icon}
        </button>
      );
    case "outline":
      return (
        <button
          className={`border-1 inline-flex h-fit w-fit items-center gap-1 whitespace-nowrap border-black bg-transparent px-4 py-[0.45rem] text-base transition-opacity focus-within:ring-2 focus-within:ring-black hover:opacity-80 rounded-${radius} ${className}`}
          {...props}
        >
          {icon && alignIcon === "start" && icon}
          {children}
          {icon && alignIcon === "end" && icon}
        </button>
      );
    default:
      return (
        <button
          className={`inline-flex h-fit w-fit items-center gap-1 whitespace-nowrap px-4 py-[0.45rem] text-base transition-opacity focus-within:ring-2 focus-within:ring-black hover:opacity-80 rounded-${radius} ${className}`}
          {...props}
        >
          {icon && alignIcon === "start" && icon}
          {children}
          {icon && alignIcon === "end" && icon}
        </button>
      );
  }
}
