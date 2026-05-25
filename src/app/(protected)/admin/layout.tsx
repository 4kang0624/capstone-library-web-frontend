'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { LoadingState } from '@/components/common/LoadingState';
import { ROUTES } from '@/constants/routes';
import { AdminNav } from '@/components/ui';
import { useAuth } from '@/hooks/useAuth';
import { UserRole } from '@/types/enums';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { user, isLoading, isAuthenticated } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && isAuthenticated && user?.role !== UserRole.ADMIN) {
      router.replace(ROUTES.LIBRARY);
    }
  }, [isAuthenticated, isLoading, router, user]);

  if (isLoading) return <LoadingState />;
  if (!isAuthenticated || user?.role !== UserRole.ADMIN) return null;

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
      <AdminNav />
      {children}
    </div>
  );
}
