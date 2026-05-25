'use client';

import { useEffect, useMemo, useState } from 'react';
import { CheckCircle2, LinkIcon } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { useToast } from '@/hooks/useToast';
import { parseAxiosError } from '@/lib/api/errors';
import { RentalStatus } from '@/types/enums';
import type { Rental } from '@/features/rentals/types';
import { hasEscrowAdminRole, resolveEscrowDispute } from '@/features/rentals/web3/escrowFlow';
import { useWeb3Context } from '@/providers/Web3Provider';
import { useResolveAdminDisputeMutation } from '../mutations';

interface AdminDisputeResolveFormProps {
  rental: Rental;
}

function isWei(value: string) {
  return /^[0-9]+$/.test(value);
}

function formatWeiAsEth(value: string, minFractionDigits = 0) {
  if (!isWei(value)) return '-';

  const wei = BigInt(value);
  const weiPerEth = BigInt('1000000000000000000');
  const integer = wei / weiPerEth;
  const fraction = wei % weiPerEth;

  if (fraction === BigInt(0)) {
    return integer.toString();
  }

  let fractionText = fraction.toString().padStart(18, '0').replace(/0+$/, '');
  if (fractionText.length < minFractionDigits) {
    fractionText = fractionText.padEnd(minFractionDigits, '0');
  }

  return `${integer.toString()}.${fractionText}`;
}

