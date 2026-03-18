import clsx from 'clsx';

interface StatusBadgeProps {
  status: string;
}

function getStatusConfig(status: string): {
  label: string;
  colorClasses: string;
} {
  const normalized = status.toLowerCase();

  if (
    normalized === 'success' ||
    normalized === 'finalized' ||
    normalized === 'confirmed' ||
    normalized === 'active'
  ) {
    return {
      label: status,
      colorClasses:
        'bg-emerald-500/15 text-emerald-400 border-emerald-500/30',
    };
  }

  if (normalized === 'failed' || normalized === 'error' || normalized === 'delinquent') {
    return {
      label: status,
      colorClasses: 'bg-red-500/15 text-red-400 border-red-500/30',
    };
  }

  if (
    normalized === 'pending' ||
    normalized === 'processing' ||
    normalized === 'confirming'
  ) {
    return {
      label: status,
      colorClasses:
        'bg-yellow-500/15 text-yellow-400 border-yellow-500/30',
    };
  }

  return {
    label: status,
    colorClasses: 'bg-slate-500/15 text-slate-400 border-slate-500/30',
  };
}

export default function StatusBadge({ status }: StatusBadgeProps) {
  const { label, colorClasses } = getStatusConfig(status);

  return (
    <span
      className={clsx(
        'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border capitalize',
        colorClasses,
      )}
    >
      {label}
    </span>
  );
}
