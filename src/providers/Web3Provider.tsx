'use client';

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from 'react';
import {
  CONFIGURED_CHAIN_ID_HEX,
  connectConfiguredWallet,
  getCurrentChainId,
  getEthereum,
  getWalletAccounts,
  getWalletErrorMessage,
  signWalletMessage,
} from '@/lib/web3';
import { walletApi } from '@/features/wallet/api';
import { tokenStorage } from '@/lib/api/token';

interface Web3ContextValue {
  account: string | null;
  chainId: string | null;
  isConnected: boolean;
  isConfiguredChain: boolean;
  connectWallet: () => Promise<void>;
  disconnectWallet: () => void;
  refreshWallet: () => Promise<void>;
}

const Web3Context = createContext<Web3ContextValue | null>(null);

export function Web3Provider({ children }: { children: ReactNode }) {
  const [account, setAccount] = useState<string | null>(() => {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem('wallet_account');
  });
  const [chainId, setChainId] = useState<string | null>(null);

  const refreshWallet = useCallback(async () => {
    const ethereum = getEthereum();
    if (!ethereum) return;

    const [accounts, currentChainId] = await Promise.all([
      getWalletAccounts().catch(() => []),
      getCurrentChainId().catch(() => null),
    ]);

    const nextAccount = accounts[0] ?? null;
    setAccount(nextAccount);
    setChainId(currentChainId);

    if (typeof window === 'undefined') return;
    if (nextAccount) {
      localStorage.setItem('wallet_account', nextAccount);
    } else {
      localStorage.removeItem('wallet_account');
    }
  }, []);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      void refreshWallet();
    }, 0);

    return () => window.clearTimeout(timer);
  }, [refreshWallet]);

  useEffect(() => {
    const ethereum = getEthereum();
    if (!ethereum?.on) return;

    const handleAccountsChanged = (accounts: unknown) => {
      const nextAccount =
        Array.isArray(accounts) && typeof accounts[0] === 'string' ? accounts[0] : null;
      setAccount(nextAccount);
      if (nextAccount) {
        localStorage.setItem('wallet_account', nextAccount);
      } else {
        localStorage.removeItem('wallet_account');
      }
    };

    const handleChainChanged = (nextChainId: unknown) => {
      if (typeof nextChainId === 'string') {
        setChainId(nextChainId);
      }
    };

    ethereum.on('accountsChanged', handleAccountsChanged);
    ethereum.on('chainChanged', handleChainChanged);

    return () => {
      ethereum.removeListener?.('accountsChanged', handleAccountsChanged);
      ethereum.removeListener?.('chainChanged', handleChainChanged);
    };
  }, []);

  const connectWallet = useCallback(async () => {
    try {
      const connectedAccount = await connectConfiguredWallet();
      const currentChainId = await getCurrentChainId().catch(() => null);

      if (tokenStorage.getAccessToken()) {
        const { nonce, message } = await walletApi.getNonce(connectedAccount);
        const signature = await signWalletMessage(connectedAccount, message);
        await walletApi.verify({
          wallet_address: connectedAccount,
          nonce,
          signature,
        });
      }

      setAccount(connectedAccount);
      setChainId(currentChainId);
      localStorage.setItem('wallet_account', connectedAccount);
    } catch (error) {
      alert(getWalletErrorMessage(error));
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
        chainId,
        isConnected: !!account,
        isConfiguredChain:
          chainId?.toLowerCase() === CONFIGURED_CHAIN_ID_HEX.toLowerCase(),
        connectWallet,
        disconnectWallet,
        refreshWallet,
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
