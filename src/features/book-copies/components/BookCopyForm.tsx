'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { BookCopyConditionStatus, BookCopyCurrentStatus } from '@/types/enums';
import { cn } from '@/lib/utils/cn';
import type { BookCopy } from '../types';

const schema = z.object({
  condition_status: z.nativeEnum(BookCopyConditionStatus),
  is_available_for_rent: z.boolean(),
  memo: z.string().optional(),
});

type FormValues = z.infer<typeof schema>;

interface BookCopyFormProps {
  initialValues?: Partial<BookCopy>;
  onSubmit: (values: FormValues) => Promise<void>;
  loading?: boolean;
  submitLabel?: string;
}

const conditionLabels: Record<BookCopyConditionStatus, string> = {
  [BookCopyConditionStatus.GOOD]: '양호',
  [BookCopyConditionStatus.FAIR]: '보통',
  [BookCopyConditionStatus.POOR]: '안좋음',
};

export function BookCopyForm({ initialValues, onSubmit, loading, submitLabel = '저장' }: BookCopyFormProps) {
  const { register, handleSubmit, formState: { errors } } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      condition_status: initialValues?.condition_status ?? BookCopyConditionStatus.GOOD,
      is_available_for_rent: initialValues?.is_available_for_rent ?? true,
      memo: initialValues?.memo ?? '',
    },
  });

  const isRentalStatusFixed = 
    initialValues?.current_status === BookCopyCurrentStatus.REQUESTED || 
    initialValues?.current_status === BookCopyCurrentStatus.RENTED;

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
      <div>
        <label className="text-sm font-semibold text-text-medium block mb-1.5">도서 상태</label>
        <select
          {...register('condition_status')}
          className="w-full border border-border rounded-xl bg-bg-light-2 px-4 py-3 text-text-dark focus:border-primary outline-none"
        >
          {Object.values(BookCopyConditionStatus).map((v) => (
            <option key={v} value={v}>{conditionLabels[v]}</option>
          ))}
        </select>
      </div>
      <label className={cn("flex items-center gap-3", isRentalStatusFixed ? 'cursor-not-allowed' : 'cursor-pointer')}>
        <input 
          type="checkbox" 
          {...register('is_available_for_rent')} 
          disabled={isRentalStatusFixed}
          className={cn(
            "w-5 h-5 rounded",
            isRentalStatusFixed ? 'accent-text-light cursor-not-allowed bg-bg-light-2' : 'accent-primary'
          )}
        />
        <span className={cn("text-sm font-semibold", isRentalStatusFixed ? 'text-text-light' : 'text-text-medium')}>대여 가능 상태로 설정</span>
      </label>
      <Input
        label="메모 (선택사항)"
        placeholder="책에 대한 메모를 입력하세요"
        {...register('memo')}
        error={errors.memo?.message}
      />
      <Button type="submit" loading={loading} fullWidth>{submitLabel}</Button>
    </form>
  );
}
