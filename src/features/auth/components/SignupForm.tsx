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
import { Eye, EyeOff, AlertCircle } from 'lucide-react';
import axios from 'axios';

export function SignupForm() {
  const router = useRouter();
  const { signup } = useAuth();
  const [isSigningUp, setIsSigningUp] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

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
      if (axios.isAxiosError(err) && err.response?.data?.code === 'AUTH_SIGNUP_DUPLICATE_EMAIL') {
        setError('email', { message: '이미 가입한 이메일입니다.' });
      } else {
        const message =
          axios.isAxiosError(err) && err.response?.data?.message
            ? err.response.data.message
            : err instanceof Error
              ? err.message
              : '회원가입에 실패했습니다.';
        setError('root', { message });
      }
    } finally {
      setIsSigningUp(false);
    }
  };

  return (
    <form method="post" onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
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
        type={showPassword ? 'text' : 'password'}
        placeholder="비밀번호를 입력하세요 (8자 이상)"
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
      <Input
        label="비밀번호 확인"
        type={showConfirmPassword ? 'text' : 'password'}
        placeholder="비밀번호를 다시 입력하세요"
        {...register('confirm_password')}
        error={errors.confirm_password?.message}
        endAdornment={
          <button
            type="button"
            onClick={() => setShowConfirmPassword((v) => !v)}
            className="flex items-center justify-center text-text-gray hover:text-text-dark transition-colors"
            tabIndex={-1}
          >
            {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
          </button>
        }
      />
      {errors.root && (
        <div className="flex items-start gap-2 rounded-xl bg-error-light border border-error/30 px-4 py-3">
          <AlertCircle className="w-4 h-4 text-error mt-0.5 shrink-0" />
          <p className="text-sm text-error">{errors.root.message}</p>
        </div>
      )}
      <Button type="submit" loading={isSigningUp} fullWidth className="mt-2">
        회원가입
      </Button>
      <p className="text-center text-sm text-text-gray">
        이미 계정이 있으신가요?{' '}
        <Link href={ROUTES.LOGIN} className="text-primary-blue-3 font-semibold hover:underline">
          로그인
        </Link>
      </p>
    </form>
  );
}
