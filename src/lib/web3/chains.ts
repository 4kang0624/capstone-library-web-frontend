import { BLOCKCHAIN_RPC_URL, CHAIN_ID } from '@/constants/env';

export const CONFIGURED_CHAIN_ID = CHAIN_ID;
export const CONFIGURED_CHAIN_ID_HEX = `0x${CONFIGURED_CHAIN_ID.toString(16)}`;

export const CONFIGURED_CHAIN_PARAMS = {
  chainId: CONFIGURED_CHAIN_ID_HEX,
  chainName: CONFIGURED_CHAIN_ID === 31337 ? 'Hardhat Localhost' : `Chain ${CONFIGURED_CHAIN_ID}`,
  nativeCurrency: {
    name: 'Ether',
    symbol: 'ETH',
    decimals: 18,
  },
  rpcUrls: [BLOCKCHAIN_RPC_URL],
};
