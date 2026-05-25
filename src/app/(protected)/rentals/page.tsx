'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { BookOpen, Package, Users, Clock, AlertTriangle } from 'lucide-react';
import { useMyRentals } from '@/features/rentals/queries';
import { PageHeader } from '@/components/common/PageHeader';
import { LoadingState } from '@/components/common/LoadingState';
import { EmptyState } from '@/components/common/EmptyState';
import { RentalStatusBadge } from '@/components/common/StatusBadge';
import { Tabs } from '@/components/ui/Tabs';
import { ROUTES } from '@/constants/routes';
import { RentalStatus, RentalStatusLabel, DeliveryMethod, DeliveryMethodLabel } from '@/types/enums';
import { formatDate, formatRelativeDate } from '@/lib/format/date';
import type { Rental } from '@/features/rentals/types';
import { useAuth } from '@/hooks/useAuth';
import { cn } from '@/lib/utils/cn';

const STATUS_BORDER: Record<RentalStatus, string> = {
  [RentalStatus.REQUESTED]: 'border-l-info',
  [RentalStatus.APPROVED]: 'border-l-purple',
  [RentalStatus.REJECTED]: 'border-l-error',
  [RentalStatus.CANCELLED]: 'border-l-border',
  [RentalStatus.BORROWING]: 'border-l-warning',
  [RentalStatus.RETURNED]: 'border-l-success',
  [RentalStatus.COMPLETED]: 'border-l-success',
  [RentalStatus.DISPUTED]: 'border-l-error',
};

