import { X } from 'lucide-react';

interface ActiveFilterChipsProps {
  params: Record<string, string>;
  removeParam: (key: string) => void;
  clearAll: () => void;
}

export default function ActiveFilterChips({ params, removeParam, clearAll }: ActiveFilterChipsProps) {
  const chips = [];

  if (params.search) {
    chips.push({
      key: 'search',
      label: `"${params.search}"`,
    });
  }

  if (params.category) {
    chips.push({
      key: 'category',
      label: params.category
        .split('-')
        .map((w: string) => w.charAt(0).toUpperCase() + w.slice(1))
        .join(' '),
    });
  }

  if (params.min_price) {
    chips.push({
      key: 'min_price',
      label: `Min $${params.min_price}`,
    });
  }

  if (params.max_price) {
    chips.push({
      key: 'max_price',
      label: `Max $${params.max_price}`,
    });
  }

  if (chips.length === 0) return null;

  return (
    <div className="flex flex-wrap items-center gap-2">
      {chips.map((chip) => (
        <button
          key={chip.key}
          onClick={() => removeParam(chip.key)}
          className="inline-flex items-center gap-1.5 rounded-full bg-primary-50 px-3 py-1.5 text-caption font-semibold text-primary transition-colors hover:bg-primary-100"
        >
          {chip.label}
          <X size={12} className="opacity-60" />
        </button>
      ))}
      {chips.length > 1 && (
        <button
          onClick={clearAll}
          className="text-caption font-semibold text-muted hover:text-danger transition-colors ml-1"
        >
          Clear all
        </button>
      )}
    </div>
  );
}
