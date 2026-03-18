import { useQuery, useMutation, useQueries, useQueryClient } from '@tanstack/react-query';
import { useNetwork } from '@/hooks/useNetwork';
import { REFRESH_INTERVALS } from '@/utils/constants';
import type {
  HealthResponse,
  SlotResponse,
  EpochInfoResponse,
  ValidatorsResponse,
  BlockResponse,
  BlockTransactionsResponse,
  TransactionStatusResponse,
  AccountResponse,
  SignaturesResponse,
  StakeAccountResponse,
  VoteAccountResponse,
  ProgramResponse,
  LeaderScheduleResponse,
  AccountsByResponse,
  BlockhashResponse,
  AirdropResponse,
} from '@nusantara/sdk';

// Query key factory
const keys = {
  health: ['health'] as const,
  slot: ['slot'] as const,
  epochInfo: ['epochInfo'] as const,
  validators: ['validators'] as const,
  block: (slot: number) => ['block', slot] as const,
  blockTransactions: (slot: number) => ['blockTransactions', slot] as const,
  transaction: (hash: string) => ['transaction', hash] as const,
  account: (address: string) => ['account', address] as const,
  signatures: (address: string) => ['signatures', address] as const,
  stakeAccount: (address: string) => ['stakeAccount', address] as const,
  voteAccount: (address: string) => ['voteAccount', address] as const,
  program: (address: string) => ['program', address] as const,
  leaderSchedule: (epoch?: number) => ['leaderSchedule', epoch] as const,
  accountsByOwner: (owner: string) => ['accountsByOwner', owner] as const,
  accountsByProgram: (program: string) => ['accountsByProgram', program] as const,
  blockhash: ['blockhash'] as const,
};

export function useHealth() {
  const { rpcClient } = useNetwork();
  return useQuery<HealthResponse>({
    queryKey: keys.health,
    queryFn: () => rpcClient.getHealth(),
    refetchInterval: REFRESH_INTERVALS.health,
    staleTime: 5_000,
  });
}

export function useSlot() {
  const { rpcClient } = useNetwork();
  return useQuery<SlotResponse>({
    queryKey: keys.slot,
    queryFn: () => rpcClient.getSlot(),
    refetchInterval: REFRESH_INTERVALS.slot,
    staleTime: 500,
  });
}

export function useEpochInfo() {
  const { rpcClient } = useNetwork();
  return useQuery<EpochInfoResponse>({
    queryKey: keys.epochInfo,
    queryFn: () => rpcClient.getEpochInfo(),
    refetchInterval: REFRESH_INTERVALS.epochInfo,
    staleTime: 3_000,
  });
}

export function useValidators() {
  const { rpcClient } = useNetwork();
  return useQuery<ValidatorsResponse>({
    queryKey: keys.validators,
    queryFn: () => rpcClient.getValidators(),
    refetchInterval: REFRESH_INTERVALS.validators,
    staleTime: 15_000,
  });
}

export function useBlock(slot: number | undefined) {
  const { rpcClient } = useNetwork();
  return useQuery<BlockResponse>({
    queryKey: keys.block(slot!),
    queryFn: () => rpcClient.getBlock(slot!),
    enabled: slot !== undefined,
    staleTime: Infinity,
  });
}

export function useBlockTransactions(slot: number | undefined) {
  const { rpcClient } = useNetwork();
  return useQuery<BlockTransactionsResponse>({
    queryKey: keys.blockTransactions(slot!),
    queryFn: () => rpcClient.getBlockTransactions(slot!),
    enabled: slot !== undefined,
    staleTime: Infinity,
  });
}

export function useTransaction(hash: string | undefined) {
  const { rpcClient } = useNetwork();
  return useQuery<TransactionStatusResponse>({
    queryKey: keys.transaction(hash!),
    queryFn: () => rpcClient.getTransactionStatus(hash!),
    enabled: !!hash,
    staleTime: 30_000,
  });
}

