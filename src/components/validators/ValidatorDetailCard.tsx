import { useMemo } from 'react';
import { Shield, User, Vote, Hash, Layers } from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import clsx from 'clsx';
import type { VoteAccountResponse } from '@nusantara/sdk';
import { formatSlot } from '@/utils/format';
import HashDisplay from '@/components/common/HashDisplay';

interface ValidatorDetailCardProps {
  voteAccount: VoteAccountResponse;
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

interface ChartDataPoint {
  epoch: number;
  credits: number;
}

export default function ValidatorDetailCard({ voteAccount }: ValidatorDetailCardProps) {
  const chartData: ChartDataPoint[] = useMemo(() => {
    if (!voteAccount.epochCredits || voteAccount.epochCredits.length === 0) {
      return [];
    }

    return voteAccount.epochCredits.map((entry) => ({
      epoch: entry.epoch,
      credits: entry.credits - entry.prevCredits,
    }));
  }, [voteAccount.epochCredits]);

  return (
    <div
      className={clsx(
        'rounded-xl border p-5',
        'border-border-dark dark:border-border-dark border-slate-200',
        'bg-surface-dark dark:bg-surface-dark bg-white',
      )}
    >
      <div className="flex items-center gap-2 mb-5">
        <Shield className="w-5 h-5 text-accent" />
        <h2 className="text-lg font-semibold text-white dark:text-white text-slate-900">
          Vote Account Details
        </h2>
      </div>

      <div className="mb-6">
        <DetailRow
          icon={<User className="w-4 h-4" />}
          label="Node Pubkey"
        >
          <HashDisplay hash={voteAccount.nodePubkey} type="account" truncate />
        </DetailRow>

        <DetailRow
          icon={<Vote className="w-4 h-4" />}
          label="Authorized Voter"
        >
          <HashDisplay hash={voteAccount.authorizedVoter} type="account" truncate />
        </DetailRow>

        <DetailRow
          icon={<Shield className="w-4 h-4" />}
          label="Commission"
        >
          <span className="font-mono font-medium">
            {voteAccount.commission}%
          </span>
        </DetailRow>

        <DetailRow
          icon={<Layers className="w-4 h-4" />}
          label="Last Vote"
        >
          <span className="font-mono">{formatSlot(voteAccount.lastVoteSlot ?? 0)}</span>
        </DetailRow>

        <DetailRow
          icon={<Hash className="w-4 h-4" />}
          label="Root Slot"
        >
          <span className="font-mono">{formatSlot(voteAccount.rootSlot)}</span>
        </DetailRow>
      </div>

      {/* Epoch Credits Chart */}
      {chartData.length > 0 && (
        <div>
          <h3 className="text-sm font-semibold text-slate-300 dark:text-slate-300 text-slate-700 mb-3">
            Epoch Credits
          </h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} margin={{ top: 5, right: 5, bottom: 5, left: 10 }}>
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="#1E293B"
                  vertical={false}
                />
                <XAxis
                  dataKey="epoch"
                  tick={{ fill: '#64748B', fontSize: 11 }}
                  axisLine={{ stroke: '#1E293B' }}
                  tickLine={{ stroke: '#1E293B' }}
                  label={{
                    value: 'Epoch',
                    position: 'insideBottom',
                    offset: -2,
                    fill: '#64748B',
                    fontSize: 11,
                  }}
                />
                <YAxis
                  tick={{ fill: '#64748B', fontSize: 11 }}
                  axisLine={{ stroke: '#1E293B' }}
                  tickLine={{ stroke: '#1E293B' }}
                  label={{
                    value: 'Credits Earned',
                    angle: -90,
                    position: 'insideLeft',
                    fill: '#64748B',
                    fontSize: 11,
                  }}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#131A2E',
                    border: '1px solid #1E293B',
                    borderRadius: '8px',
                    color: '#E2E8F0',
                    fontSize: '12px',
                  }}
                  formatter={(value: number) => [
                    value.toLocaleString(),
                    'Credits Earned',
                  ]}
                  labelFormatter={(epoch) => `Epoch ${epoch}`}
                />
                <Bar
                  dataKey="credits"
                  fill="#14F195"
                  radius={[4, 4, 0, 0]}
                  maxBarSize={40}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {chartData.length === 0 && (
        <div className="text-center py-8 text-slate-500 text-sm">
          No epoch credits data available
        </div>
      )}
    </div>
  );
}
