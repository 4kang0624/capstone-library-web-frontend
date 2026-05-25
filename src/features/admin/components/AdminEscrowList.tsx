'use client';

import Link from 'next/link';
import { Coins } from 'lucide-react';
import { EmptyState } from '@/components/common/EmptyState';
import { ErrorState } from '@/components/common/ErrorState';
import { LoadingState } from '@/components/common/LoadingState';
import { RentalStatusBadge } from '@/components/common/StatusBadge';
import { ROUTES } from '@/constants/routes';
import { formatDateTime } from '@/lib/format/date';
import { weiToEth } from '@/lib/format/eth';
import type { Rental } from '@/features/rentals/types';
import { useAdminEscrows } from '../queries';

function getBookTitle(rental: Rental) {
  return rental.book_title ?? rental.title ?? rental.book?.title ?? `도서 #${rental.book_id}`;
}

function getNickname(rental: Rental, type: 'lender' | 'borrower') {
  if (type === 'lender')
    return rental.lender_nickname ?? rental.lender?.nickname ?? `회원 #${rental.lender_user_id}`;
  return (
    rental.borrower_nickname ?? rental.borrower?.nickname ?? `회원 #${rental.borrower_user_id}`
  );
}

function totalEth(rental: Rental): string {
  const total =
    BigInt(rental.deposit_wei || '0') + BigInt(rental.shipping_fee_wei || '0');
  return weiToEth(total.toString()).toFixed(6);
}

export function AdminEscrowList() {
  const { data: escrows = [], isLoading, isError, refetch } = useAdminEscrows();

  if (isLoading) return <LoadingState text="에스크로 목록을 불러오는 중..." />;

  if (isError) {
    return <ErrorState message="에스크로 목록을 불러오지 못했습니다." onRetry={() => refetch()} />;
  }

  if (escrows.length === 0) {
    return (
      <EmptyState
        icon={<Coins />}
        title="온체인 연동 대여가 없습니다"
        description="onchain_rental_id가 있는 대여가 없습니다."
      />
    );
  }

  return (
    <div className="space-y-3">
      {escrows.map((rental) => (
        <Link
          key={rental.id}
          href={ROUTES.ADMIN_ESCROW_DETAIL(rental.id)}
          className="block rounded-lg border border-border bg-bg-light-1 p-5 transition-colors hover:bg-bg-light-2"
        >
          <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h2 className="text-lg font-bold text-text-dark">{getBookTitle(rental)}</h2>
                <RentalStatusBadge status={rental.rental_status} />
              </div>
              <p className="mt-1 text-sm text-text-gray">
                대여 #{rental.id} · 온체인 #{rental.onchain_rental_id ?? '-'} · 소유자{' '}
                {getNickname(rental, 'lender')} · 대여자 {getNickname(rental, 'borrower')}
              </p>
            </div>
            <div className="shrink-0 text-right text-sm text-text-gray">
              <div>{formatDateTime(rental.updated_at)}</div>
              <div className="mt-1 font-semibold text-text-dark">
                총 {totalEth(rental)} ETH
              </div>
            </div>
          </div>

          <div className="mt-3 flex flex-wrap gap-3 text-xs text-text-gray">
            <span>sync: {rental.sync_status}</span>
            {rental.onchain_status && <span>온체인: {rental.onchain_status}</span>}
            {rental.dispute_reason && (
              <span className="text-yellow-600">분쟁: {rental.dispute_reason.slice(0, 40)}{rental.dispute_reason.length > 40 ? '…' : ''}</span>
            )}
          </div>
        </Link>
      ))}
    </div>
  );
}