export function useAccount(address: string | undefined) {
  const { rpcClient } = useNetwork();
  return useQuery<AccountResponse>({
    queryKey: keys.account(address!),
    queryFn: () => rpcClient.getAccount(address!),
    enabled: !!address,
    refetchInterval: REFRESH_INTERVALS.account,
    staleTime: 3_000,
  });
}

export function useSignatures(address: string | undefined) {
  const { rpcClient } = useNetwork();
  return useQuery<SignaturesResponse>({
    queryKey: keys.signatures(address!),
    queryFn: () => rpcClient.getSignatures(address!),
    enabled: !!address,
    refetchInterval: REFRESH_INTERVALS.signatures,
    staleTime: 5_000,
  });
}

export function useStakeAccount(address: string | undefined) {
  const { rpcClient } = useNetwork();
  return useQuery<StakeAccountResponse>({
    queryKey: keys.stakeAccount(address!),
    queryFn: () => rpcClient.getStakeAccount(address!),
    enabled: !!address,
  });
}

export function useVoteAccount(address: string | undefined) {
  const { rpcClient } = useNetwork();
  return useQuery<VoteAccountResponse>({
    queryKey: keys.voteAccount(address!),
    queryFn: () => rpcClient.getVoteAccount(address!),
    enabled: !!address,
  });
}

export function useProgram(address: string | undefined) {
  const { rpcClient } = useNetwork();
  return useQuery<ProgramResponse>({
    queryKey: keys.program(address!),
    queryFn: () => rpcClient.getProgram(address!),
    enabled: !!address,
  });
}

export function useLeaderSchedule(epoch?: number) {
  const { rpcClient } = useNetwork();
  return useQuery<LeaderScheduleResponse>({
    queryKey: keys.leaderSchedule(epoch),
    queryFn: () =>
      epoch !== undefined
        ? rpcClient.getLeaderScheduleByEpoch(epoch)
        : rpcClient.getLeaderSchedule(),
  });
}

export function useAccountsByOwner(owner: string | undefined) {
  const { rpcClient } = useNetwork();
  return useQuery<AccountsByResponse>({
    queryKey: keys.accountsByOwner(owner!),
    queryFn: () => rpcClient.getAccountsByOwner(owner!),
    enabled: !!owner,
  });
}

export function useAccountsByProgram(program: string | undefined) {
  const { rpcClient } = useNetwork();
  return useQuery<AccountsByResponse>({
    queryKey: keys.accountsByProgram(program!),
    queryFn: () => rpcClient.getAccountsByProgram(program!),
    enabled: !!program,
  });
}

export function useRecentBlocks(count = 10) {
  const { rpcClient } = useNetwork();
  const slotQuery = useSlot();
  const currentSlot = slotQuery.data?.slot;

  const slots = currentSlot
    ? Array.from({ length: count }, (_, i) => currentSlot - i)
    : [];

  const queries = useQueries({
    queries: slots.map((slot) => ({
      queryKey: keys.block(slot),
      queryFn: () => rpcClient.getBlock(slot),
      staleTime: Infinity,
      retry: 1,
    })),
  });

  const blocks = queries
    .map((q) => q.data)
    .filter((b): b is BlockResponse => b !== undefined);

  const isLoading = slotQuery.isLoading || queries.some((q) => q.isLoading);

  return { blocks, isLoading, currentSlot };
}

export function useBlockhash() {
  const { rpcClient } = useNetwork();
  return useQuery<BlockhashResponse>({
    queryKey: keys.blockhash,
    queryFn: () => rpcClient.getRecentBlockhash(),
    staleTime: 2_000,
  });
}

export function useAirdrop() {
  const { rpcClient } = useNetwork();
  const queryClient = useQueryClient();

  return useMutation<AirdropResponse, Error, { address: string; lamports: bigint }>({
    mutationFn: ({ address, lamports }) =>
      rpcClient.requestAirdrop(address, lamports),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: keys.account(variables.address) });
    },
  });
}

export { keys as queryKeys };
