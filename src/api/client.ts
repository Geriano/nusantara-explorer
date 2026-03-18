import { RpcClient, WsClient } from '@nusantara/sdk';

export function createRpcClient(url: string): RpcClient {
  return new RpcClient(url);
}

export function createWsClient(url: string): WsClient {
  return new WsClient(url);
}
