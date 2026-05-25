'use client';

import { use, useState } from 'react';
import { useRental } from '@/features/rentals/queries';
import {
  useApproveRentalMutation,
  useRejectRentalMutation,
  useCancelRentalMutation,
  useReturnRentalMutation,
} from '@/features/rentals/mutations';
import { LoadingState } from '@/components/common/LoadingState';
import { EmptyState } from '@/components/common/EmptyState';
import { RentalStatusBadge } from '@/components/common/StatusBadge';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { RentalOnchainPanel } from '@/features/rentals/components/RentalOnchainPanel';
import { useAuth } from '@/hooks/useAuth';
import { RentalStatus } from '@/types/enums';
import { formatDate } from '@/lib/format/date';
import { formatWei } from '@/lib/format/eth';
import { BLOCKCHAIN_EXPLORER_URL } from '@/constants';

const getExplorerEntityUrl = (entity: 'address' | 'tx', value?: string): string | null => {
  if (!value || !BLOCKCHAIN_EXPLORER_URL) return null;
  const baseUrl = BLOCKCHAIN_EXPLORER_URL.replace(/\/+$/, '');
  return `${baseUrl}/${entity}/${value}`;
};

const WEI_PER_ETH = BigInt('1000000000000000000');
const weiPattern = /^\d+$/;

const isWeiInput = (value: string) => weiPattern.test(value.trim());

const formatWeiInputAsEth = (value: string) => {
  const trimmed = value.trim();
  if (!trimmed) return undefined;
  if (!isWeiInput(trimmed)) return '숫자만 입력해주세요.';

  const wei = BigInt(trimmed);
  const whole = wei / WEI_PER_ETH;
  const fraction = wei % WEI_PER_ETH;

  if (fraction === BigInt(0)) return `= ${whole.toLocaleString('ko-KR')} ETH`;

  const fractionText = fraction.toString().padStart(18, '0').replace(/0+$/, '');
  return `= ${whole.toLocaleString('ko-KR')}.${fractionText} ETH`;
};

