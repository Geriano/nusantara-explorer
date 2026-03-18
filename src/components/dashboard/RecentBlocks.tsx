import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Box } from 'lucide-react';
import clsx from 'clsx';
import { useRecentBlocks } from '@/api/hooks';
import { formatSlot } from '@/utils/format';
import type { BlockResponse } from '@nusantara/sdk';
import HashDisplay from '@/components/common/HashDisplay';
import TimeAgo from '@/components/common/TimeAgo';
import DataTable, { type Column } from '@/components/common/DataTable';

export default function RecentBlocks() {
  const { blocks, isLoading } = useRecentBlocks(10);

  const sorted = useMemo(
    () => [...blocks].sort((a, b) => b.slot - a.slot),
    [blocks],
  );

  const columns: Column<BlockResponse>[] = useMemo(
    () => [
      {
        key: 'slot',
        header: 'Slot',
        render: (row) => (
          <Link
            to={`/block/${row.slot}`}
            className="text-accent hover:text-accent-hover font-mono text-sm transition-colors"
          >
            {formatSlot(row.slot)}
          </Link>
        ),
      },
      {
        key: 'blockHash',
        header: 'Block Hash',
        render: (row) => (
          <HashDisplay hash={row.blockHash} truncate />
        ),
      },
      {
        key: 'transactionCount',
        header: 'Transactions',
        sortable: true,
        render: (row) => (
          <span className="font-mono">{row.transactionCount}</span>
        ),
      },
      {
        key: 'timestamp',
        header: 'Time',
        render: (row) => <TimeAgo timestamp={row.timestamp} />,
      },
    ],
    [],
  );

  return (
    <div
      className={clsx(
        'rounded-xl border',
        'border-border-dark dark:border-border-dark border-slate-200',
        'bg-surface-dark dark:bg-surface-dark bg-white',
      )}
    >
      <div className="flex items-center gap-2 px-5 pt-5 pb-3">
        <Box className="w-4 h-4 text-accent" />
        <h3 className="text-sm font-semibold text-slate-300 dark:text-slate-300 text-slate-700">
          Recent Blocks
        </h3>
      </div>
      <div className="max-h-[400px] overflow-y-auto">
        <DataTable
          columns={columns}
          data={sorted}
          loading={isLoading}
          emptyMessage="No blocks yet"
        />
      </div>
    </div>
  );
}
