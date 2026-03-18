import { useMemo } from 'react';
import { Activity, Layers, Zap, Users } from 'lucide-react';
import { useSlot, useEpochInfo, useValidators, useRecentBlocks } from '@/api/hooks';
import { formatSlot } from '@/utils/format';
import StatCard from '@/components/common/StatCard';

export default function NetworkStats() {
  const { data: slotData, isLoading: slotLoading } = useSlot();
  const { data: epochInfo, isLoading: epochLoading } = useEpochInfo();
  const { data: validators, isLoading: validatorsLoading } = useValidators();
  const { blocks } = useRecentBlocks(10);

  const tps = useMemo(() => {
    if (blocks.length < 2) return '\u2014';

    const sorted = [...blocks].sort((a, b) => a.slot - b.slot);
    const first = sorted[0]!;
    const last = sorted[sorted.length - 1]!;

    const timeDiffMs = (last.timestamp - first.timestamp) * 1000;
    if (timeDiffMs <= 0) return '\u2014';

    const totalTx = sorted.reduce((sum, b) => sum + b.transactionCount, 0);
    const tpsVal = totalTx / (timeDiffMs / 1000);
    return tpsVal.toFixed(1);
  }, [blocks]);

  const activeValidatorCount = useMemo(() => {
    if (!validators) return 0;
    return validators.validators?.length ?? 0;
  }, [validators]);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <StatCard
        label="Current Slot"
        value={slotData ? formatSlot(slotData.slot) : '\u2014'}
        icon={<Activity className="w-5 h-5" />}
        loading={slotLoading}
      />
      <StatCard
        label="Epoch"
        value={epochInfo?.epoch ?? '\u2014'}
        icon={<Layers className="w-5 h-5" />}
        loading={epochLoading}
      />
      <StatCard
        label="TPS"
        value={tps}
        icon={<Zap className="w-5 h-5" />}
        loading={false}
      />
      <StatCard
        label="Active Validators"
        value={activeValidatorCount}
        icon={<Users className="w-5 h-5" />}
        loading={validatorsLoading}
      />
    </div>
  );
}
