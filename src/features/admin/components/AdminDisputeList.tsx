'use client';

import Link from 'next/link';
import { AlertTriangle } from 'lucide-react';
import { EmptyState } from '@/components/common/EmptyState';
import { ErrorState } from '@/components/common/ErrorState';
import { LoadingState } from '@/components/common/LoadingState';
import { RentalStatusBadge } from '@/components/common/StatusBadge';
import { ROUTES } from '@/constants/routes';
import { formatDateTime } from '@/lib/format/date';
import type { Rental } from '@/features/rentals/types';
import { useAdminDisputes } from '../queries';

function getBookTitle(rental: Rental) {
  return rental.book_title ?? rental.title ?? rental.book?.title ?? `도서 #${rental.book_id}`;
}

function getNickname(rental: Rental, type: 'lender' | 'borrower') {
  if (type === 'lender') return rental.lender_nickname ?? rental.lender?.nickname ?? `회원 #${rental.lender_user_id}`;
  return rental.borrower_nickname ?? rental.borrower?.nickname ?? `회원 #${rental.borrower_user_id}`;
}

export function AdminDisputeList() {
  const { data: disputes = [], isLoading, isError, refetch } = useAdminDisputes();

  if (isLoading) return <LoadingState text="분쟁 목록을 불러오는 중..." />;

  if (isError) {
    return <ErrorState message="분쟁 목록을 불러오지 못했습니다." onRetry={() => refetch()} />;
  }

  if (disputes.length === 0) {
    return (
      <EmptyState
        icon={<AlertTriangle />}
        title="진행 중인 분쟁이 없습니다"
        description="DISPUTED 상태의 대여가 없습니다."
      />
    );
  }

  return (
    <div className="space-y-3">
      {disputes.map((rental) => (
        <Link
          key={rental.id}
          href={ROUTES.ADMIN_DISPUTE_DETAIL(rental.id)}
          className="block rounded-lg border border-border bg-bg-light-1 p-5 transition-colors hover:bg-bg-light-2"
        >
          <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h2 className="text-lg font-bold text-text-dark">{getBookTitle(rental)}</h2>
                <RentalStatusBadge status={rental.rental_status} />
              </div>
              <p className="mt-1 text-sm text-text-gray">
                대여 #{rental.id} · 소유자 {getNickname(rental, 'lender')} · 대여자{' '}
                {getNickname(rental, 'borrower')}
              </p>
            </div>
            <div className="text-sm text-text-gray">{formatDateTime(rental.updated_at)}</div>
          </div>

          <p className="mt-4 line-clamp-2 rounded-lg bg-bg-light-3 px-3 py-2 text-sm text-text-medium">
            {rental.dispute_reason || '분쟁 사유가 등록되지 않았습니다.'}
          </p>
        </Link>
      ))}
    </div>
  );
}
