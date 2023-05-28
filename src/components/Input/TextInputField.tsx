import { forwardRef } from "react";
import type { TextInputFieldProps } from "~/customTypes";

/**
 * @param label - string
 * @param maxLength - number
 * @param error - string
 */
const TextInputField = forwardRef(function TextInputField(
  {
    internalLabel,
    visibleLabel,
    className = "",
    maxLength,
    classNameContainer = "",
    error,
    ...props
  }: TextInputFieldProps,
  ref
) {
  return (
    <div className={`flex flex-col ${classNameContainer}`}>
      <label
        htmlFor={internalLabel}
        className="ml-1 font-semibold hover:cursor-pointer"
      >
        {visibleLabel}
      </label>
      <input
        id={internalLabel}
        className={`${className} duration-50 rounded-md border-2 bg-neutral-100 px-3 py-1 transition-colors focus-within:border-toshi-primary focus-within:outline-none disabled:cursor-not-allowed disabled:border-neutral-300 disabled:bg-neutral-200 ${
          error ? "border-red-500 focus-within:border-red-500" : ""
        }`}
        maxLength={maxLength}
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-expect-error
        ref={ref}
        {...props}
      />
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

export default TextInputField;
