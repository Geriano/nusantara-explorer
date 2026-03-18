import { Wallet, User, Shield, Clock } from 'lucide-react';
import clsx from 'clsx';
import type { AccountResponse } from '@nusantara/sdk';
import { lamportsToNusa, programName, formatSlot } from '@/utils/format';
import HashDisplay from '@/components/common/HashDisplay';

interface AccountOverviewProps {
  account: AccountResponse;
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

export default function AccountOverview({ account }: AccountOverviewProps) {
  const nusaStr = lamportsToNusa(account.lamports);

  // Split into integer and decimal parts for styling
  const dotIndex = nusaStr.indexOf('.');
  const intPart = dotIndex >= 0 ? nusaStr.slice(0, dotIndex) : nusaStr;
  const decPart = dotIndex >= 0 ? nusaStr.slice(dotIndex) : '';

  const ownerLabel = programName(account.owner);

  return (
    <div
      className={clsx(
        'rounded-xl border p-5',
        'border-border-dark dark:border-border-dark border-slate-200',
        'bg-surface-dark dark:bg-surface-dark bg-white',
      )}
    >
      <div className="flex items-center gap-2 mb-5">
        <Wallet className="w-5 h-5 text-accent" />
        <h2 className="text-lg font-semibold text-white dark:text-white text-slate-900">
          Account Overview
        </h2>
      </div>

      <div>
        <DetailRow
          icon={<Wallet className="w-4 h-4" />}
          label="Balance"
        >
          <div>
            <div className="flex items-baseline gap-1">
              <span className="text-2xl font-bold font-mono text-white dark:text-white text-slate-900">
                {intPart}
              </span>
              <span className="text-2xl font-bold font-mono text-slate-500 dark:text-slate-500 text-slate-400">
                {decPart}
              </span>
              <span className="text-sm text-accent font-medium ml-1">
                NUSA
              </span>
            </div>
            <p className="text-xs text-slate-500 font-mono mt-0.5">
              {account.lamports.toLocaleString('en-US')} lamports
            </p>
          </div>
        </DetailRow>

        <DetailRow
          icon={<User className="w-4 h-4" />}
          label="Owner"
        >
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-slate-400 text-xs font-medium bg-slate-700/40 dark:bg-slate-700/40 bg-slate-100 px-2 py-0.5 rounded">
              {ownerLabel}
            </span>
            <HashDisplay hash={account.owner} type="account" truncate />
          </div>
        </DetailRow>

        <DetailRow
          icon={<Shield className="w-4 h-4" />}
          label="Executable"
        >
          {account.executable ? (
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
              Yes
            </span>
          ) : (
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-500/15 text-slate-400 border border-slate-500/30">
              No
            </span>
          )}
        </DetailRow>

        <DetailRow
          icon={<Clock className="w-4 h-4" />}
          label="Rent Epoch"
        >
          <span className="font-mono">{formatSlot(account.rentEpoch)}</span>
        </DetailRow>
      </div>
    </div>
  );
}
