import { CONFIGURED_CHAIN_ID_HEX, CONFIGURED_CHAIN_PARAMS } from './chains';
import { getWalletErrorMessage, requireEthereum } from './metamask';

interface ProviderRpcError {
  code?: number;
}

const normalizeChainId = (chainId: string) => chainId.toLowerCase();

export async function getWalletAccounts(): Promise<string[]> {
  const ethereum = requireEthereum();
  return ethereum.request<string[]>({ method: 'eth_accounts' });
}

export async function requestWalletAccounts(): Promise<string[]> {
  const ethereum = requireEthereum();
  return ethereum.request<string[]>({ method: 'eth_requestAccounts' });
}

export async function getCurrentChainId(): Promise<string> {
  const ethereum = requireEthereum();
  return ethereum.request<string>({ method: 'eth_chainId' });
}

export async function switchToConfiguredChain(): Promise<void> {
  const ethereum = requireEthereum();
  const currentChainId = await getCurrentChainId();

  if (normalizeChainId(currentChainId) === normalizeChainId(CONFIGURED_CHAIN_ID_HEX)) {
    return;
  }

  try {
    await ethereum.request({
      method: 'wallet_switchEthereumChain',
      params: [{ chainId: CONFIGURED_CHAIN_ID_HEX }],
    });
  } catch (error) {
    const rpcError = error as ProviderRpcError;
    if (rpcError.code !== 4902) {
      throw new Error(getWalletErrorMessage(error));
    }

    await ethereum.request({
      method: 'wallet_addEthereumChain',
      params: [CONFIGURED_CHAIN_PARAMS],
    });
  }
}

export async function connectConfiguredWallet(): Promise<string> {
  await switchToConfiguredChain();

  const accounts = await requestWalletAccounts();
  const account = accounts[0];
  if (!account) throw new Error('연결된 지갑 계정을 찾을 수 없습니다.');
  return account;
}

export async function getActiveAccountOrConnect(): Promise<string> {
  await switchToConfiguredChain();

  const accounts = await getWalletAccounts();
  const account = accounts[0] ?? (await requestWalletAccounts())[0];
  if (!account) throw new Error('연결된 지갑 계정을 찾을 수 없습니다.');
  return account;
}

export async function signWalletMessage(account: string, message: string): Promise<string> {
  const ethereum = requireEthereum();
  return ethereum.request<string>({
    method: 'personal_sign',
    params: [message, account],
  });
}
