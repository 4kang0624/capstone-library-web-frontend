'use client';

import { useState } from 'react';
import { Trash2, Edit2, BookMarked } from 'lucide-react';
import type { Bookmark } from '../types';
import { Button } from '@/components/ui/Button';
import { cn } from '@/lib/utils/cn';

interface BookmarkListProps {
  bookmarks: Bookmark[];
  onEdit?: (bookmark: Bookmark) => void;
  onDelete?: (bookmarkId: number) => Promise<void>;
  isDeleting?: boolean;
  isEditing?: boolean;
}

export function BookmarkList({ bookmarks, onEdit, onDelete, isDeleting = false, isEditing = false }: BookmarkListProps) {
  const [deletingId, setDeletingId] = useState<number | null>(null);

  const handleDelete = async (bookmarkId: number) => {
    if (!onDelete) return;
    setDeletingId(bookmarkId);
    try {
      await onDelete(bookmarkId);
    } finally {
      setDeletingId(null);
    }
  };

  if (bookmarks.length === 0) {
    return (
      <div className="py-12 text-center">
        <BookMarked className="w-12 h-12 text-text-gray/30 mx-auto mb-3" />
        <p className="text-text-gray">책갈피가 없습니다.</p>
      </div>
    );
  }

  // Sort bookmarks by current_page descending
  const sortedBookmarks = [...bookmarks].sort((a, b) => b.current_page - a.current_page);

  return (
    <div className="space-y-3">
      {sortedBookmarks.map((bookmark) => (
        <div
          key={bookmark.id}
          className="border border-border rounded-lg p-4 hover:bg-bg-light-1 transition-colors"
        >
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1 space-y-2">
              {/* Page Info */}
              <div className="flex items-center gap-2">
                <BookMarked className="w-5 h-5 text-primary" />
                <span className="text-lg font-semibold text-text-dark">{bookmark.current_page}페이지</span>
              </div>

              {/* Note */}
              {bookmark.note && (
                <div className="text-sm text-text-medium bg-bg-light-1 p-3 rounded-lg">
                  <p className="line-clamp-3 whitespace-pre-wrap">{bookmark.note}</p>
                </div>
              )}
            </div>

            {/* Actions */}
            <div className="flex gap-2 flex-shrink-0">
              {onEdit && (
                <button
                  onClick={() => onEdit(bookmark)}
                  disabled={isEditing || isDeleting}
                  className="p-2 text-text-gray hover:text-primary hover:bg-primary/10 rounded-lg transition-colors disabled:opacity-50"
                  aria-label="수정"
                >
                  <Edit2 className="w-4 h-4" />
                </button>
              )}
              {onDelete && (
                <button
                  onClick={() => handleDelete(bookmark.id)}
                  disabled={isDeleting || deletingId === bookmark.id || isEditing}
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
            {new Date(bookmark.updated_at).toLocaleDateString('ko-KR', {
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
