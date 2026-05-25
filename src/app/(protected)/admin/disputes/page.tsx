import { PageHeader } from '@/components/common/PageHeader';
import { AdminDisputeList } from '@/features/admin/components/AdminDisputeList';

export default function AdminDisputesPage() {
  return (
    <>
      <PageHeader title="분쟁 관리" description="DISPUTED 상태의 대여를 확인하고 처리합니다." />
      <AdminDisputeList />
    </>
  );
}
