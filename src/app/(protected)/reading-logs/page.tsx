'use client';

import { useState } from 'react';
import { useMyReadingLogs } from '@/features/reading-logs/queries';
import { useCreateReadingLogMutation, useDeleteReadingLogMutation } from '@/features/reading-logs/mutations';
import { PageHeader } from '@/components/common/PageHeader';
import { LoadingState } from '@/components/common/LoadingState';
import { EmptyState } from '@/components/common/EmptyState';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import { Input } from '@/components/ui/Input';
import { ConfirmDialog } from '@/components/common/ConfirmDialog';
import { ReadingStatusBadge } from '@/components/common/StatusBadge';
import { ReadingStatus } from '@/types/enums';
import { Plus, BookOpen } from 'lucide-react';
import { formatDate } from '@/lib/format/date';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

const schema = z.object({
  book_id: z.string().min(1),
  reading_status: z.nativeEnum(ReadingStatus),
  memo: z.string().optional(),
  started_at: z.string().optional(),
  finished_at: z.string().optional(),
});
type FormValues = z.infer<typeof schema>;

export default function ReadingLogsPage() {
  const { data: logs = [], isLoading } = useMyReadingLogs();
  const { mutateAsync: create, isPending: creating } = useCreateReadingLogMutation();
  const { mutateAsync: del, isPending: deleting } = useDeleteReadingLogMutation();
  const [addOpen, setAddOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<number | null>(null);

  const { register, handleSubmit, reset, formState: { errors } } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { reading_status: ReadingStatus.READING, book_id: '' },
  });

  const onSubmit = async (values: FormValues) => {
    await create({ ...values, book_id: parseInt(values.book_id) } as unknown as Parameters<typeof create>[0]);
    setAddOpen(false);
    reset();
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <PageHeader
        title="독서 기록"
        description="독서 현황을 기록하세요"
        action={
          <Button size="sm" onClick={() => setAddOpen(true)}>
            <Plus className="w-4 h-4" /> 추가
          </Button>
        }
      />

      {isLoading ? (
        <LoadingState />
      ) : logs.length === 0 ? (
        <EmptyState icon={<BookOpen className="w-16 h-16" />} title="독서 기록이 없습니다" description="책을 읽기 시작하면 기록을 추가하세요" />
      ) : (
        <div className="flex flex-col gap-3">
          {logs.map((log) => (
            <div key={log.id} className="bg-white rounded-2xl border border-border p-5 flex items-center justify-between">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-bold text-text-dark">도서 #{log.book_id}</span>
                  <ReadingStatusBadge status={log.reading_status as ReadingStatus} />
                </div>
                {log.memo && <p className="text-sm text-text-gray">{log.memo}</p>}
                <p className="text-xs text-text-light mt-1">{formatDate(log.created_at)}</p>
              </div>
              <Button
                variant="text"
                size="sm"
                onClick={() => setDeleteId(log.id)}
                className="text-error"
              >
                삭제
              </Button>
            </div>
          ))}
        </div>
      )}

      <Modal open={addOpen} onClose={() => setAddOpen(false)} title="독서 기록 추가">
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
          <Input label="도서 ID" type="number" {...register('book_id')} error={errors.book_id?.message} />
          <div>
            <label className="text-sm font-semibold text-text-medium block mb-1.5">독서 상태</label>
            <select {...register('reading_status')} className="w-full border border-border rounded-xl px-4 py-3 text-text-dark focus:border-primary outline-none">
              {Object.values(ReadingStatus).map((v) => <option key={v} value={v}>{v}</option>)}
            </select>
          </div>
          <Input label="메모" {...register('memo')} />
          <Button type="submit" loading={creating} fullWidth>추가</Button>
        </form>
      </Modal>

      <ConfirmDialog
        open={deleteId !== null}
        onClose={() => setDeleteId(null)}
        onConfirm={async () => { if (deleteId) { await del(deleteId); setDeleteId(null); } }}
        message="이 독서 기록을 삭제하시겠습니까?"
        danger
        loading={deleting}
      />
    </div>
  );
}