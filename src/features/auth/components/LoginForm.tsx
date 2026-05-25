'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { loginSchema, type LoginFormValues } from '../schemas';
import { useAuth } from '@/hooks/useAuth';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { ROUTES } from '@/constants/routes';
import { useState } from 'react';
import { Eye, EyeOff, AlertCircle } from 'lucide-react';

export function LoginForm() {
  const router = useRouter();
  const { login } = useAuth();
  const [isPending, setPending] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({ resolver: zodResolver(loginSchema) });

  const onSubmit = async (values: LoginFormValues) => {
    try {
      setPending(true);
      setError(null);
      await login(values.email, values.password);
      router.push(ROUTES.LIBRARY);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('로그인에 실패했습니다.'));
    } finally {
      setPending(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
      <Input
        label="이메일"
        type="email"
        placeholder="이메일을 입력하세요"
        {...register('email')}
        error={errors.email?.message}
      />
      <Input
        label="비밀번호"
        type={showPassword ? 'text' : 'password'}
        placeholder="비밀번호를 입력하세요"
        {...register('password')}
        error={errors.password?.message}
        endAdornment={
          <button
            type="button"
            onClick={() => setShowPassword((v) => !v)}
            className="flex items-center justify-center text-text-gray hover:text-text-dark transition-colors"
            tabIndex={-1}
          >
            {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
          </button>
        }
      />
      {error && (
        <div className="flex items-start gap-2 rounded-xl bg-error-light border border-error/30 px-4 py-3">
          <AlertCircle className="w-4 h-4 text-error mt-0.5 shrink-0" />
          <p className="text-sm text-error">{error.message}</p>
        </div>
      )}
      <Button type="submit" loading={isPending} fullWidth className="mt-2">
        로그인
      </Button>
      <p className="text-center text-sm text-text-gray">
        계정이 없으신가요?{' '}
        <Link href={ROUTES.SIGNUP} className="text-primary-blue-3 font-semibold hover:underline">
          회원가입
        </Link>
      </p>
    </form>
  );
}
