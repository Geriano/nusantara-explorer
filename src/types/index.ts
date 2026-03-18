export type Theme = 'dark' | 'light';

export interface NetworkConfig {
  name: string;
  label: string;
  rpcUrl: string;
  wsUrl: string;
}

export interface RecentBlock {
  slot: number;
  hash: string;
  txCount: number;
  timestamp: number;
}
