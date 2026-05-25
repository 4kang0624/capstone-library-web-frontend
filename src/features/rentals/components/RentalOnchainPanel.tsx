'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { CHAIN_ID, CONTRACT_ADDRESS } from '@/constants/env';
import { QUERY_KEYS } from '@/constants/queryKeys';
import { RentalStatus } from '@/types/enums';
import { formatWei, shortenAddress } from '@/lib/format/eth';
import { useToast } from '@/hooks/useToast';
import { parseAxiosError } from '@/lib/api/errors';
import { useWeb3Context } from '@/providers/Web3Provider';
import { rentalsApi } from '../api';
import type { PrepareOnchainResponse, Rental } from '../types';
import {
  acceptEscrowRental,
  cancelEscrowRental,
  completeEscrowReturn,
  confirmEscrowDelivered,
  createEscrowRental,
  getEscrowClaimableBalance,
  getEscrowRental,
  markEscrowDisputed,
  markEscrowShipped,
  payEscrowDepositAndShipping,
  rejectEscrowRental,
  requestEscrowReturn,
  withdrawEscrowBalance,
} from '../web3/escrowFlow';
import {
  OnchainRentalStatus,
  OnchainRentalStatusLabel,
  type EscrowTransactionResult,
  type OnchainRental,
} from '../web3/escrowTypes';

interface RentalOnchainPanelProps {
  rental: Rental;
  isBorrower: boolean;
  isLender: boolean;
}

type PendingAction =
  | 'connect'
  | 'refresh'
  | 'create'
  | 'accept'
  | 'reject'
  | 'cancel'
  | 'pay'
  | 'ship'
  | 'deliver'
  | 'return'
  | 'complete'
  | 'dispute'
  | 'withdraw';

const TERMINAL_BACKEND_STATUSES = new Set<RentalStatus>([
  RentalStatus.REJECTED,
  RentalStatus.CANCELLED,
  RentalStatus.COMPLETED,
]);

const DISPUTABLE_ONCHAIN_STATUSES = new Set<OnchainRentalStatus>([
  OnchainRentalStatus.Paid,
  OnchainRentalStatus.Shipped,
  OnchainRentalStatus.Delivered,
  OnchainRentalStatus.ReturnRequested,
]);

const lower = (value?: string | null) => value?.toLowerCase() ?? '';

const isAddress = (value?: string | null): value is string =>
  !!value && /^0x[0-9a-fA-F]{40}$/.test(value);

const getStatusKey = (status?: OnchainRentalStatus) =>
  status === undefined ? undefined : OnchainRentalStatus[status];

const addWei = (left: string, right: string) => {
  try {
    return (BigInt(left || '0') + BigInt(right || '0')).toString();
  } catch {
    return '0';
  }
};

const resolveWei = (...values: Array<string | null | undefined>) => {
  const normalized = values
    .map((value) => value?.trim())
    .filter((value): value is string => !!value);

  return normalized.find((value) => value !== '0') ?? normalized[0] ?? '0';
};

const resolveLenderWalletAddress = (
  candidates: Array<string | null | undefined>,
  borrowerWalletAddress?: string | null,
) => {
  const borrowerWalletLower = lower(borrowerWalletAddress);
  const owner = candidates.find(
    (candidate) => isAddress(candidate) && lower(candidate) !== borrowerWalletLower,
  );

  if (owner) return owner;

  if (candidates.some((candidate) => isAddress(candidate))) {
    throw new Error('책 주인의 지갑 주소가 대여자 지갑과 같습니다. 소유자 계정으로 다시 지갑을 등록한 뒤 시도하세요.');
  }

  throw new Error('책 주인의 지갑 주소가 등록되어 있지 않습니다. 소유자 계정으로 로그인해 지갑을 먼저 등록해야 합니다.');
};

