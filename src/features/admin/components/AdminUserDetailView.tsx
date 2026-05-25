'use client';

import Link from 'next/link';
import { ArrowLeft, WalletCards } from 'lucide-react';
import { ErrorState } from '@/components/common/ErrorState';
import { LoadingState } from '@/components/common/LoadingState';
import { Badge } from '@/components/ui/Badge';
import { ROUTES } from '@/constants/routes';
import { formatDateTime } from '@/lib/format/date';
import { UserStatus } from '@/types/enums';
import { USER_ROLE_LABEL, USER_STATUS_LABEL } from '../constants';
import { useAdminUser } from '../queries';
import { AdminUserStatusForm } from './AdminUserStatusForm';

const STATUS_VARIANT: Record<UserStatus, 'success' | 'warning' | 'error'> = {
  [UserStatus.ACTIVE]: 'success',
  [UserStatus.SUSPENDED]: 'warning',
  [UserStatus.DELETED]: 'error',
};

interface AdminUserDetailViewProps {
  userId: number;
}

export function AdminUserDetailView({ userId }: AdminUserDetailViewProps) {
  const { data: user, isLoading, isError, refetch } = useAdminUser(userId);

  if (isLoading) return <LoadingState text="회원 정보를 불러오는 중..." />;

  if (isError || !user) {
    return <ErrorState message="회원 정보를 불러오지 못했습니다." onRetry={() => refetch()} />;
  }

  return (
    <div className="space-y-6">
      <Link
        href={ROUTES.ADMIN_USERS}
        className="inline-flex items-center gap-2 text-sm font-semibold text-text-gray hover:text-text-dark"
      >
        <ArrowLeft className="h-4 w-4" />
        회원 목록
      </Link>

      <section className="rounded-lg border border-border bg-bg-light-1 p-5">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <h2 className="text-2xl font-bold text-text-dark">{user.nickname}</h2>
            <p className="mt-1 text-sm text-text-gray">{user.email}</p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Badge variant="primary">{USER_ROLE_LABEL[user.role] ?? user.role}</Badge>
            <Badge variant={STATUS_VARIANT[user.status] ?? 'default'}>
              {USER_STATUS_LABEL[user.status] ?? user.status}
            </Badge>
          </div>
        </div>

        <dl className="mt-6 grid gap-4 sm:grid-cols-2">
          <div>
            <dt className="text-xs font-semibold uppercase text-text-gray">회원 ID</dt>
            <dd className="mt-1 font-mono text-sm text-text-dark">{user.id}</dd>
          </div>
          <div>
            <dt className="text-xs font-semibold uppercase text-text-gray">가입일</dt>
            <dd className="mt-1 text-sm text-text-dark">{formatDateTime(user.created_at)}</dd>
          </div>
          <div>
            <dt className="text-xs font-semibold uppercase text-text-gray">최근 수정</dt>
            <dd className="mt-1 text-sm text-text-dark">{formatDateTime(user.updated_at)}</dd>
          </div>
          <div>
            <dt className="text-xs font-semibold uppercase text-text-gray">지갑 주소</dt>
            <dd className="mt-1 flex items-center gap-2 break-all font-mono text-xs text-text-dark">
              <WalletCards className="h-4 w-4 flex-shrink-0 text-text-gray" />
              {user.wallet_address ?? '미연결'}
            </dd>
          </div>
        </dl>
      </section>

      <section className="rounded-lg border border-border bg-bg-light-1 p-5">
        <h3 className="mb-4 text-lg font-bold text-text-dark">회원 상태 변경</h3>
        <AdminUserStatusForm userId={user.id} currentStatus={user.status} />
      </section>
    </div>
  );
}
