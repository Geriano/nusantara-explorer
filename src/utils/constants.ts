import type { NetworkConfig } from '@/types';

export const SLOT_DURATION_MS = 400;
export const SLOTS_PER_EPOCH = 432_000;
export const LAMPORTS_PER_NUSA = 1_000_000_000;

export const KNOWN_PROGRAMS: Record<string, string> = {
  // These will be populated with actual Base64-encoded program IDs at runtime.
  // We use friendly names as fallback lookup by matching SDK constants.
  system_program: 'System Program',
  rent_program: 'Rent Program',
  stake_program: 'Stake Program',
  vote_program: 'Vote Program',
  compute_budget_program: 'Compute Budget Program',
  sysvar_program: 'Sysvar Program',
  loader_program: 'Loader Program',
  token_program: 'Token Program',
};

// Will be populated on app init with Base64-encoded addresses
let programIdMap: Record<string, string> | null = null;

export function initProgramIdMap(map: Record<string, string>) {
  programIdMap = map;
}

export function getProgramName(address: string): string | undefined {
  return programIdMap?.[address];
}

export const REFRESH_INTERVALS = {
  health: 10_000,
  slot: 1_000,
  epochInfo: 5_000,
  validators: 30_000,
  account: 5_000,
  signatures: 10_000,
} as const;

export const NETWORKS: NetworkConfig[] = [
  {
    name: 'local',
    label: 'Localhost',
    rpcUrl: '',
    wsUrl: 'ws://localhost:8080/v1/ws',
  },
  {
    name: 'devnet',
    label: 'Devnet',
    rpcUrl: 'https://devnet.nusantara.network/v1',
    wsUrl: 'wss://devnet.nusantara.network/v1/ws',
  },
  {
    name: 'testnet',
    label: 'Testnet',
    rpcUrl: 'https://testnet.nusantara.network/v1',
    wsUrl: 'wss://testnet.nusantara.network/v1/ws',
  },
  {
    name: 'mainnet',
    label: 'Mainnet',
    rpcUrl: 'https://rpc.nusantara.network/v1',
    wsUrl: 'wss://rpc.nusantara.network/v1/ws',
  },
];
