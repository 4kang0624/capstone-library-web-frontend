'use client';
import { useAuth } from '@/hooks/useAuth';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { UserRole } from '@/types/enums';
import { PageHeader } from '@/components/common/PageHeader';

export default function AdminPage() {
  const { user, isAuthenticated } = useAuth();
  const router = useRouter();
  useEffect(() => {
    if (isAuthenticated && user?.role !== UserRole.ADMIN) {
      router.replace('/library');
    }
  }, [isAuthenticated, user, router]);

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <PageHeader title="관리자 패널" description="사용자 및 도서 관리" />
      <div className="bg-white rounded-2xl border border-border p-6">
        <p className="text-text-gray">관리자 기능이 여기에 표시됩니다.</p>
      </div>
    </div>
  );
}