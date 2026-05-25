'use client';

import { ROUTES } from '@/constants';
import { useEffect } from 'react';
import { LoginForm } from '@/features/auth/components/LoginForm';
import Link from 'next/link';
import { useAuth } from '@/hooks/useAuth';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const { isAuthenticated } = useAuth();
    const router = useRouter();
  
    useEffect(() => {
      if (isAuthenticated) {
        router.push(ROUTES.LIBRARY);
      }
    }, [isAuthenticated, router]);

  return (
    <div className="min-h-[calc(100vh-8rem)] flex items-center justify-center py-12 px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link href="/" className="text-3xl font-bold text-primary-blue-3">BookChain</Link>
          <h2 className="mt-4 text-2xl font-bold text-text-dark">로그인</h2>
          <p className="mt-2 text-text-gray">계정에 로그인하여 서비스를 이용하세요</p>
        </div>
        <div className="bg-bg-light-2 rounded-2xl border border-border-light p-8">
          <LoginForm />
        </div>
      </div>
    </div>
  );
}