const getDueDateUnix = (rental: Rental, preparedDueDate?: number) => {
  const now = Math.floor(Date.now() / 1000);
  if (preparedDueDate && preparedDueDate > now) return preparedDueDate;

  if (rental.due_date) {
    const fromRental = Math.floor(new Date(rental.due_date).getTime() / 1000);
    if (Number.isFinite(fromRental) && fromRental > now) return fromRental;
  }

  return now + 7 * 24 * 60 * 60;
};

const formatUnixDate = (value: number) =>
  new Intl.DateTimeFormat('ko-KR', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(value * 1000));

export function RentalOnchainPanel({
  rental,
  isBorrower,
  isLender,
}: RentalOnchainPanelProps) {
  const queryClient = useQueryClient();
  const { addToast } = useToast();
  const { account, isConnected, isConfiguredChain, connectWallet, refreshWallet } =
    useWeb3Context();
  const [onchainRental, setOnchainRental] = useState<OnchainRental | null>(null);
  const [claimableBalanceWei, setClaimableBalanceWei] = useState('0');
  const [preparedOnchain, setPreparedOnchain] = useState<PrepareOnchainResponse | null>(null);
  const [pendingAction, setPendingAction] = useState<PendingAction | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const onchainRentalId = rental.onchain_rental_id ?? onchainRental?.rentalId;
  const onchainStatus = onchainRental?.status;
  const accountLower = lower(account);
  const ownerWalletLower = lower(onchainRental?.owner ?? rental.lender_wallet_address);
  const renterWalletLower = lower(onchainRental?.renter ?? rental.borrower_wallet_address);
  const isOwnerWallet = !!accountLower && accountLower === ownerWalletLower;
  const isRenterWallet = !!accountLower && accountLower === renterWalletLower;
  const hasClaimableBalance = BigInt(claimableBalanceWei || '0') > BigInt(0);
  const plannedDepositWei = resolveWei(
    rental.deposit_wei,
    preparedOnchain?.deposit_wei,
  );
  const plannedShippingFeeWei = resolveWei(
    rental.shipping_fee_wei,
    preparedOnchain?.shipping_fee_wei,
  );
  const plannedDueDateUnix = preparedOnchain?.due_date_unix;
  const plannedDueDate = rental.due_date;
  const plannedTotalWei = addWei(plannedDepositWei, plannedShippingFeeWei);

  const walletNotice = useMemo(() => {
    if (!isConnected) return '스마트 컨트랙트 기능을 사용하려면 지갑을 연결하세요.';
    if (!isConfiguredChain) return `MetaMask 네트워크를 체인 ${CHAIN_ID}로 전환해야 합니다.`;
    if (onchainRental && !isOwnerWallet && !isRenterWallet) {
      return `현재 연결된 지갑은 이 온체인 대여의 참여자 지갑이 아닙니다. 소유자는 ${shortenAddress(onchainRental.owner)}, 대여자는 ${shortenAddress(onchainRental.renter)}입니다.`;
    }
    return null;
  }, [isConnected, isConfiguredChain, isOwnerWallet, isRenterWallet, onchainRental]);

  const invalidateRental = useCallback(async () => {
    await Promise.all([
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.RENTAL(rental.id) }),
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.MY_RENTALS }),
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.MY_LENDINGS }),
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.BOOK_COPIES }),
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.RENTABLE_COPIES }),
    ]);
  }, [queryClient, rental.id]);

  const refreshOnchain = useCallback(async () => {
    if (!onchainRentalId) {
      setOnchainRental(null);
      return;
    }

    setPendingAction('refresh');
    setErrorMessage(null);
    try {
      const [nextRental, nextClaimableBalance] = await Promise.all([
        getEscrowRental(onchainRentalId),
        account ? getEscrowClaimableBalance(account) : Promise.resolve('0'),
      ]);
      setOnchainRental(nextRental);
      setClaimableBalanceWei(nextClaimableBalance);
    } catch (error) {
      const err = parseAxiosError(error);
      setErrorMessage(err.message);
    } finally {
      setPendingAction(null);
    }
  }, [account, onchainRentalId]);

  useEffect(() => {
    if (!onchainRentalId || !isConnected) return;
    const timer = window.setTimeout(() => {
      void refreshOnchain();
    }, 0);

    return () => window.clearTimeout(timer);
  }, [isConnected, onchainRentalId, refreshOnchain]);

  useEffect(() => {
    if (onchainRentalId || rental.rental_status !== RentalStatus.APPROVED) {
      return;
    }

    let ignore = false;
    rentalsApi.prepareOnchain(rental.id)
      .then((prepared) => {
        if (!ignore) setPreparedOnchain(prepared);
      })
      .catch(() => {
        if (!ignore) setPreparedOnchain(null);
      });

    return () => {
      ignore = true;
    };
  }, [onchainRentalId, rental.id, rental.rental_status]);

  const syncTransaction = useCallback(
    async (
      result: EscrowTransactionResult,
      fallbackRentalId?: number,
      extra?: { owner_wallet_address?: string },
    ) => {
      const syncedRentalId = result.onchainRentalId ?? fallbackRentalId ?? onchainRentalId;
      const statusKey = getStatusKey(result.status);

      if (!syncedRentalId) return;

      await rentalsApi.syncOnchain(rental.id, {
        tx_hash: result.txHash,
        onchain_rental_id: syncedRentalId,
        ...(statusKey ? { onchain_status: statusKey } : {}),
        ...(result.from ? { caller_wallet_address: result.from } : {}),
        ...extra,
      });
    },
    [onchainRentalId, rental.id],
  );

  const runAction = useCallback(
    async (
      action: PendingAction,
      task: () => Promise<void>,
      successMessage: string,
    ) => {
      setPendingAction(action);
      setErrorMessage(null);
      try {
        await task();
        await Promise.all([refreshWallet(), refreshOnchain(), invalidateRental()]);
        addToast(successMessage, 'success');
      } catch (error) {
        const err = parseAxiosError(error);
        setErrorMessage(err.message);
        addToast(err.message, 'error');
      } finally {
        setPendingAction(null);
      }
    },
    [addToast, invalidateRental, refreshOnchain, refreshWallet],
  );

  const handleConnect = () =>
    runAction('connect', connectWallet, '지갑이 연결되었습니다.');

  const handleCreate = () =>
    runAction(
      'create',
      async () => {
        const prepared = await rentalsApi.prepareOnchain(rental.id);
        const latestRental = await rentalsApi.getById(rental.id);
        const borrowerWalletAddress =
          latestRental.borrower_wallet_address ?? prepared.borrower_wallet_address ?? account;
        const owner = resolveLenderWalletAddress(
          [
            latestRental.lender_wallet_address,
            prepared.lender_wallet_address,
            rental.lender_wallet_address,
          ],
          borrowerWalletAddress,
        );

        const result = await createEscrowRental({
          bookId: prepared.book_copy_id,
          owner,
          depositWei: resolveWei(
            plannedDepositWei,
            latestRental.deposit_wei,
            prepared.deposit_wei,
          ),
          shippingFeeWei: resolveWei(
            plannedShippingFeeWei,
            latestRental.shipping_fee_wei,
            prepared.shipping_fee_wei,
          ),
          dueDateUnix: getDueDateUnix(
            plannedDueDate ? { ...rental, due_date: plannedDueDate } : latestRental,
            prepared.due_date_unix,
          ),
        });

        if (!result.onchainRentalId) {
          throw new Error('RentalCreated 이벤트에서 온체인 대여 ID를 찾지 못했습니다.');
        }

        await syncTransaction(result, result.onchainRentalId, { owner_wallet_address: owner });
      },
      '온체인 대여 요청이 생성되었습니다.',
    );

  const handleAccept = () =>
    runAction(
      'accept',
      async () => {
        console.log('[RentalOnchainPanel] handleAccept onchainRentalId:', onchainRentalId, 'account:', account, 'ownerWallet:', ownerWalletLower);
        if (!onchainRentalId) throw new Error('온체인 대여 ID가 없습니다.');
        const result = await acceptEscrowRental(onchainRentalId);
        await syncTransaction(result, onchainRentalId);
      },
      '온체인 대여 요청을 승인했습니다.',
    );

  const handleReject = () =>
    runAction(
      'reject',
      async () => {
        if (!onchainRentalId) throw new Error('온체인 대여 ID가 없습니다.');
        const result = await rejectEscrowRental(onchainRentalId);
        await syncTransaction(result, onchainRentalId);
      },
      '온체인 대여 요청을 거절했습니다.',
    );

  const handleCancel = () =>
    runAction(
      'cancel',
      async () => {
        if (!onchainRentalId) throw new Error('온체인 대여 ID가 없습니다.');
        const result = await cancelEscrowRental(onchainRentalId);
        await syncTransaction(result, onchainRentalId);
      },
      '온체인 대여 요청을 취소했습니다.',
    );

  const handlePay = () =>
    runAction(
      'pay',
      async () => {
        if (!onchainRentalId) throw new Error('온체인 대여 ID가 없습니다.');
        const result = await payEscrowDepositAndShipping(
          onchainRentalId,
          rental.deposit_wei,
          rental.shipping_fee_wei,
        );
        await syncTransaction(result, onchainRentalId);
      },
      '보증금과 배송비를 예치했습니다.',
    );

  const handleShip = () =>
    runAction(
      'ship',
      async () => {
        if (!onchainRentalId) throw new Error('온체인 대여 ID가 없습니다.');
        const result = await markEscrowShipped(onchainRentalId);
        await syncTransaction(result, onchainRentalId);
      },
      '발송 완료 상태로 변경했습니다.',
    );

  const handleDeliver = () =>
    runAction(
      'deliver',
      async () => {
        if (!onchainRentalId) throw new Error('온체인 대여 ID가 없습니다.');
        const result = await confirmEscrowDelivered(onchainRentalId);
        await syncTransaction(result, onchainRentalId);
      },
      '수령 확인을 완료했습니다.',
    );

  const handleReturn = () =>
    runAction(
      'return',
      async () => {
        if (!onchainRentalId) throw new Error('온체인 대여 ID가 없습니다.');
        const result = await requestEscrowReturn(onchainRentalId);
        await syncTransaction(result, onchainRentalId);
      },
      '온체인 반납 요청을 완료했습니다.',
    );

  const handleComplete = () =>
    runAction(
      'complete',
      async () => {
        if (!onchainRentalId) throw new Error('온체인 대여 ID가 없습니다.');
        const result = await completeEscrowReturn(onchainRentalId);
        await syncTransaction(result, onchainRentalId);
      },
      '반납 확인과 정산을 완료했습니다.',
    );

  const handleDispute = () =>
    runAction(
      'dispute',
      async () => {
        if (!onchainRentalId) throw new Error('온체인 대여 ID가 없습니다.');
        const result = await markEscrowDisputed(onchainRentalId);
        await syncTransaction(result, onchainRentalId);
      },
      '온체인 분쟁 상태로 변경했습니다.',
    );

  const handleWithdraw = () =>
    runAction(
      'withdraw',
      async () => {
        await withdrawEscrowBalance();
      },
      '정산 가능 금액을 출금했습니다.',
    );

  const renderActions = () => {
    if (!isConnected) {
      return (
        <Button onClick={handleConnect} loading={pendingAction === 'connect'}>
          지갑 연결
        </Button>
      );
    }

    if (!onchainRentalId) {
      if (
        !isBorrower ||
        rental.rental_status !== RentalStatus.APPROVED ||
        TERMINAL_BACKEND_STATUSES.has(rental.rental_status)
      ) {
        return null;
      }
      return (
        <Button onClick={handleCreate} loading={pendingAction === 'create'}>
          온체인 대여 생성
        </Button>
      );
    }

    if (onchainStatus === undefined) {
      return (
        <Button
          variant="outlined"
          onClick={refreshOnchain}
          loading={pendingAction === 'refresh'}
        >
          온체인 정보 불러오기
        </Button>
      );
    }

    return (
      <div className="flex flex-wrap gap-2">
        {isLender && onchainStatus === OnchainRentalStatus.Requested && (
          <>
            <Button
              onClick={handleAccept}
              loading={pendingAction === 'accept'}
              disabled={!isOwnerWallet}
            >
              온체인 승인
            </Button>
            <Button
              variant="danger"
              onClick={handleReject}
              loading={pendingAction === 'reject'}
              disabled={!isOwnerWallet}
            >
              온체인 거절
            </Button>
          </>
        )}

        {((isBorrower && onchainStatus === OnchainRentalStatus.Requested) ||
          onchainStatus === OnchainRentalStatus.Accepted) && (
          <Button
            variant="outlined"
            onClick={handleCancel}
            loading={pendingAction === 'cancel'}
            disabled={
              onchainStatus === OnchainRentalStatus.Requested
                ? !isRenterWallet
                : !isOwnerWallet && !isRenterWallet
            }
          >
            온체인 취소
          </Button>
        )}

        {isBorrower && onchainStatus === OnchainRentalStatus.Accepted && (
          <Button
            onClick={handlePay}
            loading={pendingAction === 'pay'}
            disabled={!isRenterWallet}
          >
            보증금 예치
          </Button>
        )}

        {isLender && onchainStatus === OnchainRentalStatus.Paid && (
          <Button
            onClick={handleShip}
            loading={pendingAction === 'ship'}
            disabled={!isOwnerWallet}
          >
            발송 완료
          </Button>
        )}

        {isBorrower && onchainStatus === OnchainRentalStatus.Shipped && (
          <Button
            onClick={handleDeliver}
            loading={pendingAction === 'deliver'}
            disabled={!isRenterWallet}
          >
            수령 확인
          </Button>
        )}

        {isBorrower && onchainStatus === OnchainRentalStatus.Delivered && (
          <Button
            onClick={handleReturn}
            loading={pendingAction === 'return'}
            disabled={!isRenterWallet}
          >
            반납 요청
          </Button>
        )}

        {isLender && onchainStatus === OnchainRentalStatus.ReturnRequested && (
          <Button
            onClick={handleComplete}
            loading={pendingAction === 'complete'}
            disabled={!isOwnerWallet}
          >
            반납 확인/정산
          </Button>
        )}

        {DISPUTABLE_ONCHAIN_STATUSES.has(onchainStatus) && (
          <Button
            variant="outlined"
            onClick={handleDispute}
            loading={pendingAction === 'dispute'}
            disabled={!isOwnerWallet && !isRenterWallet}
          >
            분쟁 제기
          </Button>
        )}

        {hasClaimableBalance && (
          <Button
            variant="outlined"
            onClick={handleWithdraw}
            loading={pendingAction === 'withdraw'}
          >
            정산금 출금
          </Button>
        )}

        <Button
          variant="text"
          onClick={() => void Promise.all([refreshWallet(), refreshOnchain()])}
          loading={pendingAction === 'refresh'}
        >
          새로고침
        </Button>
      </div>
    );
  };

  return (
    <div className="bg-bg-light-1 rounded-2xl border border-border p-6 mb-6 shadow-[0_12px_30px_rgba(36,32,24,0.06)]">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between mb-5">
        <div>
          <h2 className="text-lg font-bold text-text-dark">스마트 컨트랙트</h2>
          <p className="text-sm text-text-gray mt-1">
            Hardhat localhost의 BookRentalEscrow와 동기화합니다.
          </p>
        </div>
        <Badge variant={onchainRental ? 'success' : 'default'}>
          {onchainRental ? onchainRental.statusLabel : '미생성'}
        </Badge>
      </div>

      <dl className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm mb-5">
        <div>
          <dt className="text-text-gray">체인 ID</dt>
          <dd className="font-semibold text-text-dark">{CHAIN_ID}</dd>
        </div>
        <div>
          <dt className="text-text-gray">연결 지갑</dt>
          <dd className="font-mono text-xs text-text-dark">
            {account ? shortenAddress(account) : '미연결'}
          </dd>
        </div>
        <div className="sm:col-span-2">
          <dt className="text-text-gray">컨트랙트 주소</dt>
          <dd className="font-mono text-xs text-text-dark break-all">
            {CONTRACT_ADDRESS || '설정 필요'}
          </dd>
        </div>
        <div>
          <dt className="text-text-gray">온체인 대여 ID</dt>
          <dd className="font-semibold text-text-dark">{onchainRentalId ?? '없음'}</dd>
        </div>
        <div>
          <dt className="text-text-gray">온체인 상태</dt>
          <dd className="font-semibold text-text-dark">
            {onchainStatus === undefined
              ? rental.onchain_status ?? '없음'
              : OnchainRentalStatusLabel[onchainStatus]}
          </dd>
        </div>
        {!onchainRentalId && rental.rental_status === RentalStatus.APPROVED && (
          <>
            <div>
              <dt className="text-text-gray">생성 예정 보증금</dt>
              <dd className="font-semibold text-text-dark">{formatWei(plannedDepositWei)}</dd>
            </div>
            <div>
              <dt className="text-text-gray">생성 예정 배송비</dt>
              <dd className="font-semibold text-text-dark">{formatWei(plannedShippingFeeWei)}</dd>
            </div>
            <div>
              <dt className="text-text-gray">생성 예정 총액</dt>
              <dd className="font-semibold text-text-dark">{formatWei(plannedTotalWei)}</dd>
            </div>
            <div>
              <dt className="text-text-gray">반납 예정일</dt>
              <dd className="font-semibold text-text-dark">
                {plannedDueDate
                  ? new Intl.DateTimeFormat('ko-KR').format(new Date(plannedDueDate))
                  : plannedDueDateUnix
                    ? formatUnixDate(plannedDueDateUnix)
                  : '없음'}
              </dd>
            </div>
          </>
        )}
        {onchainRental && (
          <>
            <div>
              <dt className="text-text-gray">소유자 지갑</dt>
              <dd className="font-mono text-xs text-text-dark">{shortenAddress(onchainRental.owner)}</dd>
            </div>
            <div>
              <dt className="text-text-gray">대여자 지갑</dt>
              <dd className="font-mono text-xs text-text-dark">{shortenAddress(onchainRental.renter)}</dd>
            </div>
            <div>
              <dt className="text-text-gray">온체인 보증금</dt>
              <dd className="font-semibold text-text-dark">{formatWei(onchainRental.depositWei)}</dd>
            </div>
            <div>
              <dt className="text-text-gray">온체인 배송비</dt>
              <dd className="font-semibold text-text-dark">{formatWei(onchainRental.shippingFeeWei)}</dd>
            </div>
            <div>
              <dt className="text-text-gray">생성 시각</dt>
              <dd className="font-semibold text-text-dark">
                {formatUnixDate(onchainRental.createdAt)}
              </dd>
            </div>
            <div>
              <dt className="text-text-gray">반납 기한</dt>
              <dd className="font-semibold text-text-dark">
                {formatUnixDate(onchainRental.dueDate)}
              </dd>
            </div>
          </>
        )}
        {hasClaimableBalance && (
          <div className="sm:col-span-2">
            <dt className="text-text-gray">출금 가능 금액</dt>
            <dd className="font-semibold text-text-dark">{formatWei(claimableBalanceWei)}</dd>
          </div>
        )}
      </dl>

      {walletNotice && (
        <p className="text-sm text-warning-dark bg-warning/10 rounded-xl px-4 py-3 mb-4">
          {walletNotice}
        </p>
      )}

      {errorMessage && (
        <p className="text-sm text-error-dark bg-error/10 rounded-xl px-4 py-3 mb-4">
          {errorMessage}
        </p>
      )}

      {renderActions()}
    </div>
  );
}
