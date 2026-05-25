import { PageHeader } from '@/components/common/PageHeader';
import { AdminUserList } from '@/features/admin/components/AdminUserList';

export default function AdminUsersPage() {
  return (
    <>
      <PageHeader title="회원 관리" description="회원 목록을 확인하고 상태를 관리합니다." />
      <AdminUserList />
    </>
  );
}
