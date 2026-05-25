'use client';

import Link from 'next/link';
import { useState } from 'react';
import { ArrowLeft, RefreshCcw } from 'lucide-react';
import { ErrorState } from '@/components/common/ErrorState';
import { LoadingState } from '@/components/common/LoadingState';
import { RentalStatusBadge } from '@/components/common/StatusBadge';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { ROUTES } from '@/constants/routes';
import { formatDateTime } from '@/lib/format/date';
import { formatWei, shortenAddress } from '@/lib/format/eth';
import type { Rental } from '@/features/rentals/types';
import { getEscrowRental } from '@/features/rentals/web3/escrowFlow';
import type { OnchainRental } from '@/features/rentals/web3/escrowTypes';
import { RentalStatus } from '@/types/enums';
import { useToast } from '@/hooks/useToast';
import { parseAxiosError } from '@/lib/api/errors';
import { useAdminDispute } from '../queries';
import { AdminDisputeResolveForm } from './AdminDisputeResolveForm';

interface AdminDisputeDetailViewProps {
  rentalId: number;
}

function getBookTitle(rental: Rental) {
  return rental.book_title ?? rental.title ?? rental.book?.title ?? `도서 #${rental.book_id}`;
}

function getNickname(rental: Rental, type: 'lender' | 'borrower') {
  if (type === 'lender') return rental.lender_nickname ?? rental.lender?.nickname ?? `회원 #${rental.lender_user_id}`;
  return rental.borrower_nickname ?? rental.borrower?.nickname ?? `회원 #${rental.borrower_user_id}`;
}

function InfoItem({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <dt className="text-xs font-semibold uppercase text-text-gray">{label}</dt>
      <dd className="mt-1 break-words text-sm text-text-dark">{children}</dd>
    </div>
  );
}

export function AdminDisputeDetailView({ rentalId }: AdminDisputeDetailViewProps) {
  const { data: rental, isLoading, isError, refetch } = useAdminDispute(rentalId);
  const [onchainRental, setOnchainRental] = useState<OnchainRental | null>(null);
  const [loadingOnchain, setLoadingOnchain] = useState(false);
  const { addToast } = useToast();

  const refreshOnchain = async () => {
    if (!rental?.onchain_rental_id) return;

    setLoadingOnchain(true);
    try {
      const data = await getEscrowRental(rental.onchain_rental_id);
      setOnchainRental(data);
      addToast('온체인 상태를 확인했습니다.', 'success');
    } catch (error) {
      const parsed = parseAxiosError(error);
      addToast(parsed.message, 'error');
    } finally {
      setLoadingOnchain(false);
    }
  };

  if (isLoading) return <LoadingState text="분쟁 정보를 불러오는 중..." />;

  if (isError || !rental) {
    return <ErrorState message="분쟁 정보를 불러오지 못했습니다." onRetry={() => refetch()} />;
  }

  return (
    <div className="space-y-6">
      <Link
        href={ROUTES.ADMIN_DISPUTES}
        className="inline-flex items-center gap-2 text-sm font-semibold text-text-gray hover:text-text-dark"
      >
        <ArrowLeft className="h-4 w-4" />
        분쟁 목록
      </Link>

      <section className="rounded-lg border border-border bg-bg-light-1 p-5">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <h2 className="text-2xl font-bold text-text-dark">{getBookTitle(rental)}</h2>
            <p className="mt-1 text-sm text-text-gray">대여 #{rental.id}</p>
          </div>
          <RentalStatusBadge status={rental.rental_status} />
        </div>

        <dl className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <InfoItem label="도서 ID">{rental.book_id}</InfoItem>
          <InfoItem label="도서 복본 ID">{rental.book_copy_id}</InfoItem>
          <InfoItem label="요청일">{formatDateTime(rental.requested_at)}</InfoItem>
          <InfoItem label="소유자">
            {getNickname(rental, 'lender')} · #{rental.lender_user_id}
          </InfoItem>
          <InfoItem label="대여자">
            {getNickname(rental, 'borrower')} · #{rental.borrower_user_id}
          </InfoItem>
          <InfoItem label="반납 예정일">
            {rental.due_date ? formatDateTime(rental.due_date) : '없음'}
          </InfoItem>
          <InfoItem label="보증금">{formatWei(rental.deposit_wei)}</InfoItem>
          <InfoItem label="배송비">{formatWei(rental.shipping_fee_wei)}</InfoItem>
          <InfoItem label="동기화 상태">{rental.sync_status}</InfoItem>
        </dl>
      </section>

      <section className="rounded-lg border border-border bg-bg-light-1 p-5">
        <h3 className="mb-3 text-lg font-bold text-text-dark">분쟁 사유</h3>
        <p className="whitespace-pre-wrap rounded-lg bg-bg-light-3 p-4 text-sm text-text-medium">
          {rental.dispute_reason || '분쟁 사유가 등록되지 않았습니다.'}
        </p>
      </section>

      <section className="rounded-lg border border-border bg-bg-light-1 p-5">
        <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <h3 className="text-lg font-bold text-text-dark">온체인 상태</h3>
          {rental.onchain_rental_id && (
            <Button type="button" size="sm" variant="outlined" loading={loadingOnchain} onClick={refreshOnchain}>
              <RefreshCcw className="h-4 w-4" />
              상태 확인
            </Button>
          )}
        </div>

        <dl className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <InfoItem label="컨트랙트">{rental.contract_address ?? '없음'}</InfoItem>
          <InfoItem label="체인 ID">{rental.chain_id ?? '없음'}</InfoItem>
          <InfoItem label="온체인 대여 ID">{rental.onchain_rental_id ?? '없음'}</InfoItem>
          <InfoItem label="백엔드 온체인 상태">
            <Badge variant={rental.onchain_status ? 'info' : 'default'}>
              {rental.onchain_status ?? '없음'}
            </Badge>
          </InfoItem>
          <InfoItem label="요청 tx">{rental.tx_hash ?? '없음'}</InfoItem>
          <InfoItem label="정산 tx">{rental.return_tx_hash ?? '없음'}</InfoItem>
        </dl>

        {onchainRental && (
          <dl className="mt-5 grid gap-4 border-t border-border pt-5 sm:grid-cols-2 lg:grid-cols-3">
            <InfoItem label="실시간 상태">{onchainRental.statusLabel}</InfoItem>
            <InfoItem label="소유자 지갑">{shortenAddress(onchainRental.owner)}</InfoItem>
            <InfoItem label="대여자 지갑">{shortenAddress(onchainRental.renter)}</InfoItem>
            <InfoItem label="온체인 보증금">{formatWei(onchainRental.depositWei)}</InfoItem>
            <InfoItem label="온체인 배송비">{formatWei(onchainRental.shippingFeeWei)}</InfoItem>
            <InfoItem label="온체인 대여 ID">{onchainRental.rentalId}</InfoItem>
          </dl>
        )}
      </section>

      <section className="rounded-lg border border-border bg-bg-light-1 p-5">
        <h3 className="mb-4 text-lg font-bold text-text-dark">분쟁 처리</h3>
        {rental.rental_status === RentalStatus.DISPUTED ? (
          <AdminDisputeResolveForm rental={rental} />
        ) : (
          <p className="text-sm text-text-gray">이미 처리된 분쟁입니다.</p>
        )}
      </section>
    </div>
  );
}
