import { forwardRef } from "react";
import type { SelectInputFieldProps } from "~/customTypes";

/**
 * @param label - string
 * @param maxLength - number
 * @param error - string
 * @param options - array of options as strings
 */
const SelectInputField = forwardRef(function TextInputField(
  {
    internalLabel,
    visibleLabel,
    className = "",
    classNameContainer = "",
    error,
    options,
    ...props
  }: SelectInputFieldProps,
  ref
) {
  return (
    <div className={`flex flex-col ${classNameContainer}`}>
      <label htmlFor={internalLabel} className="ml-1 w-fit font-semibold">
        {visibleLabel}
      </label>
      <select
        id={internalLabel}
        className={`${className} duration-50 rounded-md border-2 bg-neutral-100 px-3 py-1 transition-shadow focus-within:border-neutral-500 focus-within:shadow-md focus-within:shadow-neutral-400 focus-within:outline-none disabled:cursor-not-allowed disabled:border-neutral-300 disabled:bg-neutral-200 ${
          error ? "border-red-500 focus-within:border-red-500" : ""
        }`}
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-expect-error
        ref={ref}
        {...props}
      >
        {options.map((option) => (
          <option key={option}>{option}</option>
        ))}
      </select>
      <div
        className={`ml-1 flex items-center gap-1 text-sm text-red-500 ${
          error ? "" : "hidden"
        }`}
      >
        <span className="text-lg font-semibold">!</span>
        <p
          role="alert"
          aria-hidden={error ? "false" : "true"}
          className="text-red-500"
        >
          {error}
        </p>
      </div>
    </div>
  );
});

export default SelectInputField;
