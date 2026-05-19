import { apiClient } from '@/lib/api/client';
import type { WalletInfo, WalletNonceResponse } from './types';

export const walletApi = {
  getNonce: (walletAddress: string) =>
    apiClient
      .post<WalletNonceResponse>('/wallet/nonce', { wallet_address: walletAddress })
      .then((r) => r.data),

  verify: (data: { wallet_address: string; signature: string; nonce: string }) =>
    apiClient.post('/wallet/verify', data).then((r) => r.data),

  getWallet: () => apiClient.get<WalletInfo>('/wallet/me').then((r) => r.data),

  deleteWallet: () => apiClient.delete('/wallet/me').then((r) => r.data),
};
