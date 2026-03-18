import { useState, useCallback, type FormEvent } from 'react';
import { AlertTriangle, Droplets, Loader2 } from 'lucide-react';
import clsx from 'clsx';
import { useAirdrop } from '@/api/hooks';
import { useNetwork } from '@/hooks/useNetwork';
import { LAMPORTS_PER_NUSA } from '@/utils/constants';
import HashDisplay from '@/components/common/HashDisplay';

const QUICK_AMOUNTS = [1, 2, 5, 10] as const;

export default function Faucet() {
  const { network } = useNetwork();
  const airdrop = useAirdrop();

  const [address, setAddress] = useState('');
  const [selectedAmount, setSelectedAmount] = useState<number>(1);

  const isMainnet = network.name === 'mainnet';

  const handleSubmit = useCallback(
    (e: FormEvent) => {
      e.preventDefault();
      if (!address.trim() || isMainnet) return;

      const lamports = BigInt(selectedAmount) * BigInt(LAMPORTS_PER_NUSA);
      airdrop.mutate({ address: address.trim(), lamports });
    },
    [address, selectedAmount, airdrop, isMainnet],
  );

  return (
    <div className="max-w-xl mx-auto space-y-6">
      <div className="flex items-center gap-3">
        <Droplets className="w-8 h-8 text-accent" />
        <h1 className="text-2xl font-bold text-white">Faucet</h1>
      </div>

      <p className="text-slate-400">
        Request NUSA tokens for development and testing purposes.
      </p>

      {/* Mainnet warning */}
      {isMainnet && (
        <div className="flex items-start gap-3 p-4 rounded-xl border border-yellow-500/30 bg-yellow-500/5">
          <AlertTriangle className="w-5 h-5 text-yellow-400 shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-medium text-yellow-400">
              Faucet Unavailable on Mainnet
            </p>
            <p className="text-sm text-yellow-400/70 mt-1">
              The faucet is only available on devnet, testnet, and local networks.
              Please switch to a non-mainnet network to request tokens.
            </p>
          </div>
        </div>
      )}

      {/* Faucet form */}
      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="rounded-xl border border-border-dark bg-surface-dark p-6 space-y-5">
          {/* Address input */}
          <div>
            <label
              htmlFor="faucet-address"
              className="block text-sm font-medium text-slate-300 mb-2"
            >
              Recipient Address
            </label>
            <input
              id="faucet-address"
              type="text"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="Enter wallet address..."
              className={clsx(
                'w-full px-4 py-2.5 rounded-lg font-mono text-sm',
                'bg-bg-dark border border-border-dark text-white placeholder-slate-500',
                'focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent/50',
                'transition-colors',
              )}
              disabled={isMainnet}
            />
          </div>

          {/* Amount selection */}
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Amount (NUSA)
            </label>
            <div className="grid grid-cols-4 gap-2">
              {QUICK_AMOUNTS.map((amount) => (
                <button
                  key={amount}
                  type="button"
                  onClick={() => setSelectedAmount(amount)}
                  disabled={isMainnet}
                  className={clsx(
                    'px-4 py-2.5 rounded-lg text-sm font-medium border transition-colors',
                    selectedAmount === amount
                      ? 'bg-accent/10 border-accent/30 text-accent'
                      : 'bg-bg-dark border-border-dark text-slate-400 hover:text-white hover:border-slate-500',
                    isMainnet && 'opacity-50 cursor-not-allowed',
                  )}
                >
                  {amount} NUSA
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Submit button */}
        <button
          type="submit"
          disabled={isMainnet || !address.trim() || airdrop.isPending}
          className={clsx(
            'w-full flex items-center justify-center gap-2 px-6 py-3 rounded-xl text-sm font-semibold transition-colors',
            'bg-accent text-bg-dark hover:bg-accent-hover',
            'disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-accent',
          )}
        >
          {airdrop.isPending ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Requesting Airdrop...
            </>
          ) : (
            <>
              <Droplets className="w-4 h-4" />
              Request {selectedAmount} NUSA
            </>
          )}
        </button>
      </form>

      {/* Success state */}
      {airdrop.isSuccess && airdrop.data && (
        <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/5 p-5">
          <p className="text-sm font-medium text-emerald-400 mb-3">
            Airdrop Successful!
          </p>
          <div>
            <span className="text-xs text-slate-400 block mb-1">Transaction Signature</span>
            <HashDisplay hash={airdrop.data.signature} type="tx" truncate={false} />
          </div>
        </div>
      )}

      {/* Error state */}
      {airdrop.isError && (
        <div className="rounded-xl border border-red-500/30 bg-red-500/5 p-5">
          <p className="text-sm font-medium text-red-400 mb-1">Airdrop Failed</p>
          <p className="text-sm text-red-400/70">
            {airdrop.error instanceof Error
              ? airdrop.error.message
              : 'An unexpected error occurred. Please try again.'}
          </p>
        </div>
      )}
    </div>
  );
}
