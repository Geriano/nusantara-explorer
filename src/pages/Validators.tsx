import clsx from 'clsx';
import { useValidators } from '@/api/hooks';
import ValidatorTable from '@/components/validators/ValidatorTable';
import LoadingSkeleton from '@/components/common/LoadingSkeleton';

export default function Validators() {
  const { data: validators, isLoading } = useValidators();

  const validatorCount = validators?.validators.length ?? 0;

  if (isLoading) {
    return (
      <div className="space-y-6">
        <LoadingSkeleton variant="line" lines={1} className="w-48" />
        <LoadingSkeleton variant="table" lines={8} />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-white">Validators</h1>

      <div className="border-b border-border-dark">
        <nav className="flex gap-0" aria-label="Validator tabs">
          <button
            className={clsx(
              'px-4 py-2.5 text-sm font-medium border-b-2 transition-colors -mb-px',
              'border-accent text-accent',
            )}
          >
            Validators
            <span className="ml-2 inline-flex items-center justify-center px-2 py-0.5 rounded-full text-xs bg-emerald-500/15 text-emerald-400">
              {validatorCount}
            </span>
          </button>
        </nav>
      </div>

      {validators && (
        <ValidatorTable validators={validators.validators} type="active" />
      )}

      {validators && validators.validators.length === 0 && (
        <div className="text-center py-12 text-slate-400">
          No validators found.
        </div>
      )}
    </div>
  );
}
