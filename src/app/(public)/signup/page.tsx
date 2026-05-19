import { SignupForm } from '@/features/auth/components/SignupForm';
import Link from 'next/link';

export default function SignupPage() {
  return (
    <div className="min-h-[calc(100vh-8rem)] flex items-center justify-center py-12 px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link href="/" className="text-3xl font-bold text-[#3182F6]">BookChain</Link>
          <h2 className="mt-4 text-2xl font-bold text-[#191F28]">회원가입</h2>
          <p className="mt-2 text-[#6B7684]">BookChain에서 새로운 독서 경험을 시작하세요</p>
        </div>
        <div className="bg-white rounded-2xl border border-[#E5E8EB] p-8">
          <SignupForm />
        </div>
      </div>
    </div>
  );
}
