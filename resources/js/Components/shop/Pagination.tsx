import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Pagination as PaginationType } from '@/types';

interface PaginationProps {
  meta: PaginationType<any> | null;
  setParam: (key: string, value: number) => void;
}

export default function Pagination({ meta, setParam }: PaginationProps) {
  if (!meta || meta.last_page <= 1) return null;

  const { current_page: current, last_page: last } = meta;

  // Build page number array with ellipsis
  const pages = [];
  const delta = 2;

  for (let i = 1; i <= last; i++) {
    if (
      i === 1 ||
      i === last ||
      (i >= current - delta && i <= current + delta)
    ) {
      pages.push(i);
    } else if (pages[pages.length - 1] !== '...') {
      pages.push('...');
    }
  }

  const btnBase =
    'flex h-10 min-w-[2.5rem] items-center justify-center rounded-lg text-body font-medium transition-all';

  return (
    <nav
      className="flex items-center justify-center gap-1.5 pt-8"
      aria-label="Pagination"
    >
      {/* Previous */}
      <button
        onClick={() => setParam('page', current - 1)}
        disabled={current <= 1}
        className={`${btnBase} px-2 ${
          current <= 1
            ? 'text-muted-light cursor-not-allowed'
            : 'text-muted hover:bg-primary-50 hover:text-primary'
        }`}
        aria-label="Previous page"
      >
        <ChevronLeft size={18} />
      </button>

      {/* Page Numbers */}
      {pages.map((page, i) =>
        page === '...' ? (
          <span key={`ellipsis-${i}`} className="px-1 text-muted-light select-none">
            …
          </span>
        ) : (
          <button
            key={page}
            onClick={() => setParam('page', page as number)}
            className={`${btnBase} ${
              page === current
                ? 'bg-primary text-white shadow-sm'
                : 'text-muted hover:bg-primary-50 hover:text-primary'
            }`}
            aria-current={page === current ? 'page' : undefined}
          >
            {page}
          </button>
        )
      )}

      {/* Next */}
      <button
        onClick={() => setParam('page', current + 1)}
        disabled={current >= last}
        className={`${btnBase} px-2 ${
          current >= last
            ? 'text-muted-light cursor-not-allowed'
            : 'text-muted hover:bg-primary-50 hover:text-primary'
        }`}
        aria-label="Next page"
      >
        <ChevronRight size={18} />
      </button>
    </nav>
  );
}
