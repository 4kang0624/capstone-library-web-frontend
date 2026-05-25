'use client';

import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useWeb3Context } from '@/providers/Web3Provider';
import { PageHeader } from '@/components/common/PageHeader';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { shortenAddress } from '@/lib/format/eth';
import { useMutation } from '@tanstack/react-query';
import { usersApi } from '@/features/users/api';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

const profileSchema = z.object({ nickname: z.string().min(1, '닉네임을 입력하세요') });
const passwordSchema = z.object({
  current_password: z.string().min(1),
  new_password: z.string().min(8, '8자 이상'),
});

export default function ProfilePage() {
  const { user, refreshUser } = useAuth();
  const { account, isConnected, connectWallet, disconnectWallet } = useWeb3Context();

  const { mutateAsync: updateProfile, isPending: saving } = useMutation({
    mutationFn: usersApi.updateMe,
    onSuccess: () => refreshUser(),
  });
  const { mutateAsync: updatePassword, isPending: changingPw } = useMutation({
    mutationFn: usersApi.updatePassword,
  });

  const profileForm = useForm({ resolver: zodResolver(profileSchema), defaultValues: { nickname: user?.nickname ?? '' } });
  const pwForm = useForm({ resolver: zodResolver(passwordSchema) });

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <PageHeader title="프로필" description="계정 정보를 관리하세요" />

      {/* Profile */}
      <div className="bg-bg-light-1 rounded-2xl border border-border-light p-6 mb-4">
        <h2 className="text-lg font-bold text-text-dark mb-4">기본 정보</h2>
        <form onSubmit={profileForm.handleSubmit((v) => updateProfile(v))} className="flex flex-col gap-4">
          <Input label="이메일" value={user?.email ?? ''} disabled />
          <Input
            label="닉네임"
            {...profileForm.register('nickname')}
            error={profileForm.formState.errors.nickname?.message}
          />
          <Button type="submit" loading={saving} size="sm" className="self-end">저장</Button>
        </form>
      </div>

      {/* Wallet */}
      <div className="bg-bg-light-1 rounded-2xl border border-border-light p-6 mb-4">
        <h2 className="text-lg font-bold text-text-dark mb-4">Web3 지갑</h2>
        {isConnected && account ? (
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-text-gray mb-1">연결된 지갑</p>
              <p className="font-mono font-bold text-text-dark">{shortenAddress(account)}</p>
            </div>
            <Button variant="outlined" size="sm" onClick={disconnectWallet}>연결 해제</Button>
          </div>
        ) : (
          <div className="flex items-center justify-between">
            <p className="text-text-gray">지갑이 연결되지 않았습니다</p>
            <Button size="sm" onClick={connectWallet}>MetaMask 연결</Button>
          </div>
        )}
      </div>

      {/* Password */}
      <div className="bg-bg-light-1 rounded-2xl border border-border-light p-6">
        <h2 className="text-lg font-bold text-text-dark mb-4">비밀번호 변경</h2>
        <form
          onSubmit={pwForm.handleSubmit((v) => updatePassword(v))}
          className="flex flex-col gap-4"
        >
          <Input
            label="현재 비밀번호"
            type="password"
            {...pwForm.register('current_password')}
            error={pwForm.formState.errors.current_password?.message}
          />
          <Input
            label="새 비밀번호"
            type="password"
            {...pwForm.register('new_password')}
            error={pwForm.formState.errors.new_password?.message}
          />
          <Button type="submit" loading={changingPw} size="sm" className="self-end">변경</Button>
        </form>
      </div>
    </div>
  );
}