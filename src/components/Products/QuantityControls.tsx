import { MinusIcon, PlusIcon } from "@heroicons/react/24/outline";
import type { QuantityControlsProps } from "~/customTypes";

function QuantityControls({
  maxQuantity,
  setQuantity,
  quantity,
  className = "",
  disabled,
  disabledMessage,
}: QuantityControlsProps) {
  function handleOrderQuantity(value: number, type: "btn" | "input" = "btn") {
    if (type === "btn") {
      if (value + quantity > maxQuantity) return;
      if (value + quantity < 1) return;

      return setQuantity((prev) => prev + value);
    }
    if (value > maxQuantity) return;
    return setQuantity(value);
  }

  return (
    <div
      className={`mb-3 flex h-fit w-fit rounded-md border border-black bg-white text-lg shadow-md shadow-neutral-400/70 ${
        disabled ? "bg-neutral-300 hover:cursor-not-allowed" : ""
      } ${className}`}
    >
      <button
        type="button"
        aria-label={disabled ? disabledMessage : "Minus one"}
        onClick={() => handleOrderQuantity(-1)}
        className="flex items-center rounded-l-md px-4 transition-colors hover:bg-neutral-100 disabled:hover:cursor-not-allowed disabled:hover:bg-transparent"
        disabled={disabled}
      >
        <MinusIcon className="w-4" aria-hidden />
      </button>
      <input
        type="number"
        onChange={(e) =>
          handleOrderQuantity(Number(e.currentTarget.value), "input")
        }
        value={quantity}
        title={disabled ? disabledMessage : "Set quantity"}
        className="w-10 bg-transparent px-1 text-center disabled:hover:cursor-not-allowed disabled:hover:bg-transparent"
        disabled={disabled}
      />
      <button
        type="button"
        aria-label={disabled ? disabledMessage : "Plus one"}
        onClick={() => handleOrderQuantity(1)}
        className="flex items-center rounded-r-md px-4 transition-colors hover:bg-neutral-100 disabled:hover:cursor-not-allowed disabled:hover:bg-transparent"
        disabled={disabled}
      >
        <PlusIcon className="w-4" aria-hidden />
      </button>
    </div>
  );
}

export default QuantityControls;
