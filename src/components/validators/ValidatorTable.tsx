import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Shield, AlertTriangle } from 'lucide-react';
import clsx from 'clsx';
import type { ValidatorEntry } from '@nusantara/sdk';
import { lamportsToNusa, formatSlot } from '@/utils/format';
import HashDisplay from '@/components/common/HashDisplay';
import StatusBadge from '@/components/common/StatusBadge';
import DataTable, { type Column } from '@/components/common/DataTable';

interface ValidatorTableProps {
  validators: ValidatorEntry[];
  type: 'active' | 'delinquent';
}

export default function ValidatorTable({ validators, type }: ValidatorTableProps) {
  const navigate = useNavigate();

  const columns: Column<ValidatorEntry>[] = useMemo(
    () => [
      {
        key: 'identity',
        header: 'Identity',
        render: (row) => (
          <HashDisplay hash={row.identity} type="account" truncate />
        ),
      },
      {
        key: 'commission',
        header: 'Commission',
        sortable: true,
        render: (row) => (
          <span className="font-mono">{row.commission}%</span>
        ),
      },
      {
        key: 'activeStake',
        header: 'Stake',
        sortable: true,
        render: (row) => (
          <span className="font-mono text-sm">
            {lamportsToNusa(row.activeStake)}{' '}
            <span className="text-slate-500">NUSA</span>
          </span>
        ),
      },
      {
        key: 'lastVote',
        header: 'Last Vote',
        sortable: true,
        render: (row) => (
          <span className="font-mono text-sm">{formatSlot(row.lastVote ?? 0)}</span>
        ),
      },
      {
        key: 'status',
        header: 'Status',
        render: () => (
          <StatusBadge status={type === 'active' ? 'Active' : 'Delinquent'} />
        ),
      },
    ],
    [type],
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
        {type === 'active' ? (
          <Shield className="w-4 h-4 text-accent" />
        ) : (
          <AlertTriangle className="w-4 h-4 text-red-400" />
        )}
        <h3 className="text-sm font-semibold text-slate-300 dark:text-slate-300 text-slate-700">
          {type === 'active' ? 'Active' : 'Delinquent'} Validators
        </h3>
        <span className="text-xs text-slate-500 ml-auto">
          {validators.length} total
        </span>
      </div>
      <DataTable
        columns={columns}
        data={validators}
        emptyMessage={`No ${type} validators`}
        onRowClick={(row) => navigate(`/account/${row.identity}`)}
      />
    </div>
  );
}
