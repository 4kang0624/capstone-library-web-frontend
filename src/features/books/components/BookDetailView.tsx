'use client';

import Image from 'next/image';
import { Heart, Bookmark } from 'lucide-react';
import type { Book } from '../types';
import { Button } from '@/components/ui/Button';

interface BookDetailViewProps {
  book: Book;
  onWishlist?: () => void;
  onBookmark?: () => void;
  isWishlisted?: boolean;
  isBookmarked?: boolean;
}

export function BookDetailView({ book, onWishlist, onBookmark, isWishlisted, isBookmarked }: BookDetailViewProps) {
  return (
    <div className="flex flex-col md:flex-row gap-8">
      <div className="flex-shrink-0">
        <div className="w-48 aspect-[2/3] relative bg-[#F2F4F6] rounded-2xl overflow-hidden shadow-lg">
          {book.cover_image_url ? (
            <Image src={book.cover_image_url} alt={book.title} fill className="object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-[#8B95A1] text-5xl">📚</div>
          )}
        </div>
      </div>
      <div className="flex-1">
        <h1 className="text-3xl font-bold text-[#191F28] mb-2">{book.title}</h1>
        <p className="text-lg text-[#4E5968] mb-1">{book.author}</p>
        <p className="text-sm text-[#6B7684] mb-4">{book.publisher}{book.published_date && ` · ${book.published_date}`}</p>
        {book.description && (
          <p className="text-[#4E5968] leading-relaxed mb-6 text-sm">{book.description}</p>
        )}
        <div className="flex gap-3">
          {onWishlist && (
            <Button
              variant={isWishlisted ? 'contained' : 'outlined'}
              size="sm"
              onClick={onWishlist}
            >
              <Heart className="w-4 h-4" />
              {isWishlisted ? '위시리스트 삭제' : '위시리스트 추가'}
            </Button>
          )}
          {onBookmark && (
            <Button
              variant={isBookmarked ? 'contained' : 'outlined'}
              size="sm"
              onClick={onBookmark}
            >
              <Bookmark className="w-4 h-4" />
              {isBookmarked ? '즐겨찾기 삭제' : '즐겨찾기 추가'}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
