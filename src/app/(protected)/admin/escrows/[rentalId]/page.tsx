import { PageHeader } from '@/components/common/PageHeader';
import { AdminEscrowDetailView } from '@/features/admin/components/AdminEscrowDetailView';

export default async function AdminEscrowDetailPage({
  params,
}: {
  params: Promise<{ rentalId: string }>;
}) {
  const { rentalId } = await params;
  const numericRentalId = Number(rentalId);

  return (
    <>
      <PageHeader
        title="에스크로 상세"
        description="대여 정보, 온체인 에스크로 상태를 확인합니다."
      />
      <AdminEscrowDetailView rentalId={numericRentalId} />
    </>
  );
}
