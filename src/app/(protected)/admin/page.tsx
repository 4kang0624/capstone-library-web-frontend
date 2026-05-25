import Link from 'next/link';
import { AlertTriangle, Users } from 'lucide-react';
import { PageHeader } from '@/components/common/PageHeader';
import { ROUTES } from '@/constants/routes';

export default function AdminPage() {
  return (
    <>
      <PageHeader title="관리자 패널" description="회원 상태와 대여 분쟁을 관리합니다." />
      <div className="grid gap-4 sm:grid-cols-2">
        <Link
          href={ROUTES.ADMIN_USERS}
          className="rounded-lg border border-border bg-bg-light-1 p-5 transition-colors hover:bg-bg-light-2"
        >
          <Users className="mb-4 h-6 w-6 text-primary-blue-3" />
          <h2 className="text-lg font-bold text-text-dark">회원 관리</h2>
          <p className="mt-2 text-sm text-text-gray">회원 목록과 상세 정보, 상태를 확인합니다.</p>
        </Link>
        <Link
          href={ROUTES.ADMIN_DISPUTES}
          className="rounded-lg border border-border bg-bg-light-1 p-5 transition-colors hover:bg-bg-light-2"
        >
          <AlertTriangle className="mb-4 h-6 w-6 text-error" />
          <h2 className="text-lg font-bold text-text-dark">분쟁 관리</h2>
          <p className="mt-2 text-sm text-text-gray">DISPUTED 상태의 대여를 확인하고 처리합니다.</p>
        </Link>
      </div>
    </>
  );
}
