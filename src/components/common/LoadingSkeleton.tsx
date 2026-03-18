import clsx from 'clsx';

interface LoadingSkeletonProps {
  variant?: 'line' | 'card' | 'table';
  lines?: number;
  className?: string;
}

function SkeletonLine({ width }: { width?: string }) {
  return (
    <div
      className={clsx(
        'h-4 rounded bg-slate-700/50 dark:bg-slate-700/50 bg-slate-200 animate-pulse',
        width ?? 'w-full',
      )}
    />
  );
}

export default function LoadingSkeleton({
  variant = 'line',
  lines = 3,
  className,
}: LoadingSkeletonProps) {
  if (variant === 'line') {
    return (
      <div className={clsx('space-y-3', className)}>
        {Array.from({ length: lines }).map((_, i) => (
          <SkeletonLine
            key={i}
            width={i === lines - 1 ? 'w-2/3' : undefined}
          />
        ))}
      </div>
    );
  }

  if (variant === 'card') {
    return (
      <div
        className={clsx(
          'rounded-xl border border-border-dark dark:border-border-dark border-slate-200',
          'bg-surface-dark dark:bg-surface-dark bg-white p-6 animate-pulse',
          className,
        )}
      >
        <div className="h-4 w-1/3 rounded bg-slate-700/50 dark:bg-slate-700/50 bg-slate-200 mb-4" />
        <div className="space-y-3">
          <div className="h-8 w-2/3 rounded bg-slate-700/50 dark:bg-slate-700/50 bg-slate-200" />
          <div className="h-4 w-1/2 rounded bg-slate-700/50 dark:bg-slate-700/50 bg-slate-200" />
        </div>
      </div>
    );
  }

  // table variant
  return (
    <div
      className={clsx(
        'rounded-xl border border-border-dark dark:border-border-dark border-slate-200 overflow-hidden',
        className,
      )}
    >
      {/* Header row */}
      <div className="flex gap-4 p-4 bg-surface-dark dark:bg-surface-dark bg-slate-50 border-b border-border-dark dark:border-border-dark border-slate-200">
        {Array.from({ length: 4 }).map((_, i) => (
          <div
            key={i}
            className="h-4 flex-1 rounded bg-slate-700/50 dark:bg-slate-700/50 bg-slate-200 animate-pulse"
          />
        ))}
      </div>
      {/* Body rows */}
      {Array.from({ length: lines }).map((_, row) => (
        <div
          key={row}
          className="flex gap-4 p-4 border-b border-border-dark/50 dark:border-border-dark/50 border-slate-100 last:border-b-0"
        >
          {Array.from({ length: 4 }).map((_, col) => (
            <div
              key={col}
              className="h-4 flex-1 rounded bg-slate-700/30 dark:bg-slate-700/30 bg-slate-100 animate-pulse"
            />
          ))}
        </div>
      ))}
    </div>
  );
}
