import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRightLeft } from 'lucide-react';
import { useQueries } from '@tanstack/react-query';
import clsx from 'clsx';
import { useNetwork } from '@/hooks/useNetwork';
import { lamportsToNusa, formatSlot } from '@/utils/format';
import type { TransactionStatusResponse } from '@nusantara/sdk';
import HashDisplay from '@/components/common/HashDisplay';
import StatusBadge from '@/components/common/StatusBadge';
import DataTable, { type Column } from '@/components/common/DataTable';

export default function RecentTransactions() {
  const { rpcClient } = useNetwork();

  // Fetch signatures for recent blocks by querying the signatures endpoint
  // for the validator of recent blocks (the chain no longer returns tx lists in blocks)
  const recentSignatures = useMemo(() => {
    // BlockResponse no longer contains transactions list.
    // We rely on signatures arriving via separate queries or WebSocket.
    return [] as string[];
  }, []);

  // Fetch each tx status
  const txQueries = useQueries({
    queries: recentSignatures.map((hash) => ({
      queryKey: ['transaction', hash] as const,
      queryFn: () => rpcClient.getTransactionStatus(hash),
      staleTime: 30_000,
      retry: 1,
    })),
  });

  const transactions = useMemo(
    () =>
      txQueries
        .map((q) => q.data)
        .filter((t): t is TransactionStatusResponse => t !== undefined),
    [txQueries],
  );

  const isLoading = txQueries.some((q) => q.isLoading);

  const columns: Column<TransactionStatusResponse>[] = useMemo(
    () => [
      {
        key: 'signature',
        header: 'Signature',
        render: (row) => (
          <HashDisplay hash={row.signature} type="tx" truncate />
        ),
      },
      {
        key: 'status',
        header: 'Status',
        render: (row) => (
          <StatusBadge status={row.status} />
        ),
      },
      {
        key: 'slot',
        header: 'Block',
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
        key: 'fee',
        header: 'Fee',
        render: (row) => (
          <span className="font-mono text-sm">
            {lamportsToNusa(row.fee)}{' '}
            <span className="text-slate-500">NUSA</span>
          </span>
        ),
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
        <ArrowRightLeft className="w-4 h-4 text-accent" />
        <h3 className="text-sm font-semibold text-slate-300 dark:text-slate-300 text-slate-700">
          Recent Transactions
        </h3>
      </div>
      <div className="max-h-[400px] overflow-y-auto">
        <DataTable
          columns={columns}
          data={transactions}
          loading={isLoading}
          emptyMessage="No transactions yet"
        />
      </div>
    </div>
  );
}
