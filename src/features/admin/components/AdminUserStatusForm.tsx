'use client';

import { useState } from 'react';
import type { FormEvent } from 'react';
import { Button } from '@/components/ui/Button';
import { useToast } from '@/hooks/useToast';
import { parseAxiosError } from '@/lib/api/errors';
import type { UserStatus } from '@/types/enums';
import { USER_STATUS_LABEL, USER_STATUS_OPTIONS } from '../constants';
import { useChangeUserStatusMutation } from '../mutations';

interface AdminUserStatusFormProps {
  userId: number;
  currentStatus: UserStatus;
}

export function AdminUserStatusForm({ userId, currentStatus }: AdminUserStatusFormProps) {
  const [status, setStatus] = useState<UserStatus>(currentStatus);
  const { mutateAsync, isPending } = useChangeUserStatusMutation();
  const { addToast } = useToast();

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    try {
      await mutateAsync({ userId, data: { status } });
      addToast('회원 상태가 변경되었습니다.', 'success');
    } catch (error) {
      const parsed = parseAxiosError(error);
      addToast(parsed.message, 'error');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-3 sm:flex-row sm:items-end">
      <label className="flex-1 text-sm font-semibold text-text-dark">
        회원 상태
        <select
          value={status}
          onChange={(event) => setStatus(event.target.value as UserStatus)}
          className="mt-2 w-full rounded-lg border border-border bg-bg-light-1 px-3 py-2 text-sm text-text-dark outline-none focus:border-primary-blue-3"
        >
          {USER_STATUS_OPTIONS.map((option) => (
            <option key={option} value={option}>
              {USER_STATUS_LABEL[option] ?? option}
            </option>
          ))}
        </select>
      </label>
      <Button type="submit" size="sm" loading={isPending} disabled={status === currentStatus}>
        상태 변경
      </Button>
    </form>
  );
}
