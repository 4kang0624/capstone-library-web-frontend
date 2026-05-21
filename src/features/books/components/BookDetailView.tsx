'use client';

import Image from 'next/image';
import { Heart, Library } from 'lucide-react';
import type { Book } from '../types';
import { Button } from '@/components/ui/Button';
import { cn } from '@/lib/utils/cn';

interface BookDetailViewProps {
  book: Book;
  onWishlist?: () => void;
  onAddToLibrary?: () => void;
  isWishlisted?: boolean;
  isInLibrary?: boolean;
}

export function BookDetailView({ book, onWishlist, onAddToLibrary, isWishlisted, isInLibrary }: BookDetailViewProps) {
  return (
    <div className="flex flex-col md:flex-row gap-8">
      <div className="flex-shrink-0">
        <div className="w-48 aspect-[2/3] relative bg-bg-lighter rounded-2xl overflow-hidden shadow-lg">
          {book.cover_image_url ? (
            <Image src={book.cover_image_url} alt={book.title} fill className="object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-text-light text-5xl">📚</div>
          )}
        </div>
      </div>
      <div className="flex-1">
        <h1 className="text-3xl font-bold text-text-dark mb-2">{book.title}</h1>
        <p className="text-lg text-text-medium mb-1">{book.author}</p>
        <p className="text-sm text-text-gray mb-4">{book.publisher}{book.published_date && ` · ${book.published_date}`}</p>
        {book.description && (
          <p className="text-text-medium leading-relaxed mb-6 text-sm">{book.description}</p>
        )}
        <div className="flex gap-3">
          {onWishlist && (
            <Button
              variant={isWishlisted ? 'contained' : 'outlined'}
              size="sm"
              onClick={onWishlist}
            >
              <Heart className={cn('w-4 h-4', isWishlisted && 'fill-current')} />
              {isWishlisted ? '위시리스트 삭제' : '위시리스트 추가'}
            </Button>
          )}
          {onAddToLibrary && (
            <Button
              variant={isInLibrary ? 'contained' : 'outlined'}
              size="sm"
              onClick={onAddToLibrary}
            >
              <Library className={cn('w-4 h-4', isInLibrary && 'fill-current')} />
              {isInLibrary ? '내서재 제거' : '내서재 추가'}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
