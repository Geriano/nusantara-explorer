import { useEffect, lazy, Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';
import { ThemeContext } from '@/hooks/useTheme';
import { NetworkContext } from '@/hooks/useNetwork';
import { useThemeProvider } from '@/hooks/useTheme';
import { useNetworkProvider } from '@/hooks/useNetwork';
import { initProgramIdMap } from '@/utils/constants';
import Layout from '@/components/layout/Layout';
import LoadingSkeleton from '@/components/common/LoadingSkeleton';
import {
  SYSTEM_PROGRAM_ID,
  RENT_PROGRAM_ID,
  STAKE_PROGRAM_ID,
  VOTE_PROGRAM_ID,
  COMPUTE_BUDGET_PROGRAM_ID,
  SYSVAR_PROGRAM_ID,
  LOADER_PROGRAM_ID,
  TOKEN_PROGRAM_ID,
} from '@nusantara/sdk';

// Lazy-load page components for code splitting
const Dashboard = lazy(() => import('@/pages/Dashboard'));
const BlockDetail = lazy(() => import('@/pages/BlockDetail'));
const TransactionDetail = lazy(() => import('@/pages/TransactionDetail'));
const AccountDetail = lazy(() => import('@/pages/AccountDetail'));
const Validators = lazy(() => import('@/pages/Validators'));
const ValidatorDetail = lazy(() => import('@/pages/ValidatorDetail'));
const EpochDetail = lazy(() => import('@/pages/EpochDetail'));
const Faucet = lazy(() => import('@/pages/Faucet'));
const NotFound = lazy(() => import('@/pages/NotFound'));

function PageFallback() {
  return (
    <div className="p-6">
      <LoadingSkeleton variant="card" />
    </div>
  );
}

export default function App() {
  const themeValue = useThemeProvider();
  const networkValue = useNetworkProvider();

  // Initialize known program ID map on mount
  useEffect(() => {
    initProgramIdMap({
      [SYSTEM_PROGRAM_ID.toBase64()]: 'System Program',
      [RENT_PROGRAM_ID.toBase64()]: 'Rent Program',
      [STAKE_PROGRAM_ID.toBase64()]: 'Stake Program',
      [VOTE_PROGRAM_ID.toBase64()]: 'Vote Program',
      [COMPUTE_BUDGET_PROGRAM_ID.toBase64()]: 'Compute Budget Program',
      [SYSVAR_PROGRAM_ID.toBase64()]: 'Sysvar Program',
      [LOADER_PROGRAM_ID.toBase64()]: 'Loader Program',
      [TOKEN_PROGRAM_ID.toBase64()]: 'Token Program',
    });
  }, []);

  return (
    <ThemeContext.Provider value={themeValue}>
      <NetworkContext.Provider value={networkValue}>
        <Suspense fallback={<PageFallback />}>
          <Routes>
            <Route path="/" element={<Layout />}>
              <Route index element={<Dashboard />} />
              <Route path="block/:slot" element={<BlockDetail />} />
              <Route path="tx/:hash" element={<TransactionDetail />} />
              <Route path="account/:address" element={<AccountDetail />} />
              <Route path="validators" element={<Validators />} />
              <Route path="validator/:address" element={<ValidatorDetail />} />
              <Route path="epoch/:epoch" element={<EpochDetail />} />
              <Route path="faucet" element={<Faucet />} />
              <Route path="*" element={<NotFound />} />
            </Route>
          </Routes>
        </Suspense>
      </NetworkContext.Provider>
    </ThemeContext.Provider>
  );
}
