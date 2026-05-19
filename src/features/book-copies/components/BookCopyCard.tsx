'use client';

import Image from 'next/image';
import { Edit2, Trash2 } from 'lucide-react';
import type { BookCopy } from '../types';
import { CopyStatusBadge } from '@/components/common/StatusBadge';
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
        'bg-white rounded-2xl border border-[#E5E8EB] overflow-hidden',
        onClick && 'cursor-pointer hover:shadow-lg hover:-translate-y-1 transition-all',
      )}
    >
      <div className="aspect-[2/3] relative bg-[#F2F4F6]">
        {copy.cover_image_url ? (
          <Image src={copy.cover_image_url} alt={copy.title || ''} fill className="object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-[#8B95A1] text-4xl">📚</div>
        )}
      </div>
      <div className="p-4">
        <h3 className="font-bold text-[#191F28] text-sm line-clamp-2 mb-1">{copy.title || '제목 없음'}</h3>
        <p className="text-xs text-[#6B7684] mb-2">{copy.author}</p>
        <CopyStatusBadge status={copy.current_status} />
        {showActions && (
          <div className="flex gap-2 mt-3">
            {onEdit && (
              <button
                onClick={(e) => { e.stopPropagation(); onEdit(); }}
                className="flex-1 flex items-center justify-center gap-1 py-1.5 text-xs font-semibold text-[#4E5968] border border-[#E5E8EB] rounded-lg hover:bg-[#F2F4F6] transition-colors"
              >
                <Edit2 className="w-3 h-3" /> 수정
              </button>
            )}
            {onDelete && (
              <button
                onClick={(e) => { e.stopPropagation(); onDelete(); }}
                className="flex-1 flex items-center justify-center gap-1 py-1.5 text-xs font-semibold text-[#F44336] border border-[#F44336]/30 rounded-lg hover:bg-[#F44336]/5 transition-colors"
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
