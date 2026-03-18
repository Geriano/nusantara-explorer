import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, AlertTriangle } from 'lucide-react';
import { useVoteAccount } from '@/api/hooks';
import ValidatorDetailCard from '@/components/validators/ValidatorDetailCard';
import LoadingSkeleton from '@/components/common/LoadingSkeleton';

export default function ValidatorDetail() {
  const { address } = useParams<{ address: string }>();

  const { data: voteAccount, isLoading, isError, error } = useVoteAccount(address);

  if (isLoading) {
    return (
      <div className="space-y-6">
        <LoadingSkeleton variant="line" lines={1} className="w-48" />
        <LoadingSkeleton variant="card" />
      </div>
    );
  }

  if (isError || !voteAccount) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <AlertTriangle className="w-12 h-12 text-red-400 mb-4" />
        <h2 className="text-xl font-semibold text-white mb-2">Validator Not Found</h2>
        <p className="text-slate-400 mb-6 max-w-md">
          {error instanceof Error
            ? error.message
            : 'The vote account could not be found. It may not exist or is not registered as a validator.'}
        </p>
        <Link
          to="/validators"
          className="inline-flex items-center gap-1 text-accent hover:text-accent-hover transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Validators
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link
          to="/validators"
          className="inline-flex items-center gap-1 text-sm text-slate-400 hover:text-accent transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Validators
        </Link>
        <h1 className="text-2xl font-bold text-white">Validator Details</h1>
      </div>

      <ValidatorDetailCard voteAccount={voteAccount} />
    </div>
  );
}