function getDueDateInfo(dueDate?: string, status?: RentalStatus) {
  if (!dueDate || status !== RentalStatus.BORROWING) return null;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const due = new Date(dueDate);
  due.setHours(0, 0, 0, 0);
  const diffDays = Math.ceil((due.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
  if (diffDays < 0) return { label: `반납 ${Math.abs(diffDays)}일 초과`, urgent: true };
  if (diffDays === 0) return { label: 'D-Day', urgent: true };
  if (diffDays <= 3) return { label: `D-${diffDays} 마감 임박`, urgent: true };
  if (diffDays <= 7) return { label: `D-${diffDays}`, urgent: false, warn: true };
  return null;
}

function RentalCard({ rental, userId }: { rental: Rental; userId?: number }) {
  const isBorrower = rental.borrower_user_id === userId;
  const dueDateInfo = getDueDateInfo(rental.due_date, rental.rental_status);

  return (
    <Link href={ROUTES.RENTAL_DETAIL(rental.id)}>
      <div
        className={cn(
          'bg-bg-light-2 rounded-2xl border border-border border-l-4 px-5 py-4 shadow-[0_12px_30px_rgba(36,32,24,0.06)] hover:shadow-[0_16px_38px_rgba(36,32,24,0.1)] hover:-translate-y-0.5 transition-all group',
          STATUS_BORDER[rental.rental_status] ?? 'border-l-border',
        )}
      >
        <div className="flex items-start justify-between gap-4">
          {/* Left: info */}
          <div className="flex-1 min-w-0">
            {/* Role + ID */}
            <div className="flex items-center gap-2 mb-2">
              <span
                className={cn(
                  'inline-flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-full',
                  isBorrower
                    ? 'bg-success/10 text-success-dark'
                    : 'bg-bg-light-1 text-text-gray',
                )}
              >
                {isBorrower ? (
                  <><BookOpen className="w-3 h-3" />빌린 책</>
                ) : (
                  <><Users className="w-3 h-3" />빌려준 책</>
                )}
              </span>
              <span className="text-xs text-text-light">대여 #{rental.id}</span>
            </div>

            {/* Book ref */}
            <p className="font-bold text-text-dark text-[15px] mb-2 group-hover:text-orange transition-colors">
              도서 #{rental.book_id}
              <span className="text-xs font-normal text-text-gray ml-1.5">복사본 #{rental.book_copy_id}</span>
            </p>

            {/* Meta row */}
            <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-text-gray">
              <span className="inline-flex items-center gap-1">
                <Clock className="w-3 h-3 shrink-0" />
                신청 {formatRelativeDate(rental.requested_at)}
              </span>
              {rental.delivery_method && (
                <span className="inline-flex items-center gap-1 bg-bg-light-1 border border-border/70 px-2 py-0.5 rounded-full font-medium text-text-gray">
                  <Package className="w-3 h-3 shrink-0" />
                  {DeliveryMethodLabel[rental.delivery_method as DeliveryMethod] ?? rental.delivery_method}
                </span>
              )}
              {dueDateInfo && (
                <span
                  className={cn(
                    'inline-flex items-center gap-1 font-semibold',
                    dueDateInfo.urgent ? 'text-error' : 'text-warning-dark',
                  )}
                >
                  <AlertTriangle className="w-3 h-3 shrink-0" />
                  {dueDateInfo.label}
                </span>
              )}
            </div>
          </div>

          {/* Right: status + due date */}
          <div className="flex flex-col items-end gap-2 shrink-0">
            <RentalStatusBadge status={rental.rental_status} />
            {rental.due_date && rental.rental_status === RentalStatus.BORROWING && (
              <span className="text-xs text-text-gray whitespace-nowrap">
                반납 예정 {formatDate(rental.due_date)}
              </span>
            )}
            {rental.returned_at && (
              <span className="text-xs text-text-gray whitespace-nowrap">
                반납 {formatRelativeDate(rental.returned_at)}
              </span>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
}

const STATUS_FILTER_OPTIONS: { label: string; value: RentalStatus | 'all' }[] = [
  { label: '전체', value: 'all' },
  { label: '승인 대기', value: RentalStatus.REQUESTED },
  { label: '대여중', value: RentalStatus.BORROWING },
  { label: '승인됨', value: RentalStatus.APPROVED },
  { label: '완료', value: RentalStatus.COMPLETED },
  { label: '반납됨', value: RentalStatus.RETURNED },
  { label: '취소됨', value: RentalStatus.CANCELLED },
  { label: '거절됨', value: RentalStatus.REJECTED },
  { label: '분쟁중', value: RentalStatus.DISPUTED },
];

const SORT_OPTIONS = [
  { label: '최신순', value: 'latest' },
  { label: '오래된순', value: 'oldest' },
  { label: '마감 임박순', value: 'due' },
];

const ACTIVE_STATUSES = new Set([RentalStatus.REQUESTED, RentalStatus.APPROVED, RentalStatus.BORROWING]);

export default function RentalsPage() {
  const [tab, setTab] = useState('all');
  const [statusFilter, setStatusFilter] = useState<RentalStatus | 'all'>('all');
  const [sort, setSort] = useState('latest');
  const { data: rentals = [], isLoading } = useMyRentals();
  const { user } = useAuth();

  const userId = user?.id;

  const tabFiltered = useMemo(
    () =>
      rentals.filter((r) => {
        if (tab === 'borrowing') return r.borrower_user_id === userId;
        if (tab === 'lending') return r.lender_user_id === userId;
        return true;
      }),
    [rentals, tab, userId],
  );

  const statusCounts = useMemo(() => {
    const counts: Partial<Record<RentalStatus | 'all', number>> = { all: tabFiltered.length };
    tabFiltered.forEach((r) => {
      counts[r.rental_status] = (counts[r.rental_status] ?? 0) + 1;
    });
    return counts;
  }, [tabFiltered]);

  const statusFiltered = useMemo(
    () => (statusFilter === 'all' ? tabFiltered : tabFiltered.filter((r) => r.rental_status === statusFilter)),
    [tabFiltered, statusFilter],
  );

  const sorted = useMemo(
    () =>
      [...statusFiltered].sort((a, b) => {
        if (sort === 'oldest')
          return new Date(a.requested_at).getTime() - new Date(b.requested_at).getTime();
        if (sort === 'due') {
          const aMs = a.due_date ? new Date(a.due_date).getTime() : Infinity;
          const bMs = b.due_date ? new Date(b.due_date).getTime() : Infinity;
          return aMs - bMs;
        }
        return new Date(b.requested_at).getTime() - new Date(a.requested_at).getTime();
      }),
    [statusFiltered, sort],
  );

  const activeCount = rentals.filter((r) => ACTIVE_STATUSES.has(r.rental_status)).length;
  const borrowingCount = rentals.filter((r) => r.borrower_user_id === userId).length;
  const lendingCount = rentals.filter((r) => r.lender_user_id === userId).length;

  const tabs = [
    { label: '전체', value: 'all', count: rentals.length },
    { label: '빌린 책', value: 'borrowing', count: borrowingCount },
    { label: '빌려준 책', value: 'lending', count: lendingCount },
  ];

  const handleTabChange = (v: string) => {
    setTab(v);
    setStatusFilter('all');
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 text-text-dark">
      <PageHeader title="대여 내역" description="대여 및 대출 현황을 확인하세요" />

      {/* Active rentals banner */}
      {!isLoading && activeCount > 0 && (
        <div className="mb-5 bg-text-dark border border-orange/40 rounded-xl px-4 py-3 flex items-center gap-2 text-sm text-bg-light-1 font-medium">
          <BookOpen className="w-4 h-4 shrink-0" />
          현재 진행 중인 대여&nbsp;<strong>{activeCount}건</strong>이 있습니다
        </div>
      )}

      <Tabs tabs={tabs} value={tab} onChange={handleTabChange} className="mb-5" />

      {/* Status filter chips */}
      <div className="flex flex-wrap gap-2 mb-4">
        {STATUS_FILTER_OPTIONS.filter(
          (o) => (statusCounts[o.value] ?? 0) > 0 || o.value === 'all',
        ).map((opt) => (
          <button
            key={opt.value}
            onClick={() => setStatusFilter(opt.value)}
            className={cn(
              'px-3 py-1 rounded-full text-xs font-semibold border transition-colors',
              statusFilter === opt.value
                ? 'bg-orange text-bg-light-1 border-orange'
                : 'bg-bg-light-2 text-text-gray border-border hover:border-orange/50',
            )}
          >
            {opt.label}
            {statusCounts[opt.value] !== undefined && statusCounts[opt.value]! > 0 && (
              <span className="ml-1 opacity-70">{statusCounts[opt.value]}</span>
            )}
          </button>
        ))}
      </div>

      {/* Result count + sort */}
      <div className="flex items-center justify-between mb-3">
        <p className="text-sm text-text-gray">총 {sorted.length}건</p>
        <div className="flex gap-1">
          {SORT_OPTIONS.map((opt) => (
            <button
              key={opt.value}
              onClick={() => setSort(opt.value)}
              className={cn(
                'px-3 py-1 text-xs font-semibold rounded-lg transition-colors',
                sort === opt.value
                  ? 'bg-text-dark text-bg-light-1'
                  : 'text-text-gray hover:bg-bg-light-2',
              )}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      {isLoading ? (
        <LoadingState />
      ) : sorted.length === 0 ? (
        <EmptyState
          icon={<BookOpen className="w-10 h-10" />}
          title="대여 내역이 없습니다"
          description={
            statusFilter !== 'all'
              ? `'${RentalStatusLabel[statusFilter as RentalStatus]}' 상태의 내역이 없습니다`
              : '아직 대여 내역이 없습니다'
          }
        />
      ) : (
        <div className="flex flex-col gap-3">
          {sorted.map((rental) => (
            <RentalCard key={rental.id} rental={rental} userId={userId} />
          ))}
        </div>
      )}
    </div>
  );
}
