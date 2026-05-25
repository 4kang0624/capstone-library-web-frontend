'use client';

import Image from 'next/image';
import { Edit2, Trash2, Bookmark } from 'lucide-react';
import type { BookCopy } from '../types';
import type { Bookmark as BookmarkType } from '@/features/bookmarks/types';
import { CopyStatusBadge } from '@/components/common/StatusBadge';
import { Badge } from '@/components/ui/Badge';
import { BookCopyConditionStatusLabel } from '@/types/enums';
import { motion } from 'framer-motion';
import { BookmarkRibbonButton } from '@/components/ui/BookmarkRibbon';
import { HighlightTitle } from '@/components/ui/HighlightTitle';
import { cn } from '@/lib/utils/cn';

interface BookCopyCardProps {
  copy: BookCopy;
  onEdit?: () => void;
  onDelete?: () => void;
  showActions?: boolean;
  onClick?: () => void;
  bookmark?: BookmarkType;
}

export function BookCopyCard({ copy, onEdit, onDelete, showActions = false, onClick, bookmark }: BookCopyCardProps) {
  return (
    <motion.div
      onClick={onClick}
      initial="rest"
      animate="rest"
      whileHover={onClick ? 'hovered' : undefined}
      className={cn(
        'bg-bg-light-2 rounded-2xl border border-border flex flex-col shadow-sm overflow-visible relative',
        onClick && 'cursor-pointer hover:shadow-lg hover:-translate-y-1 transition-all',
      )}
    >
      {bookmark && (
        <div className="scale-75 origin-top-right" style={{ position: 'absolute', top: '2px', right: '-12px', zIndex: 10 }}>
          <BookmarkRibbonButton
            onClick={() => {}}
            active={true}
            foldHeight={10}
            baseHeight={100}
          >
            <div className="flex flex-col items-center gap-0.5">
              <span className="text-[10px] font-bold leading-none">{bookmark.current_page}</span>
              <span className="text-[10px] leading-none">page</span>
            </div>
          </BookmarkRibbonButton>
        </div>
      )}
      <div className="aspect-[2/3] relative flex-shrink-0 overflow-hidden rounded-t-2xl">
        {copy.cover_image_url ? (
          <Image src={copy.cover_image_url} alt={copy.title || ''} fill className="object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-text-light text-4xl">📚</div>
        )}
      </div>
      <div className="p-4 flex flex-col flex-1">
        <div className="flex-1">
          <h3 className="font-serif font-bold text-text-dark text-sm line-clamp-2 mb-1"><HighlightTitle title={copy.title || '제목 없음'} /></h3>
          <p className="font-serif text-xs text-text-gray mb-2">{copy.author}</p>
        </div>
        <div className="flex gap-2">
            <Badge variant="default">상태: {BookCopyConditionStatusLabel[copy.condition_status]}</Badge>
            <CopyStatusBadge status={copy.current_status} />
          </div>
        {showActions && (
          <div className="flex gap-2 mt-3">
            {onEdit && (
              <button
                onClick={(e) => { e.stopPropagation(); onEdit(); }}
                className="flex-1 flex items-center justify-center gap-1 py-1.5 text-xs font-semibold text-text-medium border border-border rounded-lg hover:bg-bg-light-3 active:bg-bg-light-4 transition-colors"
              >
                <Edit2 className="w-3 h-3" /> 수정
              </button>
            )}
            {onDelete && (
              <button
                onClick={(e) => { e.stopPropagation(); onDelete(); }}
                className="flex-1 flex items-center justify-center gap-1 py-1.5 text-xs font-semibold text-error border border-error/30 rounded-lg hover:bg-error/5 active:bg-error/12 transition-colors"
              >
                <Trash2 className="w-3 h-3" /> 삭제
              </button>
            )}
          </div>
        )}
      </div>
    </motion.div>
  );
}
