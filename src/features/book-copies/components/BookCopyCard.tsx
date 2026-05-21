'use client';

import Image from 'next/image';
import { Edit2, Trash2 } from 'lucide-react';
import type { BookCopy } from '../types';
import { CopyStatusBadge } from '@/components/common/StatusBadge';
import { Badge } from '@/components/ui/Badge';
import { BookCopyConditionStatusLabel } from '@/types/enums';
import { cn } from '@/lib/utils/cn';

interface BookCopyCardProps {
  copy: BookCopy;
  onEdit?: () => void;
  onDelete?: () => void;
  showActions?: boolean;
  onClick?: () => void;
}

export function BookCopyCard({ copy, onEdit, onDelete, showActions = false, onClick }: BookCopyCardProps) {
  return (
    <div
      onClick={onClick}
      className={cn(
        'bg-bg-light-2 rounded-2xl border border-border overflow-hidden flex flex-col',
        onClick && 'cursor-pointer hover:shadow-lg hover:-translate-y-1 transition-all',
      )}
    >
      <div className="aspect-[2/3] relative flex-shrink-0">
        {copy.cover_image_url ? (
          <Image src={copy.cover_image_url} alt={copy.title || ''} fill className="object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-text-light text-4xl">📚</div>
        )}
      </div>
      <div className="p-4 flex flex-col flex-1">
        <div className="flex-1">
          <h3 className="font-serif font-bold text-text-dark text-sm line-clamp-2 mb-1">{copy.title || '제목 없음'}</h3>
          <p className="font-serif text-xs text-text-gray mb-2">{copy.author}</p>
          <div className="flex gap-2">
            <Badge variant="default">상태: {BookCopyConditionStatusLabel[copy.condition_status]}</Badge>
            <CopyStatusBadge status={copy.current_status} />
          </div>
        </div>
        {showActions && (
          <div className="flex gap-2 mt-3">
            {onEdit && (
              <button
                onClick={(e) => { e.stopPropagation(); onEdit(); }}
                className="flex-1 flex items-center justify-center gap-1 py-1.5 text-xs font-semibold text-text-medium border border-border rounded-lg hover:bg-bg-lighter transition-colors"
              >
                <Edit2 className="w-3 h-3" /> 수정
              </button>
            )}
            {onDelete && (
              <button
                onClick={(e) => { e.stopPropagation(); onDelete(); }}
                className="flex-1 flex items-center justify-center gap-1 py-1.5 text-xs font-semibold text-error border border-error/30 rounded-lg hover:bg-error/5 transition-colors"
              >
                <Trash2 className="w-3 h-3" /> 삭제
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
