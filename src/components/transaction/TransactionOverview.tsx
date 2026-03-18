import { Link } from 'react-router-dom';
import { FileText, Hash, Box, Coins } from 'lucide-react';
import clsx from 'clsx';
import type { TransactionStatusResponse } from '@nusantara/sdk';
import { lamportsToNusa, formatSlot } from '@/utils/format';
import HashDisplay from '@/components/common/HashDisplay';
import StatusBadge from '@/components/common/StatusBadge';

interface TransactionOverviewProps {
  tx: TransactionStatusResponse;
}

interface DetailRowProps {
  icon: React.ReactNode;
  label: string;
  children: React.ReactNode;
}

function DetailRow({ icon, label, children }: DetailRowProps) {
  return (
    <div
      className={clsx(
        'flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-0 py-3',
        'border-b border-border-dark/50 dark:border-border-dark/50 border-slate-100 last:border-b-0',
      )}
    >
      <div className="flex items-center gap-2 sm:w-48 shrink-0 text-slate-400 dark:text-slate-400 text-slate-500 text-sm">
        {icon}
        {label}
      </div>
      <div className="text-white dark:text-white text-slate-900 text-sm flex-1 min-w-0">
        {children}
      </div>
    </div>
  );
}

export default function TransactionOverview({ tx }: TransactionOverviewProps) {
  return (
    <div
      className={clsx(
        'rounded-xl border p-5',
        'border-border-dark dark:border-border-dark border-slate-200',
        'bg-surface-dark dark:bg-surface-dark bg-white',
      )}
    >
      {/* Status banner */}
      <div className="flex items-center gap-3 mb-5">
        <FileText className="w-5 h-5 text-accent" />
        <h2 className="text-lg font-semibold text-white dark:text-white text-slate-900">
          Transaction Details
        </h2>
        <StatusBadge status={tx.status} />
      </div>

      <div>
        <DetailRow
          icon={<Hash className="w-4 h-4" />}
          label="Signature"
        >
          <HashDisplay hash={tx.signature} truncate={false} />
        </DetailRow>

        <DetailRow
          icon={<Box className="w-4 h-4" />}
          label="Block"
        >
          <Link
            to={`/block/${tx.slot}`}
            className="text-accent hover:text-accent-hover font-mono transition-colors"
          >
            {formatSlot(tx.slot)}
          </Link>
        </DetailRow>

        <DetailRow
          icon={<Coins className="w-4 h-4" />}
          label="Fee"
        >
          <span className="font-mono">
            {lamportsToNusa(tx.fee)}{' '}
            <span className="text-slate-500">NUSA</span>
          </span>
        </DetailRow>
      </div>
    </div>
  );
}
