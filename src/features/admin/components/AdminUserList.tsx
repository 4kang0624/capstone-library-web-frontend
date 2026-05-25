'use client';

import Link from 'next/link';
import { UserRound } from 'lucide-react';
import { EmptyState } from '@/components/common/EmptyState';
import { ErrorState } from '@/components/common/ErrorState';
import { LoadingState } from '@/components/common/LoadingState';
import { Badge } from '@/components/ui/Badge';
import { ROUTES } from '@/constants/routes';
import { formatDate } from '@/lib/format/date';
import { UserStatus } from '@/types/enums';
import { useAdminUsers } from '../queries';
import { USER_ROLE_LABEL, USER_STATUS_LABEL } from '../constants';

const STATUS_VARIANT: Record<UserStatus, 'success' | 'warning' | 'error'> = {
  [UserStatus.ACTIVE]: 'success',
  [UserStatus.SUSPENDED]: 'warning',
  [UserStatus.DELETED]: 'error',
};

export function AdminUserList() {
  const { data: users = [], isLoading, isError, refetch } = useAdminUsers();

  if (isLoading) return <LoadingState text="회원 목록을 불러오는 중..." />;

  if (isError) {
    return <ErrorState message="회원 목록을 불러오지 못했습니다." onRetry={() => refetch()} />;
  }

  if (users.length === 0) {
    return <EmptyState icon={<UserRound />} title="회원이 없습니다" description="등록된 회원이 없습니다." />;
  }

  return (
    <div className="overflow-hidden rounded-lg border border-border bg-bg-light-1">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-border text-sm">
          <thead className="bg-bg-light-3 text-left text-xs font-semibold uppercase text-text-gray">
            <tr>
              <th className="px-4 py-3">ID</th>
              <th className="px-4 py-3">회원</th>
              <th className="px-4 py-3">역할</th>
              <th className="px-4 py-3">상태</th>
              <th className="px-4 py-3">지갑</th>
              <th className="px-4 py-3">가입일</th>
              <th className="px-4 py-3 text-right">관리</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {users.map((user) => (
              <tr key={user.id} className="hover:bg-bg-light-2">
                <td className="whitespace-nowrap px-4 py-3 font-mono text-text-gray">{user.id}</td>
                <td className="px-4 py-3">
                  <div className="font-semibold text-text-dark">{user.nickname}</div>
                  <div className="text-xs text-text-gray">{user.email}</div>
                </td>
                <td className="whitespace-nowrap px-4 py-3 text-text-medium">
                  {USER_ROLE_LABEL[user.role] ?? user.role}
                </td>
                <td className="whitespace-nowrap px-4 py-3">
                  <Badge variant={STATUS_VARIANT[user.status] ?? 'default'}>
                    {USER_STATUS_LABEL[user.status] ?? user.status}
                  </Badge>
                </td>
                <td className="whitespace-nowrap px-4 py-3 font-mono text-xs text-text-gray">
                  {user.wallet_address ? `${user.wallet_address.slice(0, 8)}...` : '미연결'}
                </td>
                <td className="whitespace-nowrap px-4 py-3 text-text-gray">
                  {formatDate(user.created_at)}
                </td>
                <td className="whitespace-nowrap px-4 py-3 text-right">
                  <Link
                    href={ROUTES.ADMIN_USER_DETAIL(user.id)}
                    className="font-semibold text-primary-blue-3 hover:text-primary-blue-5"
                  >
                    상세
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
