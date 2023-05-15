import { forwardRef } from "react";
import type { TextAreaInputFieldProps } from "~/customTypes";

/**
 * @param label - string
 * @param maxLength - number
 * @param error - string
 */
const TextAreaInputField = forwardRef(function TextInputField(
  {
    internalLabel,
    visibleLabel,
    className,
    maxLength,
    error,
    ...props
  }: TextAreaInputFieldProps,
  ref
) {
  return (
    <div className="flex flex-col">
      <label htmlFor={internalLabel} className="ml-1 w-fit font-semibold">
        {visibleLabel}
      </label>
      <textarea
        id={internalLabel}
        className={`duration-50 resize-none rounded-md border-2 bg-neutral-100 px-3 py-1 transition-shadow focus-within:border-neutral-500 focus-within:shadow-md focus-within:shadow-neutral-400 focus-within:outline-none disabled:cursor-not-allowed disabled:border-neutral-300 disabled:bg-neutral-200 ${
          error ? "border-red-500 focus-within:border-red-500" : ""
        } ${className ?? ""}`}
        maxLength={maxLength}
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-expect-error
        ref={ref}
        rows={4}
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

export default TextAreaInputField;
