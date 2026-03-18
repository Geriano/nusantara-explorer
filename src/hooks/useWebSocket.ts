import { useState, useEffect, useRef, useCallback } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { WsClient } from '@nusantara/sdk';
import type { PubsubEvent } from '@nusantara/sdk';
import { useNetwork } from './useNetwork';
import { queryKeys } from '@/api/hooks';
import type { RecentBlock } from '@/types';

const MAX_RECENT_BLOCKS = 20;

export function useWebSocket() {
  const { network, rpcClient } = useNetwork();
  const queryClient = useQueryClient();
  const wsRef = useRef<WsClient | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [latestSlot, setLatestSlot] = useState<number | null>(null);
  const [recentBlockNotifications, setRecentBlockNotifications] = useState<RecentBlock[]>([]);

  const handleEvent = useCallback(
    (event: PubsubEvent) => {
      switch (event.type) {
        case 'SlotUpdate':
          setLatestSlot(event.slot);
          queryClient.setQueryData(queryKeys.slot, { slot: event.slot });
          break;

        case 'BlockNotification': {
          const block: RecentBlock = {
            slot: event.slot,
            hash: event.blockHash,
            txCount: event.txCount,
            timestamp: Math.floor(Date.now() / 1000),
          };
          setRecentBlockNotifications((prev) => {
            const next = [block, ...prev];
            return next.slice(0, MAX_RECENT_BLOCKS);
          });
          // Prefetch full block data
          queryClient.prefetchQuery({
            queryKey: queryKeys.block(event.slot),
            queryFn: () => rpcClient.getBlock(event.slot),
            staleTime: Infinity,
          });
          break;
        }

        case 'SignatureNotification':
          queryClient.invalidateQueries({
            queryKey: queryKeys.transaction(event.signature),
          });
          break;
      }
    },
    [queryClient, rpcClient],
  );

  useEffect(() => {
    let cancelled = false;
    const ws = new WsClient(network.wsUrl);
    ws.setMaxReconnectAttempts(3);
    ws.setReconnectDelay(5000);
    wsRef.current = ws;

    ws.onEvent(handleEvent);
    ws.onError(() => { if (!cancelled) setIsConnected(false); });
    ws.onClose(() => { if (!cancelled) setIsConnected(false); });

    ws.connect()
      .then(() => {
        if (cancelled) { ws.disconnect(); return; }
        setIsConnected(true);
        ws.slotSubscribe();
        ws.blockSubscribe();
      })
      .catch(() => {
        if (!cancelled) setIsConnected(false);
      });

    return () => {
      cancelled = true;
      ws.disconnect();
      wsRef.current = null;
    };
  }, [network.wsUrl, handleEvent]);

  return { latestSlot, recentBlockNotifications, isConnected };
}
