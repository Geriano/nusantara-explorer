import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { AlertTriangle, Shield } from 'lucide-react';
import clsx from 'clsx';
import { useAccount } from '@/api/hooks';
import { getProgramName } from '@/utils/constants';
import AccountOverview from '@/components/account/AccountOverview';
import AccountTransactions from '@/components/account/AccountTransactions';
import AccountData from '@/components/account/AccountData';
import LoadingSkeleton from '@/components/common/LoadingSkeleton';

type Tab = 'overview' | 'transactions' | 'data';

const TABS: { key: Tab; label: string }[] = [
  { key: 'overview', label: 'Overview' },
  { key: 'transactions', label: 'Transactions' },
  { key: 'data', label: 'Data' },
];

export default function AccountDetail() {
  const { address } = useParams<{ address: string }>();
  const [activeTab, setActiveTab] = useState<Tab>('overview');

  const { data: account, isLoading, isError, error } = useAccount(address);

  const knownProgramName = address ? getProgramName(address) : undefined;

  if (isLoading) {
    return (
      <div className="space-y-6">
        <LoadingSkeleton variant="line" lines={1} className="w-64" />
        <LoadingSkeleton variant="card" />
        <LoadingSkeleton variant="table" lines={5} />
      </div>
    );
  }

  if (isError || !account) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <AlertTriangle className="w-12 h-12 text-red-400 mb-4" />
        <h2 className="text-xl font-semibold text-white mb-2">Account Not Found</h2>
        <p className="text-slate-400 mb-6 max-w-md">
          {error instanceof Error
            ? error.message
            : 'The account could not be found. It may not exist or has not been created yet.'}
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
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-3">
        <h1 className="text-2xl font-bold text-white">Account Details</h1>
        {knownProgramName && (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-accent/10 text-accent border border-accent/20">
            <Shield className="w-3 h-3" />
            {knownProgramName}
          </span>
        )}
        {account.executable && !knownProgramName && (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-purple-500/10 text-purple-400 border border-purple-500/20">
            <Shield className="w-3 h-3" />
            Program
          </span>
        )}
      </div>

      {/* Tab navigation */}
      <div className="border-b border-border-dark">
        <nav className="flex gap-0" aria-label="Account tabs">
          {TABS.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={clsx(
                'px-4 py-2.5 text-sm font-medium border-b-2 transition-colors -mb-px',
                activeTab === tab.key
                  ? 'border-accent text-accent'
                  : 'border-transparent text-slate-400 hover:text-slate-200 hover:border-slate-600',
              )}
            >
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      {/* Tab content */}
      {activeTab === 'overview' && <AccountOverview account={account} />}
      {activeTab === 'transactions' && address && (
        <AccountTransactions address={address} />
      )}
      {activeTab === 'data' && <AccountData data={`Data length: ${account.dataLen} bytes`} />}
    </div>
  );
}
