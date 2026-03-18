import NetworkStats from '@/components/dashboard/NetworkStats';
import EpochProgress from '@/components/dashboard/EpochProgress';
import RecentBlocks from '@/components/dashboard/RecentBlocks';
import RecentTransactions from '@/components/dashboard/RecentTransactions';

export default function Dashboard() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-white">Dashboard</h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left column */}
        <div className="space-y-6">
          <NetworkStats />
          <RecentBlocks />
        </div>

        {/* Right column */}
        <div className="space-y-6">
          <EpochProgress />
          <RecentTransactions />
        </div>
      </div>
    </div>
  );
}
