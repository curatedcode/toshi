import { useRef } from "react";
import type { TextInputProps } from "~/customTypes";

export default function TextInput({
  icon,
  radius = "md",
  className = "",
  alignIcon = "start",
  ...props
}: TextInputProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  function handleFocus() {
    inputRef.current?.focus();
  }
  function handleBlur() {
    inputRef.current?.blur();
  }

  return (
    <div
      className={`inline-flex h-fit cursor-text bg-white py-[0.45rem] text-base text-black focus-within:ring-2 focus-within:ring-black rounded-${radius} ${
        icon ? "px-4" : "px-2"
      } ${className}`}
      onClick={handleFocus}
      onBlur={handleBlur}
      data-testid="textInput"
    >
      {icon && alignIcon === "start" && icon}
      <input
        type="text"
        className="w-full bg-transparent pl-2 focus:outline-none"
        onFocus={handleFocus}
        onBlur={handleBlur}
        ref={inputRef}
        {...props}
      />
      {icon && alignIcon === "end" && icon}
    </div>
  );
}
