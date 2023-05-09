import { MinusIcon, PlusIcon } from "@heroicons/react/24/outline";
import type { QuantityControlsProps } from "~/customTypes";

function QuantityControls({
  maxQuantity,
  setQuantity,
  quantity,
  className = "",
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
      className={`mb-3 flex h-fit w-fit rounded-md border border-black bg-neutral-100 text-lg shadow-md shadow-neutral-400/70 md:bg-white ${className}`}
    >
      <button
        type="button"
        aria-label="minus one"
        onClick={() => handleOrderQuantity(-1)}
        className="flex items-center rounded-l-md px-4 transition-colors hover:bg-neutral-100"
      >
        <MinusIcon className="w-4" aria-hidden />
      </button>
      <input
        type="number"
        onChange={(e) =>
          handleOrderQuantity(Number(e.currentTarget.value), "input")
        }
        value={quantity}
        title="set quantity"
        className="w-10 bg-transparent px-1 text-center"
      />
      <button
        type="button"
        aria-label="plus one"
        onClick={() => handleOrderQuantity(1)}
        className="flex items-center rounded-r-md px-4 transition-colors hover:bg-neutral-100"
      >
        <PlusIcon className="w-4" aria-hidden />
      </button>
    </div>
  );
}

export default QuantityControls;
