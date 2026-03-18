import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Clock } from 'lucide-react';
import clsx from 'clsx';
import { useEpochInfo } from '@/api/hooks';
import { SLOT_DURATION_MS } from '@/utils/constants';
import { formatSlot } from '@/utils/format';
import LoadingSkeleton from '@/components/common/LoadingSkeleton';

export default function EpochProgress() {
  const { data: epochInfo, isLoading } = useEpochInfo();

  const progress = useMemo(() => {
    if (!epochInfo?.slotsInEpoch) return 0;
    return ((epochInfo.slotIndex ?? 0) / epochInfo.slotsInEpoch) * 100;
  }, [epochInfo]);

  const slotsRemaining = useMemo(() => {
    if (!epochInfo?.slotsInEpoch) return 0;
    return epochInfo.slotsInEpoch - (epochInfo.slotIndex ?? 0);
  }, [epochInfo]);

  const timeRemaining = useMemo(() => {
    if (!slotsRemaining) return '\u2014';
    const totalMs = slotsRemaining * SLOT_DURATION_MS;
    const totalMinutes = Math.floor(totalMs / 60_000);
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;

    if (hours > 0) {
      return `${hours}h ${minutes}m`;
    }
    return `${minutes}m`;
  }, [slotsRemaining]);

  if (isLoading) {
    return <LoadingSkeleton variant="card" />;
  }

  if (!epochInfo) return null;

  return (
    <div
      className={clsx(
        'rounded-xl border p-5',
        'border-border-dark dark:border-border-dark border-slate-200',
        'bg-surface-dark dark:bg-surface-dark bg-white',
      )}
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Clock className="w-4 h-4 text-accent" />
          <h3 className="text-sm font-semibold text-slate-300 dark:text-slate-300 text-slate-700">
            Epoch Progress
          </h3>
        </div>
        <Link
          to={`/epoch/${epochInfo.epoch}`}
          className="text-xs text-accent hover:text-accent-hover transition-colors font-medium"
        >
          Epoch {epochInfo.epoch}
        </Link>
      </div>

      {/* Progress bar */}
      <div className="mb-3">
        <div className="w-full h-2.5 rounded-full bg-border-dark dark:bg-border-dark bg-slate-200 overflow-hidden">
          <div
            className="h-full rounded-full bg-gradient-to-r from-accent/80 to-accent transition-all duration-500"
            style={{ width: `${Math.min(progress, 100)}%` }}
          />
        </div>
        <div className="flex items-center justify-between mt-1.5">
          <span className="text-xs text-slate-500">
            {progress.toFixed(2)}%
          </span>
          <span className="text-xs text-slate-500">
            {formatSlot(epochInfo.slotIndex)} / {formatSlot(epochInfo.slotsInEpoch)}
          </span>
        </div>
      </div>

      {/* Stats */}
      <div className="flex items-center justify-between text-sm">
        <div>
          <p className="text-slate-500 text-xs">Slots Remaining</p>
          <p className="text-white dark:text-white text-slate-900 font-medium">
            {formatSlot(slotsRemaining)}
          </p>
        </div>
        <div className="text-right">
          <p className="text-slate-500 text-xs">Est. Time Remaining</p>
          <p className="text-white dark:text-white text-slate-900 font-medium">
            {timeRemaining}
          </p>
        </div>
      </div>
    </div>
  );
}