export default function RentalDetailPage({ params }: { params: Promise<{ rentalId: string }> }) {
  const { rentalId } = use(params);
  const id = parseInt(rentalId);

  const { data: rental, isLoading } = useRental(id);
  const { user } = useAuth();
  const { mutateAsync: approve, isPending: approving } = useApproveRentalMutation();
  const { mutateAsync: reject, isPending: rejecting } = useRejectRentalMutation();
  const { mutateAsync: cancel, isPending: cancelling } = useCancelRentalMutation();
  const { mutateAsync: returnRental, isPending: returning } = useReturnRentalMutation();
  const [depositWei, setDepositWei] = useState('');
  const [shippingFeeWei, setShippingFeeWei] = useState('');
  const [dueDateOverride, setDueDateOverride] = useState<string | null>(null);
  const [approvalError, setApprovalError] = useState<string | null>(null);

  if (isLoading) return <LoadingState />;
  if (!rental) return <EmptyState title="대여 정보를 찾을 수 없습니다" />;

  const isBorrower = rental.borrower_user_id === user?.id;
  const isLender = rental.lender_user_id === user?.id;
  const hasOnchainRental = rental.onchain_rental_id !== undefined && rental.onchain_rental_id !== null;
  const contractExplorerUrl = getExplorerEntityUrl('address', rental.contract_address);
  const txExplorerUrl = getExplorerEntityUrl('tx', rental.tx_hash);
  const returnTxExplorerUrl = getExplorerEntityUrl('tx', rental.return_tx_hash);
  const dueDate = dueDateOverride ?? rental.due_date?.split('T')[0] ?? '';
  const canApprove =
    isWeiInput(depositWei) && isWeiInput(shippingFeeWei) && dueDate.trim().length > 0;

  const handleApprove = async () => {
    if (!canApprove) {
      setApprovalError('보증금, 배송비, 반납 예정일을 모두 입력해주세요.');
      return;
    }

    setApprovalError(null);
    await approve({
      rentalId: rental.id,
      data: {
        deposit_wei: depositWei.trim(),
        shipping_fee_wei: shippingFeeWei.trim(),
        due_date: dueDate,
      },
    });
  };

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8 text-editorial-ink">
      <div className="flex items-center gap-3 mb-6">
        <h1 className="text-3xl font-bold text-editorial-ink">대여 #{rental.id}</h1>
        <RentalStatusBadge status={rental.rental_status} />
      </div>

      <div className="bg-editorial-panel-soft rounded-2xl border border-editorial-line p-6 mb-4 shadow-[0_12px_30px_rgba(36,32,24,0.06)]">
        <h2 className="text-lg font-bold text-editorial-ink mb-4">대여 정보</h2>
        <dl className="grid grid-cols-2 gap-3 text-sm">
          <div>
            <dt className="text-text-gray">신청일</dt>
            <dd className="font-semibold text-text-dark">{formatDate(rental.requested_at)}</dd>
          </div>
          {rental.due_date && (
            <div>
              <dt className="text-text-gray">반납 예정일</dt>
              <dd className="font-semibold text-text-dark">{formatDate(rental.due_date)}</dd>
            </div>
          )}
          <div>
            <dt className="text-text-gray">배송 방법</dt>
            <dd className="font-semibold text-text-dark">{rental.delivery_method}</dd>
          </div>
          {rental.shipping_address && (
            <div className="col-span-2">
              <dt className="text-text-gray">배송 주소</dt>
              <dd className="font-semibold text-text-dark">{rental.shipping_address}</dd>
            </div>
          )}
        </dl>
      </div>

      <div className="bg-editorial-panel-soft rounded-2xl border border-editorial-line p-6 mb-6 shadow-[0_12px_30px_rgba(36,32,24,0.06)]">
        <h2 className="text-lg font-bold text-editorial-ink mb-4">에스크로 정보</h2>
        <dl className="grid grid-cols-2 gap-3 text-sm">
          <div>
            <dt className="text-text-gray">보증금</dt>
            <dd className="font-semibold text-text-dark">{formatWei(rental.deposit_wei)}</dd>
          </div>
          <div>
            <dt className="text-text-gray">배송비</dt>
            <dd className="font-semibold text-text-dark">{formatWei(rental.shipping_fee_wei)}</dd>
          </div>
          {rental.contract_address && (
            <div className="col-span-2">
              <dt className="text-text-gray">컨트랙트 주소</dt>
              <dd className="font-mono text-xs text-text-dark break-all">
                {contractExplorerUrl ? (
                  <a
                    href={contractExplorerUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="underline decoration-text-light underline-offset-2 hover:text-primary"
                  >
                    {rental.contract_address}
                  </a>
                ) : (
                  rental.contract_address
                )}
              </dd>
            </div>
          )}
          {rental.tx_hash && (
            <div className="col-span-2">
              <dt className="text-text-gray">대여 트랜잭션</dt>
              <dd className="font-mono text-xs text-text-dark break-all">
                {txExplorerUrl ? (
                  <a
                    href={txExplorerUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="underline decoration-text-light underline-offset-2 hover:text-primary"
                  >
                    {rental.tx_hash}
                  </a>
                ) : (
                  rental.tx_hash
                )}
              </dd>
            </div>
          )}
          {rental.return_tx_hash && (
            <div className="col-span-2">
              <dt className="text-text-gray">반납 트랜잭션</dt>
              <dd className="font-mono text-xs text-text-dark break-all">
                {returnTxExplorerUrl ? (
                  <a
                    href={returnTxExplorerUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="underline decoration-text-light underline-offset-2 hover:text-primary"
                  >
                    {rental.return_tx_hash}
                  </a>
                ) : (
                  rental.return_tx_hash
                )}
              </dd>
            </div>
          )}
        </dl>
      </div>

      <RentalOnchainPanel rental={rental} isBorrower={isBorrower} isLender={isLender} />

      <div className="flex flex-col gap-4">
        {isLender && !hasOnchainRental && rental.rental_status === RentalStatus.REQUESTED && (
          <div className="bg-editorial-panel-soft rounded-2xl border border-editorial-line p-6 shadow-[0_12px_30px_rgba(36,32,24,0.06)]">
            <h2 className="text-lg font-bold text-editorial-ink mb-4">대여 승인</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
              <Input
                label="보증금"
                type="number"
                min="0"
                step="1"
                value={depositWei}
                onChange={(event) => setDepositWei(event.target.value)}
                placeholder="wei 단위"
                helperText={formatWeiInputAsEth(depositWei)}
              />
              <Input
                label="배송비"
                type="number"
                min="0"
                step="1"
                value={shippingFeeWei}
                onChange={(event) => setShippingFeeWei(event.target.value)}
                placeholder="wei 단위"
                helperText={formatWeiInputAsEth(shippingFeeWei)}
              />
              <Input
                label="반납 예정일"
                type="date"
                value={dueDate}
                onChange={(event) => setDueDateOverride(event.target.value)}
                className="sm:col-span-2"
              />
            </div>
            {approvalError && <p className="text-sm text-error mb-3">{approvalError}</p>}
            <div className="flex gap-3 flex-wrap">
              <Button onClick={handleApprove} loading={approving} disabled={!canApprove}>
                승인
              </Button>
              <Button variant="danger" onClick={() => reject(rental.id)} loading={rejecting}>거절</Button>
            </div>
          </div>
        )}
        {isBorrower && !hasOnchainRental && rental.rental_status === RentalStatus.REQUESTED && (
          <Button variant="outlined" onClick={() => cancel(rental.id)} loading={cancelling}>취소</Button>
        )}
        {isBorrower && !hasOnchainRental && rental.rental_status === RentalStatus.BORROWING && (
          <Button onClick={() => returnRental(rental.id)} loading={returning}>반납 신청</Button>
        )}
      </div>
    </div>
  );
}
