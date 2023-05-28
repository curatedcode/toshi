/* eslint-disable @typescript-eslint/ban-ts-comment */
import { Listbox, Transition } from "@headlessui/react";
import { ChevronUpDownIcon } from "@heroicons/react/24/outline";
import { Fragment } from "react";
import { Controller } from "react-hook-form";
import type {
  FormSelectInputFieldProps,
  SelectInputFieldProps,
} from "~/customTypes";

/**
 * @param maxLength - max characters allowed
 * @param error - messages to display on error
 * @param options - array of options as strings or numbers
 */
function SelectInputField({
  internalLabel,
  visibleLabel,
  className = "",
  classNameContainer = "",
  options,
  title,
  onChange,
}: SelectInputFieldProps) {
  return (
    <Listbox onChange={onChange} defaultValue={options[0]}>
      <div
        className={`relative flex flex-col ${classNameContainer}`}
        title={title}
      >
        {visibleLabel && (
          <Listbox.Label
            className="ml-1 font-semibold hover:cursor-pointer"
            htmlFor={internalLabel}
          >
            {visibleLabel}
          </Listbox.Label>
        )}
        <Listbox.Button
          className={`duration-50 relative rounded-md border-2 bg-neutral-100 px-3 py-1 transition-colors focus-within:border-toshi-primary focus-within:outline-none disabled:cursor-not-allowed disabled:border-neutral-300 disabled:bg-neutral-200 ${className}`}
        >
          {({ value }: { value: { name: string } }) => (
            <>
              <span>{value.name}</span>
              <ChevronUpDownIcon
                className="absolute right-1 top-1/2 w-5 -translate-y-1/2"
                aria-hidden
              />
            </>
          )}
        </Listbox.Button>
        <Transition
          as={Fragment}
          enter="transition ease-out duration-50"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-50"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <Listbox.Options
            className={`absolute mt-10 max-h-60 w-full overflow-auto rounded-md bg-neutral-100 p-1 focus:outline-none`}
            id={internalLabel}
          >
            {options.map((option, index) => (
              <Listbox.Option
                key={index}
                className={({ active }) =>
                  `relative cursor-default select-none py-2 pl-10 pr-4 ${
                    active ? "bg-neutral-200 text-neutral-700" : ""
                  }`
                }
                value={option.id}
              >
                {option.name}
              </Listbox.Option>
            ))}
          </Listbox.Options>
        </Transition>
      </div>
    </Listbox>
  );
}

/**
 * @param maxLength - max characters allowed
 * @param error - messages to display on error
 * @param options - array of options as strings or numbers
 */
function FormSelectInputField({
  internalLabel,
  visibleLabel,
  className = "",
  classNameContainer = "",
  error,
  options,
  control,
}: FormSelectInputFieldProps) {
  return (
    <Controller
      name={internalLabel}
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      control={control}
      render={({ field: { value, ...rest } }) => (
        <Listbox
          value={value as (typeof options)[0]}
          defaultValue={options[0]}
          {...rest}
        >
          <div className={`relative flex flex-col ${classNameContainer}`}>
            <Listbox.Label className="ml-1 font-semibold hover:cursor-pointer">
              {visibleLabel}
            </Listbox.Label>
            <Listbox.Button
              className={`duration-50 relative rounded-md border-2 bg-neutral-100 px-3 py-1 transition-colors focus-within:border-toshi-primary focus-within:outline-none disabled:cursor-not-allowed disabled:border-neutral-300 disabled:bg-neutral-200 ${
                error ? "border-red-500 focus-within:border-red-500" : ""
              } ${className}`}
            >
              {({ value }) => (
                <>
                  <span>{value}</span>
                  <ChevronUpDownIcon
                    className="absolute right-1 top-1/2 w-5 -translate-y-1/2"
                    aria-hidden
                  />
                </>
              )}
            </Listbox.Button>
            <Transition
              as={Fragment}
              enter="transition ease-out duration-50"
              enterFrom="opacity-0"
              enterTo="opacity-100"
              leave="ease-in duration-50"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <Listbox.Options
                className={`absolute mt-16 max-h-60 w-full overflow-auto rounded-md bg-neutral-100 p-1 focus:outline-none`}
              >
                {options.map((option, index) => (
                  <Listbox.Option
                    key={index}
                    className={({ active }) =>
                      `relative cursor-default select-none py-2 pl-10 pr-4 ${
                        active ? "bg-neutral-200 text-neutral-700" : ""
                      }`
                    }
                    value={option}
                  >
                    {option}
                  </Listbox.Option>
                ))}
              </Listbox.Options>
            </Transition>
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
        </Listbox>
      )}
    />
  );
}
export { FormSelectInputField };
export default SelectInputField;
