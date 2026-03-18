import { useParams, Link } from 'react-router-dom';
import { ChevronLeft, ChevronRight, AlertTriangle } from 'lucide-react';
import { useBlock, useBlockTransactions } from '@/api/hooks';
import BlockOverview from '@/components/block/BlockOverview';
import DataTable, { type Column } from '@/components/common/DataTable';
import HashDisplay from '@/components/common/HashDisplay';
import StatusBadge from '@/components/common/StatusBadge';
import LoadingSkeleton from '@/components/common/LoadingSkeleton';
import { lamportsToNusa } from '@/utils/format';
import type { BlockTransactionEntry } from '@nusantara/sdk';

const txColumns: Column<BlockTransactionEntry>[] = [
  {
    key: 'txIndex',
    header: '#',
    sortable: true,
    render: (row) => <span className="text-slate-400">{row.txIndex}</span>,
    className: 'w-16',
  },
  {
    key: 'signature',
    header: 'Signature',
    render: (row) => <HashDisplay hash={row.signature} type="tx" />,
  },
  {
    key: 'status',
    header: 'Status',
    render: (row) => <StatusBadge status={row.status} />,
  },
  {
    key: 'fee',
    header: 'Fee',
    sortable: true,
    render: (row) => (
      <span className="font-mono text-xs">{lamportsToNusa(row.fee)} NUSA</span>
    ),
  },
  {
    key: 'computeUnitsConsumed',
    header: 'Compute Units',
    sortable: true,
    render: (row) => (
      <span className="font-mono text-xs">
        {row.computeUnitsConsumed.toLocaleString()}
      </span>
    ),
  },
];

export default function BlockDetail() {
  const { slot: slotParam } = useParams<{ slot: string }>();
  const slot = slotParam !== undefined ? Number(slotParam) : undefined;
  const isValidSlot = slot !== undefined && !Number.isNaN(slot) && slot >= 0;

  const { data: block, isLoading, isError, error } = useBlock(isValidSlot ? slot : undefined);
  const { data: blockTxs, isLoading: txsLoading } = useBlockTransactions(isValidSlot ? slot : undefined);

  if (!isValidSlot) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <AlertTriangle className="w-12 h-12 text-yellow-400 mb-4" />
        <h2 className="text-xl font-semibold text-white mb-2">Invalid Block Slot</h2>
        <p className="text-slate-400 mb-6">
          The slot &quot;{slotParam}&quot; is not a valid block number.
        </p>
        <Link
          to="/"
          className="text-accent hover:text-accent-hover transition-colors"
        >
          Back to Dashboard
        </Link>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <LoadingSkeleton variant="line" lines={1} className="w-48" />
          <div className="flex gap-2">
            <LoadingSkeleton variant="line" lines={1} className="w-20" />
            <LoadingSkeleton variant="line" lines={1} className="w-20" />
          </div>
        </div>
        <LoadingSkeleton variant="card" />
        <LoadingSkeleton variant="table" lines={5} />
      </div>
    );
  }

  if (isError || !block) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <AlertTriangle className="w-12 h-12 text-red-400 mb-4" />
        <h2 className="text-xl font-semibold text-white mb-2">Block Not Found</h2>
        <p className="text-slate-400 mb-6">
          {error instanceof Error
            ? error.message
            : `Block at slot ${slot?.toLocaleString()} could not be found.`}
        </p>
        <Link
          to="/"
          className="text-accent hover:text-accent-hover transition-colors"
        >
          Back to Dashboard
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Navigation header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-white">
          Block #{slot!.toLocaleString()}
        </h1>
        <div className="flex items-center gap-2">
          {slot! > 0 && (
            <Link
              to={`/block/${slot! - 1}`}
              className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-sm font-medium
                bg-surface-dark border border-border-dark text-slate-300
                hover:text-accent hover:border-accent/30 transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
              Prev
            </Link>
          )}
          <Link
            to={`/block/${slot! + 1}`}
            className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-sm font-medium
              bg-surface-dark border border-border-dark text-slate-300
              hover:text-accent hover:border-accent/30 transition-colors"
          >
            Next
            <ChevronRight className="w-4 h-4" />
          </Link>
        </div>
      </div>

      {/* Block overview card */}
      <BlockOverview block={block} />

      {/* Transaction list */}
      <div className="rounded-xl border border-border-dark bg-surface-dark">
        <div className="px-6 py-4 border-b border-border-dark">
          <h2 className="text-lg font-semibold text-white">
            Transactions ({block.transactionCount})
          </h2>
        </div>
        <div className="p-4">
          <DataTable<BlockTransactionEntry>
            columns={txColumns}
            data={blockTxs?.transactions ?? []}
            loading={txsLoading}
            emptyMessage="No transactions in this block"
          />
        </div>
      </div>
    </div>
  );
}
