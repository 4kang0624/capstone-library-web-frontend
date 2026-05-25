'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { HeartOff, CalendarDays, StickyNote, Edit2, Plus, ChevronDown } from 'lucide-react';
import { motion } from 'framer-motion';
import { ROUTES } from '@/constants/routes';
import { formatRelativeDate } from '@/lib/format/date';
import { ConfirmDialog } from '@/components/common/ConfirmDialog';
import { HighlightTitle } from '@/components/ui/HighlightTitle';
import { MemoEditModal } from './MemoEditModal';
import { useUpdateWishlistMutation } from '../mutations';
import type { WishlistItem } from '../types';

interface WishlistCardProps {
  item: WishlistItem;
  onRemove: (id: number) => Promise<void>;
}

export function WishlistCard({ item, onRemove }: WishlistCardProps) {
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [memoModalOpen, setMemoModalOpen] = useState(false);
  const [removing, setRemoving] = useState(false);
  const [expandedMemo, setExpandedMemo] = useState(false);
  const { mutateAsync: update } = useUpdateWishlistMutation();

  const handleRemove = async () => {
    setRemoving(true);
    try {
      await onRemove(item.id);
    } finally {
      setRemoving(false);
      setConfirmOpen(false);
    }
  };

  const handleSaveMemo = async (memo: string) => {
    await update({ id: item.id, data: { memo: memo || undefined } });
  };

  return (
    <>
      <motion.div
        initial="rest"
        animate="rest"
        whileHover="hovered"
        className="group bg-bg-light-2 rounded-2xl border border-border overflow-hidden hover:shadow-xl hover:-translate-y-1.5 transition-all duration-200 flex flex-col shadow-sm"
      >
        {/* Cover Image */}
        <Link href={ROUTES.BOOK_DETAIL(item.book_id)} className="block">
          <div className="aspect-[2/3] relative bg-bg-light overflow-hidden rounded-t-2xl">
            {item.cover_image_url ? (
              <Image
                src={item.cover_image_url}
                alt={item.title ?? `도서 #${item.book_id}`}
                fill
                className="object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-5xl bg-bg-light-3">
                📚
              </div>
            )}
          </div>
        </Link>

        {/* Info */}
        <div className="p-4 flex flex-col gap-2 flex-1">
          <Link href={ROUTES.BOOK_DETAIL(item.book_id)} className="block">
            <h3 className="font-serif font-bold text-text-dark text-sm line-clamp-2 leading-snug mb-1">
              <HighlightTitle title={item.title ?? `도서 #${item.book_id}`} />
            </h3>
            {item.author && (
              <p className="font-serif text-xs text-text-gray line-clamp-1">{item.author}</p>
            )}
          </Link>

          {/* Memo Section */}
          {item.memo ? (
            <div className="bg-yellow-50 rounded-lg overflow-hidden transition-all">
              <button
                onClick={() => setExpandedMemo(!expandedMemo)}
                className="w-full flex gap-1.5 items-start hover:bg-yellow-100 px-2.5 py-2 transition-colors text-left group/memo"
              >
                <StickyNote className="w-3.5 h-3.5 text-yellow-600 mt-0.5 flex-shrink-0 group-hover/memo:scale-110 transition-transform" />
                <p className={`text-xs text-text-medium leading-relaxed flex-1 min-w-0 ${!expandedMemo ? 'line-clamp-2' : 'whitespace-pre-wrap break-words'}`}>
                  {item.memo}
                </p>
                <ChevronDown
                  className={`w-3.5 h-3.5 text-yellow-600 flex-shrink-0 mt-0.5 transition-transform duration-200 ${
                    expandedMemo ? 'rotate-180' : ''
                  }`}
                />
              </button>
            </div>
          ) : (
            <button
              onClick={() => setMemoModalOpen(true)}
              className="flex items-center justify-center gap-1.5 text-xs text-text-gray hover:text-primary hover:bg-bg-light-3 border border-dashed border-text-gray/30 hover:border-text-gray/50 rounded-lg px-2.5 py-2 transition-colors"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>메모 추가</span>
            </button>
          )}

          {/* Footer */}
          <div className="flex items-center justify-between mt-auto pt-1 gap-1">
            <span className="flex items-center gap-1 text-xs text-text-gray flex-shrink-0 min-w-0 truncate">
              <CalendarDays className="w-3.5 h-3.5 flex-shrink-0" />
              <span className="truncate">{formatRelativeDate(item.created_at)}</span>
            </span>

            <div className="flex gap-0.5 flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
              {item.memo && (
                <button
                  onClick={() => setMemoModalOpen(true)}
                  className="p-1.5 text-primary-blue-3 hover:text-primary-blue-4 hover:bg-primary-blue-3/10 rounded-lg transition-colors"
                  title="메모 수정"
                  aria-label="메모 수정"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                </button>
              )}
              <button
                onClick={() => setConfirmOpen(true)}
                disabled={removing}
                className="p-1.5 text-error hover:text-error-dark hover:bg-error/10 rounded-lg transition-colors disabled:opacity-50"
                title="위시리스트에서 제거"
                aria-label="위시리스트에서 제거"
              >
                <HeartOff className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </motion.div>

      <MemoEditModal
        open={memoModalOpen}
        onClose={() => {
          setMemoModalOpen(false);
          setExpandedMemo(false);
        }}
        onSave={handleSaveMemo}
        initialMemo={item.memo}
        bookTitle={item.title}
      />

      <ConfirmDialog
        open={confirmOpen}
        onClose={() => setConfirmOpen(false)}
        onConfirm={handleRemove}
        title="위시리스트 제거"
        message={`'${item.title ?? `도서 #${item.book_id}`}'를 위시리스트에서 제거할까요?`}
        confirmLabel="제거"
        loading={removing}
        danger
      />
    </>
  );
}
