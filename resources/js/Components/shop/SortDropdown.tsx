import { ChevronDown } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';

const SORT_OPTIONS = [
  { label: 'Newest', value: 'created_at', order: 'desc' },
  { label: 'Price: Low → High', value: 'price', order: 'asc' },
  { label: 'Price: High → Low', value: 'price', order: 'desc' },
  { label: 'Name: A → Z', value: 'name', order: 'asc' },
];

interface SortDropdownProps {
  params: Record<string, string>;
  setParam: (key: string, value: string) => void;
}

export default function SortDropdown({ params, setParam }: SortDropdownProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  // Close on outside click
  useEffect(() => {
    if (!open) return;
    const handle = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('click', handle);
    return () => document.removeEventListener('click', handle);
  }, [open]);

  const currentSort = SORT_OPTIONS.find(
    (o) => o.value === params.sort_by && o.order === params.sort_order
  ) || SORT_OPTIONS[0];

  const handleSelect = (option: { label: string; value: string; order: string }) => {
    // Set both params — use direct URL manipulation to batch them
    const url = new URL(window.location.href);
    url.searchParams.set('sort_by', option.value);
    url.searchParams.set('sort_order', option.order);
    url.searchParams.delete('page');
    window.history.replaceState({}, '', url);
    // Trigger re-render via setParam (the last call wins)
    setParam('sort_by', option.value);
    setOpen(false);
  };

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-body font-medium text-dark shadow-card transition-all hover:shadow-card-lg"
      >
        <span className="text-muted">Sort:</span>
        <span className="font-semibold">{currentSort.label}</span>
        <ChevronDown
          size={16}
          className={`text-muted transition-transform ${open ? 'rotate-180' : ''}`}
        />
      </button>

      {open && (
        <div className="absolute right-0 top-full mt-1.5 w-56 rounded-xl border border-light-200 bg-white py-1.5 shadow-card-lg animate-scale-in z-20">
          {SORT_OPTIONS.map((option) => (
            <button
              key={option.label}
              onClick={() => handleSelect(option)}
              className={`w-full px-4 py-2.5 text-left text-body transition-colors ${
                currentSort.label === option.label
                  ? 'bg-primary-50 text-primary font-semibold'
                  : 'text-muted hover:bg-light-100 hover:text-dark'
              }`}
            >
              {option.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
