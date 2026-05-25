import { PageHeader } from '@/components/common/PageHeader';
import { AdminEscrowList } from '@/features/admin/components/AdminEscrowList';

export default function AdminEscrowsPage() {
  return (
    <>
      <PageHeader
        title="에스크로 관리"
        description="온체인 연동된 모든 대여의 에스크로 상태를 확인합니다."
      />
      <AdminEscrowList />
    </>
  );
}
