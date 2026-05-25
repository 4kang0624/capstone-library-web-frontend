import { CONTRACT_ADDRESS } from '@/constants/env';
import { getActiveAccountOrConnect, switchToConfiguredChain } from '@/lib/web3/wallet';
import { requireEthereum } from '@/lib/web3/metamask';
import {
  OnchainRentalStatus,
  OnchainRentalStatusLabel,
  type CreateEscrowRentalParams,
  type EscrowTransactionResult,
  type OnchainRental,
} from './escrowTypes';

const UINT_WORD_LENGTH = 64;
const ZERO = BigInt(0);

const SELECTORS = {
  createRental: '0xe6cfa95d',
  acceptRental: '0xa0a00959',
  rejectRental: '0xbe473809',
  cancelRental: '0x5e0dacb4',
  payDepositAndShipping: '0xad5df2aa',
  markShipped: '0xeed90d6b',
  confirmDelivered: '0xfaf08906',
  requestReturn: '0x58676582',
  confirmReturnAndComplete: '0xad0d85ee',
  markDisputed: '0x314b6835',
  resolveDispute: '0x3fabe74f',
  withdraw: '0x3ccfd60b',
  getRental: '0x652bd29e',
  claimableBalanceOf: '0x9c3ee244',
};

const RENTAL_CREATED_TOPIC =
  '0x15496caf0bd1e3d9187db2077236bb6d96aa36fa0de0d49f95896f08b0cba06c';

interface RpcLog {
  address: string;
  topics: string[];
  data: string;
}

interface RpcTransactionReceipt {
  transactionHash: string;
  status?: string;
  logs: RpcLog[];
}

interface TransactionRequest {
  from: string;
  to: string;
  data: string;
  value?: string;
}

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const stripHexPrefix = (value: string) => value.replace(/^0x/i, '');

const normalizeAddress = (address: string) => address.toLowerCase();

function getContractAddress(): string {
  if (!isAddress(CONTRACT_ADDRESS)) {
    throw new Error('NEXT_PUBLIC_CONTRACT_ADDRESS가 올바른 주소가 아닙니다.');
  }
  return CONTRACT_ADDRESS;
}

function isAddress(address?: string): address is string {
  return !!address && /^0x[0-9a-fA-F]{40}$/.test(address);
}

function toBigInt(value: string | number | bigint): bigint {
  if (typeof value === 'bigint') return value;
  return BigInt(value);
}

function toSafeNumber(value: bigint, field: string): number {
  const numberValue = Number(value);
  if (!Number.isSafeInteger(numberValue)) {
    throw new Error(`${field} 값이 안전한 숫자 범위를 초과했습니다.`);
  }
  return numberValue;
}

function toQuantityHex(value: string | number | bigint): string {
  const bigintValue = toBigInt(value);
  if (bigintValue === ZERO) return '0x0';
  return `0x${bigintValue.toString(16)}`;
}

function encodeUint(value: string | number | bigint): string {
  const bigintValue = toBigInt(value);
  if (bigintValue < ZERO) throw new Error('uint256 값은 음수가 될 수 없습니다.');
  return bigintValue.toString(16).padStart(UINT_WORD_LENGTH, '0');
}

function encodeAddress(address: string): string {
  if (!isAddress(address)) throw new Error('올바른 지갑 주소가 아닙니다.');
  return stripHexPrefix(address).padStart(UINT_WORD_LENGTH, '0');
}

function encodeCall(selector: string, encodedArgs: string[] = []): string {
  return `${selector}${encodedArgs.join('')}`;
}

function splitWords(hexData: string): string[] {
  const clean = stripHexPrefix(hexData);
  if (!clean) return [];
  const words = clean.match(new RegExp(`.{1,${UINT_WORD_LENGTH}}`, 'g')) ?? [];
  return words.map((word) => word.padStart(UINT_WORD_LENGTH, '0'));
}

function decodeUint(word: string): bigint {
  return BigInt(`0x${word || '0'}`);
}

function decodeAddress(word: string): string {
  return `0x${word.slice(-40)}`;
}

function isReceipt(value: unknown): value is RpcTransactionReceipt {
  return (
    typeof value === 'object' &&
    value !== null &&
    'transactionHash' in value &&
    'logs' in value &&
    Array.isArray((value as { logs: unknown }).logs)
  );
}

