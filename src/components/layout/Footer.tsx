import clsx from 'clsx';
import { useHealth } from '@/api/hooks';
import { useNetwork } from '@/hooks/useNetwork';

export default function Footer() {
  const { network } = useNetwork();
  const { data: health } = useHealth();

  const isHealthy = health?.status === 'ok';

  return (
    <footer
      className={clsx(
        'border-t',
        'border-border-dark dark:border-border-dark border-slate-200',
        'bg-bg-dark dark:bg-bg-dark bg-white',
      )}
    >
      <div className="max-w-7xl mx-auto px-4 py-4">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-slate-500 dark:text-slate-500 text-slate-400">
          <span className="font-medium">
            Nusantara Explorer{' '}
            <span className="text-slate-600 dark:text-slate-600 text-slate-300">
              v0.1.0
            </span>
          </span>

          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1.5">
              <span
                className={clsx(
                  'w-2 h-2 rounded-full',
                  isHealthy ? 'bg-emerald-400' : 'bg-red-400',
                )}
              />
              {isHealthy ? 'Healthy' : 'Unhealthy'}
            </span>
            <span className="text-slate-600 dark:text-slate-600 text-slate-300">
              |
            </span>
            <span>{network.label}</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
