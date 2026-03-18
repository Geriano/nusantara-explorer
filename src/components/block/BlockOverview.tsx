import { Link } from 'react-router-dom';
import { Box, Hash, ArrowLeft, Clock, ListOrdered } from 'lucide-react';
import clsx from 'clsx';
import type { BlockResponse } from '@nusantara/sdk';
import { formatSlot } from '@/utils/format';
import HashDisplay from '@/components/common/HashDisplay';
import TimeAgo from '@/components/common/TimeAgo';

interface BlockOverviewProps {
  block: BlockResponse;
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

export default function BlockOverview({ block }: BlockOverviewProps) {
  const parentSlot = block.parentSlot;

  const absoluteTime = new Date(block.timestamp * 1000).toLocaleString();

  return (
    <div
      className={clsx(
        'rounded-xl border p-5',
        'border-border-dark dark:border-border-dark border-slate-200',
        'bg-surface-dark dark:bg-surface-dark bg-white',
      )}
    >
      <div className="flex items-center gap-2 mb-4">
        <Box className="w-5 h-5 text-accent" />
        <h2 className="text-lg font-semibold text-white dark:text-white text-slate-900">
          Block Overview
        </h2>
      </div>

      <div className="divide-y-0">
        <DetailRow
          icon={<ListOrdered className="w-4 h-4" />}
          label="Slot"
        >
          <span className="font-mono font-semibold text-accent">
            {formatSlot(block.slot)}
          </span>
        </DetailRow>

        <DetailRow
          icon={<Hash className="w-4 h-4" />}
          label="Block Hash"
        >
          <HashDisplay hash={block.blockHash} truncate={false} />
        </DetailRow>

        <DetailRow
          icon={<ArrowLeft className="w-4 h-4" />}
          label="Parent Hash"
        >
          <div className="flex items-center gap-2">
            <HashDisplay hash={block.parentHash} truncate />
            <Link
              to={`/block/${parentSlot}`}
              className="text-xs text-accent hover:text-accent-hover transition-colors"
            >
              (Slot {formatSlot(parentSlot)})
            </Link>
          </div>
        </DetailRow>

        <DetailRow
          icon={<Clock className="w-4 h-4" />}
          label="Timestamp"
        >
          <div className="flex items-center gap-2">
            <span>{absoluteTime}</span>
            <span className="text-slate-500">
              (<TimeAgo timestamp={block.timestamp} />)
            </span>
          </div>
        </DetailRow>

        <DetailRow
          icon={<ListOrdered className="w-4 h-4" />}
          label="Transaction Count"
        >
          <span className="font-mono font-medium">
            {block.transactionCount}
          </span>
        </DetailRow>
      </div>
    </div>
  );
}
