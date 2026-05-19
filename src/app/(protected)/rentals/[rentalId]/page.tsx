'use client';

import { use } from 'react';
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
import { useAuth } from '@/hooks/useAuth';
import { RentalStatus } from '@/types/enums';
import { formatDate } from '@/lib/format/date';
import { formatWei } from '@/lib/format/eth';

export default function RentalDetailPage({ params }: { params: Promise<{ rentalId: string }> }) {
  const { rentalId } = use(params);
  const id = parseInt(rentalId);

  const { data: rental, isLoading } = useRental(id);
  const { user } = useAuth();
  const { mutateAsync: approve, isPending: approving } = useApproveRentalMutation();
  const { mutateAsync: reject, isPending: rejecting } = useRejectRentalMutation();
  const { mutateAsync: cancel, isPending: cancelling } = useCancelRentalMutation();
  const { mutateAsync: returnRental, isPending: returning } = useReturnRentalMutation();

  if (isLoading) return <LoadingState />;
  if (!rental) return <EmptyState title="대여 정보를 찾을 수 없습니다" />;

  const isBorrower = rental.borrower_user_id === user?.id;
  const isLender = rental.lender_user_id === user?.id;

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex items-center gap-3 mb-6">
        <h1 className="text-3xl font-bold text-[#191F28]">대여 #{rental.id}</h1>
        <RentalStatusBadge status={rental.rental_status} />
      </div>

      <div className="bg-white rounded-2xl border border-[#E5E8EB] p-6 mb-4">
        <h2 className="text-lg font-bold text-[#191F28] mb-4">대여 정보</h2>
        <dl className="grid grid-cols-2 gap-3 text-sm">
          <div>
            <dt className="text-[#6B7684]">신청일</dt>
            <dd className="font-semibold text-[#191F28]">{formatDate(rental.requested_at)}</dd>
          </div>
          {rental.due_date && (
            <div>
              <dt className="text-[#6B7684]">반납 예정일</dt>
              <dd className="font-semibold text-[#191F28]">{formatDate(rental.due_date)}</dd>
            </div>
          )}
          <div>
            <dt className="text-[#6B7684]">배송 방법</dt>
            <dd className="font-semibold text-[#191F28]">{rental.delivery_method}</dd>
          </div>
          {rental.shipping_address && (
            <div className="col-span-2">
              <dt className="text-[#6B7684]">배송 주소</dt>
              <dd className="font-semibold text-[#191F28]">{rental.shipping_address}</dd>
            </div>
          )}
        </dl>
      </div>

      <div className="bg-white rounded-2xl border border-[#E5E8EB] p-6 mb-6">
        <h2 className="text-lg font-bold text-[#191F28] mb-4">에스크로 정보</h2>
        <dl className="grid grid-cols-2 gap-3 text-sm">
          <div>
            <dt className="text-[#6B7684]">보증금</dt>
            <dd className="font-semibold text-[#191F28]">{formatWei(rental.deposit_wei)}</dd>
          </div>
          <div>
            <dt className="text-[#6B7684]">배송비</dt>
            <dd className="font-semibold text-[#191F28]">{formatWei(rental.shipping_fee_wei)}</dd>
          </div>
          {rental.contract_address && (
            <div className="col-span-2">
              <dt className="text-[#6B7684]">컨트랙트 주소</dt>
              <dd className="font-mono text-xs text-[#191F28] break-all">{rental.contract_address}</dd>
            </div>
          )}
        </dl>
      </div>

      <div className="flex gap-3 flex-wrap">
        {isLender && rental.rental_status === RentalStatus.REQUESTED && (
          <>
            <Button onClick={() => approve(rental.id)} loading={approving}>승인</Button>
            <Button variant="danger" onClick={() => reject(rental.id)} loading={rejecting}>거절</Button>
          </>
        )}
        {isBorrower && rental.rental_status === RentalStatus.REQUESTED && (
          <Button variant="outlined" onClick={() => cancel(rental.id)} loading={cancelling}>취소</Button>
        )}
        {isBorrower && rental.rental_status === RentalStatus.BORROWING && (
          <Button onClick={() => returnRental(rental.id)} loading={returning}>반납 신청</Button>
        )}
      </div>
    </div>
  );
}