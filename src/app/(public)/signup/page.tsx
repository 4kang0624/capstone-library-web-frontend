'use client';

import { ROUTES } from '@/constants';
import { useEffect } from 'react';
import { SignupForm } from '@/features/auth/components/SignupForm';
import Link from 'next/link';
import { useAuth } from '@/hooks/useAuth';
import { useRouter } from 'next/navigation';

export default function SignupPage() {
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
          <Link href="/" className="text-3xl font-bold text-primary">BookChain</Link>
          <h2 className="mt-4 text-2xl font-bold text-text-dark">회원가입</h2>
          <p className="mt-2 text-text-gray">BookChain에서 새로운 독서 경험을 시작하세요</p>
        </div>
        <div className="bg-white rounded-2xl border border-border p-8">
          <SignupForm />
        </div>
      </div>
    </div>
  );
}
