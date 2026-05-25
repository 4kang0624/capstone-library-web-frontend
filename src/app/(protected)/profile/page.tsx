'use client';

import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useWeb3Context } from '@/providers/Web3Provider';
import { PageHeader } from '@/components/common/PageHeader';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { ConfirmDialog } from '@/components/common/ConfirmDialog';
import { shortenAddress } from '@/lib/format/eth';
import { useMutation } from '@tanstack/react-query';
import { usersApi } from '@/features/users/api';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useToast } from '@/hooks/useToast';
import { Copy, Check, Eye, EyeOff } from 'lucide-react';

const profileSchema = z.object({ nickname: z.string().min(1, '닉네임을 입력하세요') });
const passwordSchema = z.object({
  current_password: z.string().min(1),
  new_password: z.string().min(8, '8자 이상'),
});

export default function ProfilePage() {
  const { user, refreshUser, logout } = useAuth();
  const { account, isConnected, connectWallet, disconnectWallet } = useWeb3Context();
  const { addToast } = useToast();
  const [copied, setCopied] = useState(false);
  const [showCurrentPw, setShowCurrentPw] = useState(false);
  const [showNewPw, setShowNewPw] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const { mutateAsync: updateProfile, isPending: saving } = useMutation({
    mutationFn: usersApi.updateMe,
    onSuccess: () => {
      refreshUser();
      addToast('프로필이 저장되었습니다.', 'success');
    },
    onError: () => addToast('프로필 저장에 실패했습니다.', 'error'),
  });
  const { mutateAsync: updatePassword, isPending: changingPw } = useMutation({
    mutationFn: usersApi.updatePassword,
    onSuccess: () => {
      pwForm.reset();
      addToast('비밀번호가 변경되었습니다.', 'success');
    },
    onError: () => addToast('비밀번호 변경에 실패했습니다.', 'error'),
  });
  const { mutateAsync: deleteAccount, isPending: deleting } = useMutation({
    mutationFn: usersApi.deleteMe,
    onSuccess: () => {
      addToast('회원 탈퇴가 완료되었습니다.', 'success');
      logout();
    },
    onError: () => addToast('회원 탈퇴에 실패했습니다.', 'error'),
  });

  const profileForm = useForm({ resolver: zodResolver(profileSchema), defaultValues: { nickname: user?.nickname ?? '' } });
  const pwForm = useForm({ resolver: zodResolver(passwordSchema) });

  const handleCopy = () => {
    if (!account) return;
    navigator.clipboard.writeText(account);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <PageHeader title="프로필" description="계정 정보를 관리하세요" />

      {/* Profile */}
      <div className="bg-bg-light-2 rounded-2xl border border-border-light p-6 mb-4">
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
      <div className="bg-bg-light-2 rounded-2xl border border-border-light p-6 mb-4">
        <h2 className="text-lg font-bold text-text-dark mb-4">Web3 지갑</h2>
        {isConnected && account ? (
          <div className="flex items-center justify-between gap-4">
            <div className="min-w-0">
              <p className="text-sm text-text-gray mb-1">연결된 지갑</p>
              <p className="font-mono font-bold text-text-dark">{shortenAddress(account)}</p>
              <p className="font-mono text-xs text-text-light mt-0.5 break-all">{account}</p>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <button
                type="button"
                onClick={handleCopy}
                className="p-2 rounded-lg hover:bg-bg-light-4 transition-colors text-text-gray hover:text-text-dark"
                title="주소 복사"
              >
                {copied ? <Check className="w-4 h-4 text-success" /> : <Copy className="w-4 h-4" />}
              </button>
              <Button variant="outlined" size="sm" onClick={disconnectWallet}>연결 해제</Button>
            </div>
          </div>
        ) : (
          <div className="flex items-center justify-between">
            <p className="text-text-gray">지갑이 연결되지 않았습니다</p>
            <Button size="sm" onClick={connectWallet}>MetaMask 연결</Button>
          </div>
        )}
      </div>

      {/* Password */}
      <div className="bg-bg-light-2 rounded-2xl border border-border-light p-6">
        <h2 className="text-lg font-bold text-text-dark mb-4">비밀번호 변경</h2>
        <form
          onSubmit={pwForm.handleSubmit((v) => updatePassword(v))}
          className="flex flex-col gap-4"
        >
          <Input
            label="현재 비밀번호"
            type={showCurrentPw ? 'text' : 'password'}
            {...pwForm.register('current_password')}
            error={pwForm.formState.errors.current_password?.message}
            endAdornment={
              <button
                type="button"
                onClick={() => setShowCurrentPw((v) => !v)}
                className="flex items-center justify-center text-text-gray hover:text-text-dark transition-colors"
                tabIndex={-1}
              >
                {showCurrentPw ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            }
          />
          <Input
            label="새 비밀번호"
            type={showNewPw ? 'text' : 'password'}
            {...pwForm.register('new_password')}
            error={pwForm.formState.errors.new_password?.message}
            endAdornment={
              <button
                type="button"
                onClick={() => setShowNewPw((v) => !v)}
                className="flex items-center justify-center text-text-gray hover:text-text-dark transition-colors"
                tabIndex={-1}
              >
                {showNewPw ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            }
          />
          <Button type="submit" loading={changingPw} size="sm" className="self-end">변경</Button>
        </form>
      </div>

      {/* Account Deletion */}
      <div className="bg-bg-light-2 rounded-2xl border border-error/30 p-6 mt-4">
        <h2 className="text-lg font-bold text-error mb-2">회원 탈퇴</h2>
        <p className="text-sm text-text-gray mb-4">
          탈퇴 시 계정 및 모든 데이터가 삭제되며 복구할 수 없습니다.
        </p>
        <Button variant="danger" size="sm" onClick={() => setShowDeleteConfirm(true)}>
          탈퇴하기
        </Button>
      </div>

      <ConfirmDialog
        open={showDeleteConfirm}
        onClose={() => setShowDeleteConfirm(false)}
        onConfirm={() => deleteAccount()}
        title="회원 탈퇴"
        message="정말로 탈퇴하시겠습니까? 계정 및 모든 데이터가 삭제되며 복구할 수 없습니다."
        confirmLabel="탈퇴"
        loading={deleting}
        danger
      />
    </div>
  );
}