'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { signupSchema, type SignupFormValues } from '../schemas';
import { useAuth } from '@/hooks/useAuth';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { ROUTES } from '@/constants/routes';
import { useState } from 'react';

export function SignupForm() {
  const router = useRouter();
  const { signup } = useAuth();
  const [isSigningUp, setIsSigningUp] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
  } = useForm<SignupFormValues>({ resolver: zodResolver(signupSchema) });

  const onSubmit = async (values: SignupFormValues) => {
    try {
      setIsSigningUp(true);
      await signup(values.email, values.password, values.nickname);
      router.push(ROUTES.LIBRARY);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : '회원가입에 실패했습니다.';
      setError('root', { message });
    } finally {
      setIsSigningUp(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
      <Input
        label="닉네임"
        placeholder="닉네임을 입력하세요"
        {...register('nickname')}
        error={errors.nickname?.message}
      />
      <Input
        label="이메일"
        type="email"
        placeholder="이메일을 입력하세요"
        {...register('email')}
        error={errors.email?.message}
      />
      <Input
        label="비밀번호"
        type="password"
        placeholder="비밀번호를 입력하세요"
        {...register('password')}
        error={errors.password?.message}
      />
      {errors.root && (
        <p className="text-sm text-error text-center">{errors.root.message}</p>
      )}
      <Button type="submit" loading={isSigningUp} fullWidth className="mt-2">
        회원가입
      </Button>
      <p className="text-center text-sm text-text-gray">
        이미 계정이 있으신가요?{' '}
        <Link href={ROUTES.LOGIN} className="text-primary font-semibold hover:underline">
          로그인
        </Link>
      </p>
    </form>
  );
}