async function sendTransaction(request: TransactionRequest): Promise<string> {
  const ethereum = requireEthereum();
  return ethereum.request<string>({
    method: 'eth_sendTransaction',
    params: [request],
  });
}

async function callContract(data: string): Promise<string> {
  const ethereum = requireEthereum();
  return ethereum.request<string>({
    method: 'eth_call',
    params: [{ to: getContractAddress(), data }, 'latest'],
  });
}

async function waitForTransactionReceipt(txHash: string): Promise<RpcTransactionReceipt> {
  const ethereum = requireEthereum();

  for (let attempt = 0; attempt < 60; attempt += 1) {
    const receipt = await ethereum.request<unknown>({
      method: 'eth_getTransactionReceipt',
      params: [txHash],
    });

    if (isReceipt(receipt)) {
      console.log('[escrowFlow] receipt:', {
        txHash,
        status: receipt.status,
        logsCount: receipt.logs.length,
        logs: receipt.logs.map((l) => ({ address: l.address, topics: l.topics })),
      });
      if (receipt.status && BigInt(receipt.status) === ZERO) {
        throw new Error('트랜잭션이 실패했습니다. (txHash: ' + txHash + ')');
      }
      return receipt;
    }

    await sleep(1000);
  }

  throw new Error('트랜잭션 영수증을 확인하지 못했습니다.');
}

function parseRentalCreatedId(receipt: RpcTransactionReceipt): number | undefined {
  const contractAddress = normalizeAddress(getContractAddress());
  const log = receipt.logs.find(
    (item) =>
      normalizeAddress(item.address) === contractAddress &&
      item.topics[0]?.toLowerCase() === RENTAL_CREATED_TOPIC,
  );

  const rentalIdTopic = log?.topics[1];
  if (!rentalIdTopic) return undefined;
  return toSafeNumber(decodeUint(stripHexPrefix(rentalIdTopic)), 'rentalId');
}

async function runEscrowTransaction(
  data: string,
  value?: string | number | bigint,
): Promise<EscrowTransactionResult> {
  await switchToConfiguredChain();

  const from = await getActiveAccountOrConnect();
  console.log('[escrowFlow] runEscrowTransaction:', {
    from,
    to: getContractAddress(),
    selector: data.slice(0, 10),
    value,
  });
  const txHash = await sendTransaction({
    from,
    to: getContractAddress(),
    data,
    ...(value !== undefined ? { value: toQuantityHex(value) } : {}),
  });
  console.log('[escrowFlow] txHash:', txHash);
  const receipt = await waitForTransactionReceipt(txHash);

  const onchainRentalId = parseRentalCreatedId(receipt);
  console.log('[escrowFlow] parsed onchainRentalId:', onchainRentalId);
  return {
    txHash,
    onchainRentalId,
    from,
  };
}

export async function createEscrowRental(
  params: CreateEscrowRentalParams,
): Promise<EscrowTransactionResult> {
  const data = encodeCall(SELECTORS.createRental, [
    encodeUint(params.bookId),
    encodeAddress(params.owner),
    encodeUint(params.depositWei),
    encodeUint(params.shippingFeeWei),
    encodeUint(params.dueDateUnix),
  ]);

  const result = await runEscrowTransaction(data);
  return { ...result, status: OnchainRentalStatus.Requested };
}

export async function acceptEscrowRental(rentalId: number): Promise<EscrowTransactionResult> {
  return {
    ...(await runEscrowTransaction(encodeCall(SELECTORS.acceptRental, [encodeUint(rentalId)]))),
    status: OnchainRentalStatus.Accepted,
  };
}

export async function rejectEscrowRental(rentalId: number): Promise<EscrowTransactionResult> {
  return {
    ...(await runEscrowTransaction(encodeCall(SELECTORS.rejectRental, [encodeUint(rentalId)]))),
    status: OnchainRentalStatus.Rejected,
  };
}

export async function cancelEscrowRental(rentalId: number): Promise<EscrowTransactionResult> {
  return {
    ...(await runEscrowTransaction(encodeCall(SELECTORS.cancelRental, [encodeUint(rentalId)]))),
    status: OnchainRentalStatus.Cancelled,
  };
}

