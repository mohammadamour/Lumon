import { Minus, Plus } from 'lucide-react';

interface QuantitySelectorProps {
  quantity: number;
  max: number;
  onChange: (qty: number) => void;
  disabled?: boolean;
}

/**
 * QuantitySelector — increment/decrement control with min 1, max stock.
 */
export default function QuantitySelector({
  quantity,
  max,
  onChange,
  disabled = false,
}: QuantitySelectorProps) {
  const decrement = () => {
    if (quantity > 1) onChange(quantity - 1);
  };

  const increment = () => {
    if (quantity < max) onChange(quantity + 1);
  };

  return (
    <div className="inline-flex items-center rounded-xl border border-gray-200 bg-white">
      <button
        onClick={decrement}
        disabled={disabled || quantity <= 1}
        className="flex h-10 w-10 items-center justify-center rounded-l-xl text-gray-500 transition-colors hover:bg-gray-50 hover:text-gray-900 disabled:opacity-30 disabled:cursor-not-allowed"
        aria-label="Decrease quantity"
      >
        <Minus size={16} />
      </button>

      <span className="flex h-10 w-12 items-center justify-center border-x border-gray-200 text-sm font-bold text-gray-900 tabular-nums select-none">
        {quantity}
      </span>

      <button
        onClick={increment}
        disabled={disabled || quantity >= max}
        className="flex h-10 w-10 items-center justify-center rounded-r-xl text-gray-500 transition-colors hover:bg-gray-50 hover:text-gray-900 disabled:opacity-30 disabled:cursor-not-allowed"
        aria-label="Increase quantity"
      >
        <Plus size={16} />
      </button>
    </div>
  );
}
