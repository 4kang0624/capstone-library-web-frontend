import { LoginForm } from '@/features/auth/components/LoginForm';
import Link from 'next/link';

export default function LoginPage() {
  return (
    <div className="min-h-[calc(100vh-8rem)] flex items-center justify-center py-12 px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link href="/" className="text-3xl font-bold text-[#3182F6]">BookChain</Link>
          <h2 className="mt-4 text-2xl font-bold text-[#191F28]">로그인</h2>
          <p className="mt-2 text-[#6B7684]">계정에 로그인하여 서비스를 이용하세요</p>
        </div>
        <div className="bg-white rounded-2xl border border-[#E5E8EB] p-8">
          <LoginForm />
        </div>
      </div>
    </div>
  );
}
