import { useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import { AlertTriangle } from 'lucide-react';
import { useEpochInfo, useLeaderSchedule } from '@/api/hooks';
import { SLOTS_PER_EPOCH } from '@/utils/constants';
import { formatSlot } from '@/utils/format';
import LoadingSkeleton from '@/components/common/LoadingSkeleton';
import HashDisplay from '@/components/common/HashDisplay';

export default function EpochDetail() {
  const { epoch: epochParam } = useParams<{ epoch: string }>();
  const epoch = epochParam !== undefined ? Number(epochParam) : undefined;
  const isValidEpoch = epoch !== undefined && !Number.isNaN(epoch) && epoch >= 0;

  const { data: epochInfo, isLoading: epochLoading } = useEpochInfo();
  const {
    data: leaderSchedule,
    isLoading: scheduleLoading,
  } = useLeaderSchedule(isValidEpoch ? epoch : undefined);

  const isCurrentEpoch = epochInfo?.epoch === epoch;

  const slotRange = useMemo(() => {
    if (!isValidEpoch) return null;
    const startSlot = epoch! * SLOTS_PER_EPOCH;
    const endSlot = startSlot + SLOTS_PER_EPOCH - 1;
    return { startSlot, endSlot };
  }, [epoch, isValidEpoch]);

  const progressPercent = useMemo(() => {
    if (!isCurrentEpoch || !epochInfo) return null;
    return ((epochInfo.slotIndex / epochInfo.slotsInEpoch) * 100).toFixed(2);
  }, [isCurrentEpoch, epochInfo]);

  const leaderSummary = useMemo(() => {
    if (!leaderSchedule?.schedule) return [];
    // Group schedule entries by leader and count slots
    const leaderMap = new Map<string, number>();
    for (const entry of leaderSchedule.schedule) {
      leaderMap.set(entry.leader, (leaderMap.get(entry.leader) ?? 0) + 1);
    }
    return Array.from(leaderMap.entries())
      .map(([validator, slotCount]) => ({ validator, slotCount }))
      .sort((a, b) => b.slotCount - a.slotCount);
  }, [leaderSchedule]);

  if (!isValidEpoch) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <AlertTriangle className="w-12 h-12 text-yellow-400 mb-4" />
        <h2 className="text-xl font-semibold text-white mb-2">Invalid Epoch</h2>
        <p className="text-slate-400 mb-6">
          The epoch &quot;{epochParam}&quot; is not a valid epoch number.
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

  if (epochLoading || scheduleLoading) {
    return (
      <div className="space-y-6">
        <LoadingSkeleton variant="line" lines={1} className="w-48" />
        <LoadingSkeleton variant="card" />
        <LoadingSkeleton variant="table" lines={8} />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-white">
        Epoch {epoch!.toLocaleString()}
        {isCurrentEpoch && (
          <span className="ml-3 text-xs font-medium px-2.5 py-1 rounded-full bg-accent/10 text-accent border border-accent/20">
            Current
          </span>
        )}
      </h1>

      {/* Epoch info card */}
      <div className="rounded-xl border border-border-dark bg-surface-dark p-6">
        <h2 className="text-lg font-semibold text-white mb-4">Epoch Information</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <div>
            <dt className="text-sm text-slate-400 mb-1">Epoch Number</dt>
            <dd className="text-lg font-semibold text-white">{epoch!.toLocaleString()}</dd>
          </div>
          {slotRange && (
            <>
              <div>
                <dt className="text-sm text-slate-400 mb-1">Slot Range</dt>
                <dd className="text-lg font-semibold text-white">
                  {formatSlot(slotRange.startSlot)} - {formatSlot(slotRange.endSlot)}
                </dd>
              </div>
              <div>
                <dt className="text-sm text-slate-400 mb-1">Slots in Epoch</dt>
                <dd className="text-lg font-semibold text-white">
                  {SLOTS_PER_EPOCH.toLocaleString()}
                </dd>
              </div>
            </>
          )}
          {epochInfo && isCurrentEpoch && (
            <>
              <div>
                <dt className="text-sm text-slate-400 mb-1">Slot Index</dt>
                <dd className="text-lg font-semibold text-white">
                  {formatSlot(epochInfo.slotIndex)} / {formatSlot(epochInfo.slotsInEpoch)}
                </dd>
              </div>
              <div>
                <dt className="text-sm text-slate-400 mb-1">Absolute Slot</dt>
                <dd className="text-lg font-semibold text-white">
                  {formatSlot(epochInfo.absoluteSlot)}
                </dd>
              </div>
            </>
          )}
        </div>

        {/* Progress bar for current epoch */}
        {progressPercent !== null && (
          <div className="mt-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-slate-400">Epoch Progress</span>
              <span className="text-sm font-medium text-accent">{progressPercent}%</span>
            </div>
            <div className="w-full h-3 rounded-full bg-bg-dark overflow-hidden">
              <div
                className="h-full rounded-full bg-gradient-to-r from-accent/80 to-accent transition-all duration-500"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>
        )}
      </div>

      {/* Leader schedule table */}
      <div className="rounded-xl border border-border-dark bg-surface-dark">
        <div className="px-6 py-4 border-b border-border-dark">
          <h2 className="text-lg font-semibold text-white">
            Leader Schedule ({leaderSummary.length} validators)
          </h2>
        </div>

        {leaderSummary.length === 0 ? (
          <div className="px-6 py-12 text-center text-slate-400">
            No leader schedule available for this epoch.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border-dark">
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">
                    #
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">
                    Validator
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-slate-400 uppercase tracking-wider">
                    Assigned Slots
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-slate-400 uppercase tracking-wider">
                    Share
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border-dark/50">
                {leaderSummary.map((entry, index) => {
                  const totalSlots = leaderSummary.reduce(
                    (sum, e) => sum + e.slotCount,
                    0,
                  );
                  const sharePercent =
                    totalSlots > 0
                      ? ((entry.slotCount / totalSlots) * 100).toFixed(2)
                      : '0.00';

                  return (
                    <tr
                      key={entry.validator}
                      className="hover:bg-white/[0.02] transition-colors"
                    >
                      <td className="px-6 py-3 text-slate-500">{index + 1}</td>
                      <td className="px-6 py-3">
                        <HashDisplay
                          hash={entry.validator}
                          type="account"
                          truncate
                        />
                      </td>
                      <td className="px-6 py-3 text-right text-white font-mono">
                        {entry.slotCount.toLocaleString()}
                      </td>
                      <td className="px-6 py-3 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <div className="w-16 h-1.5 rounded-full bg-bg-dark overflow-hidden">
                            <div
                              className="h-full rounded-full bg-accent"
                              style={{ width: `${sharePercent}%` }}
                            />
                          </div>
                          <span className="text-slate-400 font-mono text-xs w-14 text-right">
                            {sharePercent}%
                          </span>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

