'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { BookOpen, Calendar, Star, AlertCircle } from 'lucide-react';
import type { ReadingLog, ReadingLogCreateRequest, ReadingLogUpdateRequest } from '../types';
import { ReadingStatus, ReadingStatusLabel } from '@/types/enums';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { cn } from '@/lib/utils/cn';

interface ReadingLogFormProps {
  bookId: number;
  bookCopyId?: number;
  initialLog?: ReadingLog;
  onSubmit: (data: ReadingLogCreateRequest | ReadingLogUpdateRequest) => Promise<void>;
  onCancel?: () => void;
  isLoading?: boolean;
}

export function ReadingLogForm({
  bookId,
  bookCopyId,
  initialLog,
  onSubmit,
  onCancel,
  isLoading = false,
}: ReadingLogFormProps) {
  const [status, setStatus] = useState<string>(initialLog?.reading_status || ReadingStatus.READING);
  const [startedAt, setStartedAt] = useState(initialLog?.started_at || '');
  const [finishedAt, setFinishedAt] = useState(initialLog?.finished_at || '');
  const [rating, setRating] = useState<number>(initialLog?.rating || 0);
  const [memo, setMemo] = useState(initialLog?.memo || '');
  const [error, setError] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);

    try {
      const data = initialLog
        ? {
            reading_status: status,
            finished_at: finishedAt || undefined,
            rating: rating || undefined,
            memo: memo || undefined,
          }
        : {
            book_id: bookId,
            book_copy_id: bookCopyId,
            reading_status: status,
            started_at: startedAt || undefined,
            finished_at: finishedAt || undefined,
            rating: rating || undefined,
            memo: memo || undefined,
          };

      await onSubmit(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : '오류가 발생했습니다.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <div className="p-3 bg-error/10 border border-error rounded-lg flex gap-2">
          <AlertCircle className="w-5 h-5 text-error flex-shrink-0 mt-0.5" />
          <p className="text-sm text-error">{error}</p>
        </div>
      )}

      {/* Reading Status */}
      <div>
        <label className="block text-sm font-medium text-text-dark mb-2">읽기 상태</label>
        <div className="flex gap-1 bg-bg-light-4 p-1 rounded-xl w-fit relative">
          {Object.entries(ReadingStatusLabel).map(([key, label]) => (
            <button
              key={key}
              type="button"
              onClick={() => setStatus(key)}
              className={cn(
                'relative px-4 py-2 rounded-lg text-sm font-semibold transition-colors z-10',
                status === key
                  ? 'text-text-dark'
                  : 'text-text-gray hover:text-text-dark',
              )}
            >
              {status === key && (
                <motion.div
                  layoutId="status-highlight"
                  initial={false}
                  transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                  className="absolute inset-0 bg-bg-light-1 rounded-lg shadow-sm -z-10"
                />
              )}
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Dates */}
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-sm font-medium text-text-dark mb-2 flex items-center gap-1">
            <Calendar className="w-4 h-4" />
            읽기 시작
          </label>
          <Input
            type="date"
            value={startedAt?.split('T')[0] || ''}
            onChange={(e) => setStartedAt(e.target.value ? `${e.target.value}T00:00:00` : '')}
            disabled={!!initialLog}
            className="text-sm bg-bg-light-1"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-text-dark mb-2 flex items-center gap-1">
            <Calendar className="w-4 h-4" />
            완독 날짜
          </label>
          <Input
            type="date"
            value={finishedAt?.split('T')[0] || ''}
            onChange={(e) => setFinishedAt(e.target.value ? `${e.target.value}T00:00:00` : '')}
            className="text-sm bg-bg-light-1"
          />
        </div>
      </div>

      {/* Rating */}
      <div>
        <label className="block text-sm font-medium text-text-dark mb-2 flex items-center gap-1">
          <Star className="w-4 h-4" />
          평점
        </label>
        <div className="flex gap-1">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              type="button"
              onClick={() => setRating(rating === star ? 0 : star)}
              className={cn('text-2xl transition-colors', rating >= star ? 'text-yellow-400' : 'text-gray-300')}
            >
              ★
            </button>
          ))}
        </div>
        {rating > 0 && <p className="text-sm text-text-gray mt-1">{rating}점</p>}
      </div>

      {/* Memo */}
      <div>
        <label className="block text-sm font-medium text-text-dark mb-2 flex items-center gap-1">
          <BookOpen className="w-4 h-4" />
          메모
        </label>
        <textarea
          value={memo}
          onChange={(e) => setMemo(e.target.value)}
          placeholder="이 책에 대한 생각이나 인상깊은 구절을 기록해보세요..."
          rows={4}
          className="w-full px-3 py-2 border border-border rounded-lg text-sm text-text-dark focus:outline-none focus:ring-2 focus:ring-primary/20 resize-none bg-bg-light-1"
        />
      </div>

      {/* Buttons */}
      <div className="flex gap-3 pt-4">
        <Button
          type="submit"
          disabled={isSubmitting || isLoading}
          className="flex-1"
        >
          {isSubmitting ? '저장 중...' : initialLog ? '수정' : '추가'}
        </Button>
        {onCancel && (
          <Button
            type="button"
            variant="outlined"
            onClick={onCancel}
            disabled={isSubmitting || isLoading}
            className="flex-1"
          >
            취소
          </Button>
        )}
      </div>
    </form>
  );
}
