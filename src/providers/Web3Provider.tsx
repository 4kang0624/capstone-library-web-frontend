'use client';

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from 'react';

interface Web3ContextValue {
  account: string | null;
  isConnected: boolean;
  connectWallet: () => Promise<void>;
  disconnectWallet: () => void;
}

const Web3Context = createContext<Web3ContextValue | null>(null);

export function Web3Provider({ children }: { children: ReactNode }) {
  const [account, setAccount] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const saved = localStorage.getItem('wallet_account');
    if (saved) setAccount(saved);
  }, []);

  const connectWallet = useCallback(async () => {
    if (typeof window === 'undefined') return;
    const ethereum = (window as { ethereum?: { request: (args: { method: string }) => Promise<string[]> } }).ethereum;
    if (!ethereum) {
      alert('MetaMask가 설치되어 있지 않습니다. MetaMask를 설치해주세요.');
      return;
    }
    try {
      const accounts = await ethereum.request({ method: 'eth_requestAccounts' });
      const addr = accounts[0];
      setAccount(addr);
      localStorage.setItem('wallet_account', addr);
    } catch {
      alert('지갑 연결에 실패했습니다.');
    }
  }, []);

  const disconnectWallet = useCallback(() => {
    setAccount(null);
    localStorage.removeItem('wallet_account');
  }, []);

  return (
    <Web3Context.Provider
      value={{
        account,
        isConnected: !!account,
        connectWallet,
        disconnectWallet,
      }}
    >
      {children}
    </Web3Context.Provider>
  );
}

export function useWeb3Context(): Web3ContextValue {
  const ctx = useContext(Web3Context);
  if (!ctx) throw new Error('useWeb3Context must be used within Web3Provider');
  return ctx;
}
