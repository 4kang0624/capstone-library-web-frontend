export interface EthereumRequestArguments {
  method: string;
  params?: unknown[] | Record<string, unknown>;
}

export interface EthereumProvider {
  request<T = unknown>(args: EthereumRequestArguments): Promise<T>;
  on?: (eventName: string, listener: (...args: unknown[]) => void) => void;
  removeListener?: (eventName: string, listener: (...args: unknown[]) => void) => void;
}

declare global {
  interface Window {
    ethereum?: EthereumProvider;
  }
}

interface ProviderRpcError {
  code?: number;
  message?: string;
}

export function getEthereum(): EthereumProvider | null {
  if (typeof window === 'undefined') return null;
  return window.ethereum ?? null;
}

export function requireEthereum(): EthereumProvider {
  const ethereum = getEthereum();
  if (!ethereum) {
    throw new Error('MetaMask가 설치되어 있지 않습니다.');
  }
  return ethereum;
}

export function getWalletErrorMessage(error: unknown): string {
  if (typeof error === 'object' && error !== null) {
    const rpcError = error as ProviderRpcError;
    if (rpcError.code === 4001) return '지갑 요청이 취소되었습니다.';
    if (rpcError.code === 4902) return '현재 지갑에 네트워크가 등록되어 있지 않습니다.';
    if (rpcError.message) return rpcError.message;
  }
  return '지갑 요청을 처리하지 못했습니다.';
}
