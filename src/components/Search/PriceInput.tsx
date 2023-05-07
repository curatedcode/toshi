import { useRef } from "react";
import type { PriceInput } from "~/customTypes";

function PriceInput({ name, onChange }: PriceInput) {
  const inputRef = useRef<HTMLInputElement>(null);

  function handleFocus() {
    inputRef.current?.focus();
  }
  function handleBlur() {
    inputRef.current?.blur();
  }
  return (
    <div
      className="flex w-16 gap-0.5 rounded-md border border-neutral-500 bg-white px-1 py-0.5"
      onClick={handleFocus}
      onBlur={handleBlur}
    >
      <label id={`${name}Label`} className="sr-only">
        {name} price
      </label>
      <span className="text-lg text-neutral-500" aria-hidden>
        $
      </span>
      <input
        type="number"
        ref={inputRef}
        aria-labelledby={`${name}Label`}
        name={name}
        placeholder={name}
        className="w-full bg-transparent placeholder:font-medium focus:outline-none "
        min={name === "Min" ? "0" : "1"}
        onChange={onChange}
      />
    </div>
  );
}

export default PriceInput;
