'use client';

import { Heart } from 'lucide-react';
import { WishlistCard } from './WishlistCard';
import { useRemoveWishlistMutation } from '../mutations';
import type { WishlistItem } from '../types';

interface WishlistListProps {
  items: WishlistItem[];
}

export function WishlistList({ items }: WishlistListProps) {
  const { mutateAsync: remove } = useRemoveWishlistMutation();

  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-24 gap-4 text-center">
        <Heart className="w-14 h-14 text-text-gray/20" />
        <div>
          <p className="font-semibold text-text-dark">위시리스트가 비어 있습니다</p>
          <p className="text-sm text-text-gray mt-1">도서 상세 페이지에서 하트를 눌러 추가하세요</p>
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
      {items.map((item) => (
        <WishlistCard key={item.id} item={item} onRemove={remove} />
      ))}
    </div>
  );
}
