import { PageHeader } from '@/components/common/PageHeader';
import { AdminUserDetailView } from '@/features/admin/components/AdminUserDetailView';

export default async function AdminUserDetailPage({
  params,
}: {
  params: Promise<{ userId: string }>;
}) {
  const { userId } = await params;
  const numericUserId = Number(userId);

  return (
    <>
      <PageHeader title="회원 상세" description="회원 정보와 상태를 확인합니다." />
      <AdminUserDetailView userId={numericUserId} />
    </>
  );
}
