'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { loginSchema, type LoginFormValues } from '../schemas';
import { useLoginMutation } from '../mutations';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { ROUTES } from '@/constants/routes';

export function LoginForm() {
  const router = useRouter();
  const { mutateAsync, isPending, error } = useLoginMutation();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({ resolver: zodResolver(loginSchema) });

  const onSubmit = async (values: LoginFormValues) => {
    try {
      await mutateAsync(values);
      router.push(ROUTES.LIBRARY);
    } catch {
      // error shown below
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
        type="password"
        placeholder="비밀번호를 입력하세요"
        {...register('password')}
        error={errors.password?.message}
      />
      {error && (
        <p className="text-sm text-[#F44336] text-center">
          {(error as Error).message || '로그인에 실패했습니다.'}
        </p>
      )}
      <Button type="submit" loading={isPending} fullWidth className="mt-2">
        로그인
      </Button>
      <p className="text-center text-sm text-[#6B7684]">
        계정이 없으신가요?{' '}
        <Link href={ROUTES.SIGNUP} className="text-[#3182F6] font-semibold hover:underline">
          회원가입
        </Link>
      </p>
    </form>
  );
}
