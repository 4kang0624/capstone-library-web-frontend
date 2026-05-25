'use client';

import { useMemo, useState } from 'react';
import type { FormEvent } from 'react';
import { CheckCircle2, LinkIcon } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { useToast } from '@/hooks/useToast';
import { parseAxiosError } from '@/lib/api/errors';
import { RentalStatus, RentalStatusLabel } from '@/types/enums';
import type { Rental } from '@/features/rentals/types';
import { resolveEscrowDispute } from '@/features/rentals/web3/escrowFlow';
import { ADMIN_DISPUTE_RESULT_OPTIONS } from '../constants';
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
  const [resultStatus, setResultStatus] = useState<RentalStatus>(RentalStatus.COMPLETED);
  const [ownerAmountWei, setOwnerAmountWei] = useState(rental.shipping_fee_wei);
  const [renterAmountWei, setRenterAmountWei] = useState(rental.deposit_wei);
  const { mutateAsync, isPending } = useResolveAdminDisputeMutation();
  const { addToast } = useToast();

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

  const resolveOffchain = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    try {
      await mutateAsync({
        rentalId: rental.id,
        data: { rental_status: resultStatus },
      });
      addToast('분쟁 상태가 변경되었습니다.', 'success');
    } catch (error) {
      const parsed = parseAxiosError(error);
      addToast(parsed.message, 'error');
    }
  };

  const resolveOnchain = async () => {
    if (!rental.onchain_rental_id) return;

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
      {hasOnchainRental && (
        <div className="rounded-lg border border-border bg-bg-light-3 p-4">
          <div className="mb-4 flex items-center gap-2 font-bold text-text-dark">
            <LinkIcon className="h-4 w-4" />
            온체인 분쟁 정산
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            <label className="text-sm font-semibold text-text-dark">
              소유자 정산 금액(wei)
              <input
                value={ownerAmountWei}
                onChange={(event) => setOwnerAmountWei(event.target.value)}
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
            className="mt-4"
            loading={isPending}
            onClick={resolveOnchain}
          >
            <CheckCircle2 className="h-4 w-4" />
            온체인 정산 후 완료
          </Button>
        </div>
      )}

      <form onSubmit={resolveOffchain} className="rounded-lg border border-border bg-bg-light-3 p-4">
        <label className="block text-sm font-semibold text-text-dark">
          오프체인 처리 결과
          <select
            value={resultStatus}
            onChange={(event) => setResultStatus(event.target.value as RentalStatus)}
            className="mt-2 w-full rounded-lg border border-border bg-bg-light-1 px-3 py-2 text-sm outline-none focus:border-primary-blue-3"
          >
            {ADMIN_DISPUTE_RESULT_OPTIONS.map((status) => (
              <option key={status} value={status}>
                {RentalStatusLabel[status] ?? status}
              </option>
            ))}
          </select>
        </label>
        <Button type="submit" variant="outlined" className="mt-4" loading={isPending}>
          오프체인 상태 변경
        </Button>
      </form>
    </div>
  );
}