export function AdminDisputeResolveForm({ rental }: AdminDisputeResolveFormProps) {
  const [ownerAmountWei, setOwnerAmountWei] = useState(rental.shipping_fee_wei);
  const [renterAmountWei, setRenterAmountWei] = useState(rental.deposit_wei);
  const [hasAdminRole, setHasAdminRole] = useState(false);
  const [checkingAdminRole, setCheckingAdminRole] = useState(false);
  const { mutateAsync, isPending } = useResolveAdminDisputeMutation();
  const { addToast } = useToast();
  const { account, isConnected, isConfiguredChain } = useWeb3Context();

  const hasOnchainRental = rental.onchain_rental_id !== undefined && rental.onchain_rental_id !== null;
  const totalLockedWei = useMemo(
    () => (BigInt(rental.deposit_wei || '0') + BigInt(rental.shipping_fee_wei || '0')).toString(),
    [rental.deposit_wei, rental.shipping_fee_wei],
  );
  const totalLockedEth = useMemo(() => formatWeiAsEth(totalLockedWei, 3), [totalLockedWei]);
  const splitTotalWei = useMemo(() => {
    if (!isWei(ownerAmountWei) || !isWei(renterAmountWei)) return '';
    return (BigInt(ownerAmountWei) + BigInt(renterAmountWei)).toString();
  }, [ownerAmountWei, renterAmountWei]);
  const splitTotalEth = useMemo(
    () => (splitTotalWei ? formatWeiAsEth(splitTotalWei, 3) : '-'),
    [splitTotalWei],
  );
  const isOnchainResolveBlocked =
    hasOnchainRental && (!isConnected || !isConfiguredChain || checkingAdminRole || !hasAdminRole);

  useEffect(() => {
    let cancelled = false;

    if (!hasOnchainRental || !account || !isConfiguredChain) {
      setHasAdminRole(false);
      setCheckingAdminRole(false);
      return;
    }

    setCheckingAdminRole(true);
    hasEscrowAdminRole(account)
      .then((result) => {
        if (!cancelled) setHasAdminRole(result);
      })
      .catch(() => {
        if (!cancelled) setHasAdminRole(false);
      })
      .finally(() => {
        if (!cancelled) setCheckingAdminRole(false);
      });

    return () => {
      cancelled = true;
    };
  }, [account, hasOnchainRental, isConfiguredChain]);

  const resolveOnchain = async () => {
    if (!rental.onchain_rental_id) return;

    if (isOnchainResolveBlocked) {
      addToast('에스크로 ADMIN_ROLE 권한이 있는 지갑으로 연결해야 온체인 정산을 진행할 수 있습니다.', 'error');
      return;
    }

    if (!isWei(ownerAmountWei) || !isWei(renterAmountWei)) {
      addToast('정산 금액은 wei 단위 숫자만 입력할 수 있습니다.', 'error');
      return;
    }

    const splitTotal = BigInt(ownerAmountWei) + BigInt(renterAmountWei);
    if (splitTotal !== BigInt(totalLockedWei)) {
      addToast('소유자/대여자 정산 금액 합계가 총 예치 금액과 일치해야 합니다.', 'error');
      return;
    }

    try {
      const result = await resolveEscrowDispute(
        rental.onchain_rental_id,
        ownerAmountWei,
        renterAmountWei,
      );
      await mutateAsync({
        rentalId: rental.id,
        data: {
          rental_status: RentalStatus.COMPLETED,
          return_tx_hash: result.txHash,
          onchain_status: 'Completed',
        },
      });
      addToast('온체인 분쟁 정산이 완료되었습니다.', 'success');
    } catch (error) {
      const parsed = parseAxiosError(error);
      addToast(parsed.message, 'error');
    }
  };

  return (
    <div className="space-y-6">
      {hasOnchainRental ? (
        <div
          className={`rounded-lg border p-4 ${
            isOnchainResolveBlocked
              ? 'border-primary-blue-3/20 bg-primary-blue-3/5'
              : 'border-border bg-bg-light-3'
          }`}
        >
          <div className="mb-4 flex items-center gap-2 font-bold text-text-dark">
            <LinkIcon className="h-4 w-4" />
            온체인 분쟁 정산
          </div>
          {isOnchainResolveBlocked && (
            <p className="mb-4 text-sm text-text-gray">
              온체인 대여 분쟁은 에스크로 ADMIN_ROLE 권한이 있는 지갑으로 온체인 정산을 완료해야
              DB 상태를 종료할 수 있습니다. <br/>
              {checkingAdminRole
                ? ' 권한을 확인하는 중입니다.'
                : !isConnected
                  ? ' 먼저 지갑을 연결해주세요.'
                  : !isConfiguredChain
                    ? ' 설정된 네트워크로 전환해주세요.'
                    : ' 현재 연결된 지갑에는 에스크로 관리자 권한이 없습니다.'}
            </p>
          )}
          <div className="grid gap-3 sm:grid-cols-2">
            <label className="text-sm font-semibold text-text-dark">
              소유자 정산 금액(wei)
              <input
                value={ownerAmountWei}
                onChange={(event) => setOwnerAmountWei(event.target.value)}
                disabled={isOnchainResolveBlocked}
                className="mt-2 w-full rounded-lg border border-border bg-bg-light-1 px-3 py-2 font-mono text-sm outline-none focus:border-primary-blue-3"
              />
              <span className="mt-1 block font-mono text-xs font-normal text-text-gray">
                = {formatWeiAsEth(ownerAmountWei)} ETH
              </span>
            </label>
            <label className="text-sm font-semibold text-text-dark">
              대여자 정산 금액(wei)
              <input
                value={renterAmountWei}
                onChange={(event) => setRenterAmountWei(event.target.value)}
                disabled={isOnchainResolveBlocked}
                className="mt-2 w-full rounded-lg border border-border bg-bg-light-1 px-3 py-2 font-mono text-sm outline-none focus:border-primary-blue-3"
              />
              <span className="mt-1 block font-mono text-xs font-normal text-text-gray">
                = {formatWeiAsEth(renterAmountWei)} ETH
              </span>
            </label>
          </div>
          <p className="mt-2 font-mono text-xs text-text-gray">
            정산 합계: {splitTotalEth} ETH = {splitTotalWei || '-'} wei
          </p>
          <p className="mt-2 font-mono text-xs text-text-gray">
            총 예치 금액: {totalLockedEth} ETH = {totalLockedWei} wei
          </p>
          <Button
            type="button"
            className={
              isOnchainResolveBlocked
                ? 'mt-4 border border-primary-blue-3/20 bg-primary-blue-3/10 text-primary-blue-3 shadow-none hover:bg-primary-blue-3/10'
                : 'mt-4'
            }
            loading={isPending || checkingAdminRole}
            disabled={isOnchainResolveBlocked}
            onClick={resolveOnchain}
          >
            <CheckCircle2 className="h-4 w-4" />
            온체인 정산 후 완료
          </Button>
        </div>
      ) : (
        <p className="rounded-lg border border-border bg-bg-light-3 p-4 text-sm text-text-gray">
          오프체인 대여 분쟁은 에스크로 관리 탭에서 DB 상태를 변경할 수 있습니다.
        </p>
      )}
    </div>
  );
}
