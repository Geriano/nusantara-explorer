import { createContext, useContext, useState, useMemo, useCallback } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { RpcClient } from '@nusantara/sdk';
import type { NetworkConfig } from '@/types';
import { NETWORKS } from '@/utils/constants';

interface NetworkContextValue {
  network: NetworkConfig;
  setNetwork: (name: string) => void;
  rpcClient: RpcClient;
}

export const NetworkContext = createContext<NetworkContextValue>(null!);

export function useNetwork() {
  return useContext(NetworkContext);
}

export function useNetworkProvider() {
  const queryClient = useQueryClient();

  const [networkName, setNetworkName] = useState<string>(() => {
    const stored = localStorage.getItem('nusantara-explorer-network');
    return stored ?? 'local';
  });

  const network = useMemo(
    () => NETWORKS.find((n) => n.name === networkName) ?? NETWORKS[0]!,
    [networkName],
  );

  const rpcClient = useMemo(() => new RpcClient(network.rpcUrl), [network.rpcUrl]);

  const setNetwork = useCallback(
    (name: string) => {
      setNetworkName(name);
      localStorage.setItem('nusantara-explorer-network', name);
      queryClient.clear();
    },
    [queryClient],
  );

  return { network, setNetwork, rpcClient };
}
