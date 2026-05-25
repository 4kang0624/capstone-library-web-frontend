import { PageHeader } from '@/components/common/PageHeader';
import { AdminDisputeDetailView } from '@/features/admin/components/AdminDisputeDetailView';

export default async function AdminDisputeDetailPage({
  params,
}: {
  params: Promise<{ rentalId: string }>;
}) {
  const { rentalId } = await params;
  const numericRentalId = Number(rentalId);

  return (
    <>
      <PageHeader title="분쟁 상세" description="대여 정보, 분쟁 사유, 온체인 상태를 확인합니다." />
      <AdminDisputeDetailView rentalId={numericRentalId} />
    </>
  );
}
