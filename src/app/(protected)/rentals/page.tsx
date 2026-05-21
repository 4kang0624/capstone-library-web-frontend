'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useMyRentals } from '@/features/rentals/queries';
import { PageHeader } from '@/components/common/PageHeader';
import { LoadingState } from '@/components/common/LoadingState';
import { EmptyState } from '@/components/common/EmptyState';
import { RentalStatusBadge } from '@/components/common/StatusBadge';
import { Tabs } from '@/components/ui/Tabs';
import { ROUTES } from '@/constants/routes';
import { RentalStatus } from '@/types/enums';
import { formatDate } from '@/lib/format/date';
import type { Rental } from '@/features/rentals/types';
import { useAuth } from '@/hooks/useAuth';

const tabs = [
  { label: '전체', value: 'all' },
  { label: '빌린 책', value: 'borrowing' },
  { label: '빌려준 책', value: 'lending' },
];

function RentalCard({ rental, userId }: { rental: Rental; userId?: number }) {
  const isBorrower = rental.borrower_user_id === userId;
  return (
    <Link href={ROUTES.RENTAL_DETAIL(rental.id)}>
      <div className="bg-white rounded-2xl border border-border p-5 hover:shadow-md hover:-translate-y-0.5 transition-all">
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs text-text-gray">#{rental.id} · {isBorrower ? '빌린 책' : '빌려준 책'}</span>
          <RentalStatusBadge status={rental.rental_status} />
        </div>
        <p className="font-bold text-text-dark mb-1">대여 #{rental.id}</p>
        <p className="text-sm text-text-gray">신청일: {formatDate(rental.requested_at)}</p>
        {rental.due_date && (
          <p className="text-sm text-text-gray">반납 예정: {formatDate(rental.due_date)}</p>
        )}
      </div>
    </Link>
  );
}

export default function RentalsPage() {
  const [tab, setTab] = useState('all');
  const { data: rentals = [], isLoading } = useMyRentals();
  const { user } = useAuth();

  const filtered = rentals.filter((r) => {
    if (tab === 'borrowing') return r.borrower_user_id === user?.id;
    if (tab === 'lending') return r.lender_user_id === user?.id;
    return true;
  });

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <PageHeader title="대여 내역" description="대여 및 대출 현황을 확인하세요" />
      <Tabs tabs={tabs} value={tab} onChange={setTab} className="mb-6" />

      {isLoading ? (
        <LoadingState />
      ) : filtered.length === 0 ? (
        <EmptyState title="대여 내역이 없습니다" />
      ) : (
        <div className="flex flex-col gap-3">
          {filtered.map((rental) => (
            <RentalCard key={rental.id} rental={rental} userId={user?.id} />
          ))}
        </div>
      )}
    </div>
  );
}