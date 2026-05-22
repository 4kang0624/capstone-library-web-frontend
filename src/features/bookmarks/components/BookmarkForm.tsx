'use client';

import { useState, useEffect } from 'react';
import { Bookmark, AlertCircle } from 'lucide-react';
import type { Bookmark as BookmarkType, BookmarkUpsertRequest } from '../types';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';

interface BookmarkFormProps {
  bookId: number;
  bookCopyId?: number;
  initialBookmark?: BookmarkType;
  onSubmit: (data: BookmarkUpsertRequest) => Promise<void>;
  onCancel?: () => void;
  isLoading?: boolean;
}

export function BookmarkForm({
  bookId,
  bookCopyId,
  initialBookmark,
  onSubmit,
  onCancel,
  isLoading = false,
}: BookmarkFormProps) {
  const [currentPage, setCurrentPage] = useState(initialBookmark?.current_page || 0);
  const [note, setNote] = useState(initialBookmark?.note || '');
  const [error, setError] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (currentPage < 0) {
      setError('페이지 번호는 0 이상이어야 합니다.');
      return;
    }

    setIsSubmitting(true);

    try {
      const data: BookmarkUpsertRequest = {
        book_id: bookId,
        book_copy_id: bookCopyId,
        current_page: currentPage,
        note: note || undefined,
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

      {/* Current Page */}
      <div>
        <label className="block text-sm font-medium text-text-dark mb-2">현재 페이지</label>
        <Input
          type="number"
          value={currentPage}
          onChange={(e) => setCurrentPage(Math.max(0, parseInt(e.target.value) || 0))}
          min="0"
          placeholder="0"
          className="text-sm"
        />
        <p className="text-xs text-text-gray mt-1">읽고 있는 현재 페이지 번호를 입력하세요.</p>
      </div>

      {/* Note */}
      <div>
        <label className="block text-sm font-medium text-text-dark mb-2 flex items-center gap-1">
          <Bookmark className="w-4 h-4" />
          메모
        </label>
        <textarea
          value={note}
          onChange={(e) => setNote(e.target.value)}
          placeholder="이 페이지에 대한 메모나 생각을 기록해보세요..."
          rows={3}
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
          {isSubmitting ? '저장 중...' : '책갈피 저장'}
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
