import type { ReactNode } from 'react';
import clsx from 'clsx';

interface StatCardProps {
  label: string;
  value: string | number;
  icon?: ReactNode;
  loading?: boolean;
  className?: string;
}

export default function StatCard({
  label,
  value,
  icon,
  loading = false,
  className,
}: StatCardProps) {
  return (
    <div
      className={clsx(
        'rounded-xl border',
        'border-border-dark dark:border-border-dark border-slate-200',
        'bg-surface-dark dark:bg-surface-dark bg-white',
        'p-5 transition-colors',
        className,
      )}
    >
      <div className="flex items-start justify-between">
        <div className="min-w-0 flex-1">
          <p className="text-sm font-medium text-slate-400 dark:text-slate-400 text-slate-500 mb-1">
            {label}
          </p>
          {loading ? (
            <div className="h-8 w-24 rounded bg-slate-700/50 dark:bg-slate-700/50 bg-slate-200 animate-pulse" />
          ) : (
            <p className="text-2xl font-semibold text-white dark:text-white text-slate-900 truncate">
              {value}
            </p>
          )}
        </div>
        {icon && (
          <div className="shrink-0 ml-3 p-2 rounded-lg bg-accent/10 text-accent">
            {icon}
          </div>
        )}
      </div>
    </div>
  );
}
