import { Fragment } from "react";
import type { DropdownProps } from "~/customTypes";
import { Popover, Transition } from "@headlessui/react";

function Dropdown({
  children,
  trigger,
  offset = 12,
  className = "",
  position,
}: DropdownProps) {
  return (
    <div className="relative">
      <Popover className="relative">
        {() => (
          <>
            <Popover.Button className="flex">{trigger}</Popover.Button>
            <Transition
              as={Fragment}
              enter="transition ease-out duration-200"
              enterFrom="opacity-0 translate-y-1"
              enterTo="opacity-100 translate-y-0"
              leave="transition ease-in duration-150"
              leaveFrom="opacity-100 translate-y-0"
              leaveTo="opacity-0 translate-y-1"
            >
              <Popover.Panel
                className={`absolute z-10 mt-3 w-screen max-w-[18rem] -translate-x-1/2 px-4 ${
                  position === "right" ? "dropDownMenu" : ""
                }`}
                style={
                  position === "left"
                    ? { marginTop: offset, left: "min(100vw - 18rem, 50%" }
                    : { marginTop: offset }
                }
              >
                <div className="overflow-hidden rounded-lg shadow-lg shadow-neutral-300 ring-1 ring-black ring-opacity-10">
                  <div className={`relative grid bg-white p-2 ${className}`}>
                    {children}
                  </div>
                </div>
              </Popover.Panel>
            </Transition>
          </>
        )}
      </Popover>
    </div>
  );
}

export default Dropdown;
