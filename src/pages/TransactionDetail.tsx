import { useParams, Link } from 'react-router-dom';
import { AlertTriangle } from 'lucide-react';
import { useTransaction } from '@/api/hooks';
import TransactionOverview from '@/components/transaction/TransactionOverview';
import LoadingSkeleton from '@/components/common/LoadingSkeleton';

export default function TransactionDetail() {
  const { hash } = useParams<{ hash: string }>();

  const { data: tx, isLoading, isError, error } = useTransaction(hash);

  if (isLoading) {
    return (
      <div className="space-y-6">
        <LoadingSkeleton variant="line" lines={1} className="w-64" />
        <LoadingSkeleton variant="card" />
      </div>
    );
  }

  if (isError || !tx) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <AlertTriangle className="w-12 h-12 text-red-400 mb-4" />
        <h2 className="text-xl font-semibold text-white mb-2">Transaction Not Found</h2>
        <p className="text-slate-400 mb-6 max-w-md">
          {error instanceof Error
            ? error.message
            : 'The transaction could not be found. It may not exist or has not been processed yet.'}
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
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-white">Transaction Details</h1>
        <Link
          to={`/block/${tx.slot}`}
          className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-sm font-medium
            bg-surface-dark border border-border-dark text-slate-300
            hover:text-accent hover:border-accent/30 transition-colors"
        >
          View Block #{tx.slot.toLocaleString()}
        </Link>
      </div>

      <TransactionOverview tx={tx} />
    </div>
  );
}