export async function payEscrowDepositAndShipping(
  rentalId: number,
  depositWei: string,
  shippingFeeWei: string,
): Promise<EscrowTransactionResult> {
  const totalAmount = toBigInt(depositWei) + toBigInt(shippingFeeWei);
  return {
    ...(await runEscrowTransaction(
      encodeCall(SELECTORS.payDepositAndShipping, [encodeUint(rentalId)]),
      totalAmount,
    )),
    status: OnchainRentalStatus.Paid,
  };
}

export async function markEscrowShipped(rentalId: number): Promise<EscrowTransactionResult> {
  return {
    ...(await runEscrowTransaction(encodeCall(SELECTORS.markShipped, [encodeUint(rentalId)]))),
    status: OnchainRentalStatus.Shipped,
  };
}

export async function confirmEscrowDelivered(rentalId: number): Promise<EscrowTransactionResult> {
  return {
    ...(await runEscrowTransaction(encodeCall(SELECTORS.confirmDelivered, [encodeUint(rentalId)]))),
    status: OnchainRentalStatus.Delivered,
  };
}

export async function requestEscrowReturn(rentalId: number): Promise<EscrowTransactionResult> {
  return {
    ...(await runEscrowTransaction(encodeCall(SELECTORS.requestReturn, [encodeUint(rentalId)]))),
    status: OnchainRentalStatus.ReturnRequested,
  };
}

export async function completeEscrowReturn(rentalId: number): Promise<EscrowTransactionResult> {
  return {
    ...(await runEscrowTransaction(
      encodeCall(SELECTORS.confirmReturnAndComplete, [encodeUint(rentalId)]),
    )),
    status: OnchainRentalStatus.Completed,
  };
}

export async function markEscrowDisputed(rentalId: number): Promise<EscrowTransactionResult> {
  return {
    ...(await runEscrowTransaction(encodeCall(SELECTORS.markDisputed, [encodeUint(rentalId)]))),
    status: OnchainRentalStatus.Disputed,
  };
}

export async function resolveEscrowDispute(
  rentalId: number,
  ownerAmountWei: string,
  renterAmountWei: string,
): Promise<EscrowTransactionResult> {
  return {
    ...(await runEscrowTransaction(
      encodeCall(SELECTORS.resolveDispute, [
        encodeUint(rentalId),
        encodeUint(ownerAmountWei),
        encodeUint(renterAmountWei),
      ]),
    )),
    status: OnchainRentalStatus.Completed,
  };
}

export async function withdrawEscrowBalance(): Promise<EscrowTransactionResult> {
  return runEscrowTransaction(encodeCall(SELECTORS.withdraw));
}

export async function getEscrowRental(rentalId: number): Promise<OnchainRental> {
  await switchToConfiguredChain();
  console.log('[escrowFlow] getEscrowRental rentalId:', rentalId);
  const result = await callContract(encodeCall(SELECTORS.getRental, [encodeUint(rentalId)]));
  console.log('[escrowFlow] getRental raw result:', result);
  const words = splitWords(result);

  if (words.length < 9) throw new Error('온체인 대여 정보를 해석하지 못했습니다.');

  const status = toSafeNumber(decodeUint(words[8]), 'status') as OnchainRentalStatus;

  return {
    rentalId: toSafeNumber(decodeUint(words[0]), 'rentalId'),
    bookId: toSafeNumber(decodeUint(words[1]), 'bookId'),
    owner: decodeAddress(words[2]),
    renter: decodeAddress(words[3]),
    depositWei: decodeUint(words[4]).toString(),
    shippingFeeWei: decodeUint(words[5]).toString(),
    createdAt: toSafeNumber(decodeUint(words[6]), 'createdAt'),
    dueDate: toSafeNumber(decodeUint(words[7]), 'dueDate'),
    status,
    statusLabel: OnchainRentalStatusLabel[status] ?? `상태 ${status}`,
  };
}

export async function getEscrowClaimableBalance(account: string): Promise<string> {
  await switchToConfiguredChain();
  const result = await callContract(
    encodeCall(SELECTORS.claimableBalanceOf, [encodeAddress(account)]),
  );
  const [balanceWord] = splitWords(result);
  return decodeUint(balanceWord ?? '0').toString();
}
