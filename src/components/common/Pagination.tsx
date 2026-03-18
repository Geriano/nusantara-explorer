import { useMemo } from 'react';
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from 'lucide-react';
import clsx from 'clsx';

interface PaginationProps {
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

function getPageNumbers(
  current: number,
  total: number,
): (number | 'ellipsis')[] {
  if (total <= 7) {
    return Array.from({ length: total }, (_, i) => i + 1);
  }

  const pages: (number | 'ellipsis')[] = [1];

  if (current > 3) {
    pages.push('ellipsis');
  }

  const start = Math.max(2, current - 1);
  const end = Math.min(total - 1, current + 1);

  for (let i = start; i <= end; i++) {
    pages.push(i);
  }

  if (current < total - 2) {
    pages.push('ellipsis');
  }

  if (total > 1) {
    pages.push(total);
  }

  return pages;
}

const btnBase = clsx(
  'inline-flex items-center justify-center h-8 min-w-[2rem] px-1.5 rounded-md text-sm font-medium',
  'transition-colors focus:outline-none focus:ring-1 focus:ring-accent/50',
  'disabled:opacity-30 disabled:cursor-not-allowed',
);

const btnNav = clsx(
  btnBase,
  'text-slate-400 hover:text-white hover:bg-surface-dark dark:hover:bg-surface-dark',
);

export default function Pagination({
  page,
  totalPages,
  onPageChange,
}: PaginationProps) {
  const pages = useMemo(() => getPageNumbers(page, totalPages), [page, totalPages]);

  if (totalPages <= 1) return null;

  return (
    <nav
      className="flex items-center justify-center gap-1 mt-4"
      aria-label="Pagination"
    >
      <button
        className={btnNav}
        onClick={() => onPageChange(1)}
        disabled={page === 1}
        aria-label="First page"
      >
        <ChevronsLeft className="w-4 h-4" />
      </button>
      <button
        className={btnNav}
        onClick={() => onPageChange(page - 1)}
        disabled={page === 1}
        aria-label="Previous page"
      >
        <ChevronLeft className="w-4 h-4" />
      </button>

      {pages.map((p, idx) =>
        p === 'ellipsis' ? (
          <span
            key={`ellipsis-${idx}`}
            className="inline-flex items-center justify-center h-8 w-8 text-slate-500 text-sm"
          >
            ...
          </span>
        ) : (
          <button
            key={p}
            className={clsx(
              btnBase,
              p === page
                ? 'bg-accent text-bg-dark font-semibold'
                : 'text-slate-400 hover:text-white hover:bg-surface-dark dark:hover:bg-surface-dark',
            )}
            onClick={() => onPageChange(p)}
            aria-current={p === page ? 'page' : undefined}
          >
            {p}
          </button>
        ),
      )}

      <button
        className={btnNav}
        onClick={() => onPageChange(page + 1)}
        disabled={page === totalPages}
        aria-label="Next page"
      >
        <ChevronRight className="w-4 h-4" />
      </button>
      <button
        className={btnNav}
        onClick={() => onPageChange(totalPages)}
        disabled={page === totalPages}
        aria-label="Last page"
      >
        <ChevronsRight className="w-4 h-4" />
      </button>
    </nav>
  );
}
