'use client';

import { useState } from 'react';
import { Trash2, Edit2, Calendar, Star, BookOpen } from 'lucide-react';
import type { ReadingLog } from '../types';
import { ReadingStatusLabel } from '@/types/enums';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { cn } from '@/lib/utils/cn';

interface ReadingLogListProps {
  logs: ReadingLog[];
  onEdit?: (log: ReadingLog) => void;
  onDelete?: (logId: number) => Promise<void>;
  isDeleting?: boolean;
  isEditing?: boolean;
}

export function ReadingLogList({ logs, onEdit, onDelete, isDeleting = false, isEditing = false }: ReadingLogListProps) {
  const [deletingId, setDeletingId] = useState<number | null>(null);

  const handleDelete = async (logId: number) => {
    if (!onDelete) return;
    setDeletingId(logId);
    try {
      await onDelete(logId);
    } finally {
      setDeletingId(null);
    }
  };

  if (logs.length === 0) {
    return (
      <div className="py-12 text-center">
        <BookOpen className="w-12 h-12 text-text-gray/30 mx-auto mb-3" />
        <p className="text-text-gray">읽기 기록이 없습니다.</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {logs.map((log) => (
        <div
          key={log.id}
          className="border border-border rounded-lg p-4 hover:bg-bg-light-1 transition-colors"
        >
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1 space-y-2">
              {/* Status and Rating */}
              <div className="flex items-center gap-2">
                <Badge variant="default">{ReadingStatusLabel[log.reading_status as keyof typeof ReadingStatusLabel]}</Badge>
                {log.rating && (
                  <div className="flex items-center gap-1">
                    {[...Array(log.rating)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                    ))}
                    {[...Array(5 - log.rating)].map((_, i) => (
                      <Star key={`empty-${i}`} className="w-4 h-4 text-gray-300" />
                    ))}
                  </div>
                )}
              </div>

              {/* Dates */}
              <div className="text-sm text-text-gray space-y-1">
                {log.started_at && (
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    <span>읽기 시작: {new Date(log.started_at).toLocaleDateString('ko-KR')}</span>
                  </div>
                )}
                {log.finished_at && (
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    <span>완독: {new Date(log.finished_at).toLocaleDateString('ko-KR')}</span>
                  </div>
                )}
              </div>

              {/* Memo */}
              {log.memo && (
                <div className="text-sm text-text-medium bg-bg-light-1 p-3 rounded-lg mt-2">
                  <p className="line-clamp-3 whitespace-pre-wrap">{log.memo}</p>
                </div>
              )}
            </div>

            {/* Actions */}
            <div className="flex gap-2 flex-shrink-0">
              {onEdit && (
                <button
                  onClick={() => onEdit(log)}
                  disabled={isEditing || isDeleting}
                  className="p-2 text-text-gray hover:text-primary hover:bg-primary/10 rounded-lg transition-colors disabled:opacity-50"
                  aria-label="수정"
                >
                  <Edit2 className="w-4 h-4" />
                </button>
              )}
              {onDelete && (
                <button
                  onClick={() => handleDelete(log.id)}
                  disabled={isDeleting || deletingId === log.id || isEditing}
                  className="p-2 text-text-gray hover:text-error hover:bg-error/10 rounded-lg transition-colors disabled:opacity-50"
                  aria-label="삭제"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>

          {/* Updated timestamp */}
          <div className="mt-3 pt-3 border-t border-border/50 text-xs text-text-gray">
            {new Date(log.updated_at).toLocaleDateString('ko-KR', {
              year: 'numeric',
              month: 'short',
              day: 'numeric',
              hour: '2-digit',
              minute: '2-digit',
            })}
          </div>
        </div>
      ))}
    </div>
  );
}
