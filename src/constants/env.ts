export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL ?? 'http://localhost:8000';
export const API_PREFIX = '/api';
export const APP_NAME = 'Shelfie';
export const CHAIN_ID = Number(process.env.NEXT_PUBLIC_CHAIN_ID ?? 31337);
export const CONTRACT_ADDRESS = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS ?? '';
export const BLOCKCHAIN_RPC_URL =
  process.env.NEXT_PUBLIC_BLOCKCHAIN_RPC_URL ??
  process.env.NEXT_PUBLIC_BLOCKCHAIN_EXPLORER_URL ??
  'http://127.0.0.1:8545';
export const BLOCKCHAIN_EXPLORER_URL =
  process.env.NEXT_PUBLIC_BLOCKCHAIN_EXPLORER_URL ?? '';
