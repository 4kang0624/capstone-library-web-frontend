'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { AppShell } from '@/components/layout/AppShell';
import { LoadingState } from '@/components/common/LoadingState';
import { ROUTES } from '@/constants/routes';

export default function ProtectedLayout({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.replace(ROUTES.LOGIN);
    }
  }, [isAuthenticated, isLoading, router]);

  if (isLoading) return <LoadingState />;
  if (!isAuthenticated) return null;

  return <AppShell>{children}</AppShell>;
}
