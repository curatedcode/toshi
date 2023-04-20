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
      className="inline-flex w-16 gap-0.5 border border-black bg-white px-1 py-0.5 shadow-inner shadow-neutral-300"
      onClick={handleFocus}
      onBlur={handleBlur}
    >
      <label id={`${name}Label`} className="sr-only">
        {name} price
      </label>
      <span className="-mb-0.5 text-lg" aria-hidden>
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
