import { Minus, Plus } from 'lucide-react';

interface QuantitySelectorProps {
  quantity: number;
  onChange: (quantity: number) => void;
  min?: number;
  max?: number;
  size?: 'sm' | 'md';
}

export default function QuantitySelector({
  quantity,
  onChange,
  min = 1,
  max = 99,
  size = 'md',
}: QuantitySelectorProps) {
  const btnSizes = {
    sm: 'w-8 h-8',
    md: 'w-10 h-10',
  };

  const iconSizes = {
    sm: 'w-3.5 h-3.5',
    md: 'w-4 h-4',
  };

  const textSize = {
    sm: 'text-sm w-8',
    md: 'text-base w-10',
  };

  const handleDecrement = () => {
    if (quantity > min) onChange(quantity - 1);
  };

  const handleIncrement = () => {
    if (quantity < max) onChange(quantity + 1);
  };

  return (
    <div className="flex items-center gap-1">
      <button
        onClick={handleDecrement}
        disabled={quantity <= min}
        className={`${btnSizes[size]} flex items-center justify-center rounded-lg border border-fog bg-white text-charcoal hover:bg-cloud transition-colors disabled:opacity-40 disabled:cursor-not-allowed`}
      >
        <Minus className={iconSizes[size]} />
      </button>
      <span
        className={`${textSize[size]} h-10 flex items-center justify-center font-space font-semibold text-charcoal select-none`}
      >
        {quantity}
      </span>
      <button
        onClick={handleIncrement}
        disabled={quantity >= max}
        className={`${btnSizes[size]} flex items-center justify-center rounded-lg border border-fog bg-white text-charcoal hover:bg-cloud transition-colors disabled:opacity-40 disabled:cursor-not-allowed`}
      >
        <Plus className={iconSizes[size]} />
      </button>
    </div>
  );
}
