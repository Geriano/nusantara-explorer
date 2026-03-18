import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRightLeft } from 'lucide-react';
import clsx from 'clsx';
import { useSignatures } from '@/api/hooks';
import { formatSlot } from '@/utils/format';
import type { SignatureEntry } from '@nusantara/sdk';
import HashDisplay from '@/components/common/HashDisplay';
import DataTable, { type Column } from '@/components/common/DataTable';
import Pagination from '@/components/common/Pagination';
import LoadingSkeleton from '@/components/common/LoadingSkeleton';

interface AccountTransactionsProps {
  address: string;
}

const PAGE_SIZE = 10;

export default function AccountTransactions({ address }: AccountTransactionsProps) {
  const { data: signaturesResp, isLoading } = useSignatures(address);
  const [page, setPage] = useState(1);

  const allSigs: SignatureEntry[] = useMemo(() => {
    if (!signaturesResp) return [];
    return signaturesResp.signatures ?? [];
  }, [signaturesResp]);

  const totalPages = Math.max(1, Math.ceil(allSigs.length / PAGE_SIZE));

  const paginated = useMemo(
    () => allSigs.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE),
    [allSigs, page],
  );

  const columns: Column<SignatureEntry>[] = useMemo(
    () => [
      {
        key: 'signature',
        header: 'Signature',
        render: (row) => (
          <HashDisplay hash={row.signature} type="tx" truncate />
        ),
      },
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
        key: 'txIndex',
        header: 'Tx Index',
        render: (row) => (
          <span className="font-mono text-sm">{row.txIndex}</span>
        ),
      },
    ],
    [],
  );

  if (isLoading) {
    return <LoadingSkeleton variant="table" lines={5} />;
  }

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
          Transaction History
        </h3>
        <span className="text-xs text-slate-500 ml-auto">
          {allSigs.length} total
        </span>
      </div>
      <DataTable
        columns={columns}
        data={paginated}
        emptyMessage="No transactions found for this account"
      />
      <div className="px-5 pb-4">
        <Pagination
          page={page}
          totalPages={totalPages}
          onPageChange={setPage}
        />
      </div>
    </div>
  );
}
