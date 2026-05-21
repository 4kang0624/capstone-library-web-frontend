'use client';

import Image from 'next/image';
import type { SearchBookResult } from '@/features/search/types';
import { cn } from '@/lib/utils/cn';
import { Button } from './Button';
import { useState } from 'react';

interface SearchResultCardProps {
  item: SearchBookResult & { price?: number };
  onAction?: () => void;
  actionLabel?: string;
  className?: string;
  loading?: boolean;
}

export function SearchResultCard({
  item,
  onAction,
  actionLabel = '상세보기',
  className,
  loading = false,
}: SearchResultCardProps) {
  const [isLoading, setIsLoading] = useState(false);

  const handleClick = async () => {
    if (onAction) {
      setIsLoading(true);
      try {
        await onAction();
      } finally {
        setIsLoading(false);
      }
    }
  };

  return (
    <div
      className={cn(
        'bg-bg-light-2 rounded-2xl border border-border p-4 shadow-sm',
        'hover:shadow-lg hover:-translate-y-1 transition-all',
        'flex gap-4',
        className,
      )}
    >
      {/* Image Container */}
      <div className="flex-shrink-0 w-32 h-48">
        <div className="relative w-full h-full bg-gradient-to-br from-blue-100 to-purple-100 flex items-center justify-center overflow-hidden rounded-xl">
          {item.cover_image_url ? (
            <Image
              src={item.cover_image_url}
              alt={item.title}
              fill
              className="object-cover"
              unoptimized
              sizes="(max-width: 640px) 100px, 128px"
            />
          ) : (
            <div className="text-center p-3 w-full h-full flex flex-col items-center justify-center">
              <p className="font-semibold text-xs text-text-dark line-clamp-3">{item.title}</p>
            </div>
          )}
        </div>
      </div>

      {/* Content Container */}
      <div className="flex-1 flex flex-col justify-between">
        {/* Header Section */}
        <div>
          <h3 className="font-bold text-text-dark text-sm line-clamp-2 mb-1">{item.title}</h3>
          <p className="text-xs text-text-gray line-clamp-1 mb-1">{item.author}</p>
          <p className="text-xs text-text-light line-clamp-1 mb-3">{item.publisher}</p>

          {/* Info Box */}
          <div className="bg-bg-light-3 p-3 rounded-lg mb-3 text-xs border border-border space-y-2">
            {item.published_date && (
              <div className="flex justify-between">
                <span className="text-text-gray">출판일:</span>
                <span className="font-semibold text-text-dark">{item.published_date}</span>
              </div>
            )}
            {item.price && (
              <div className="flex justify-between">
                <span className="text-text-gray">정가:</span>
                <span className="font-semibold text-text-dark">{item.price.toLocaleString()}원</span>
              </div>
            )}
            {item.description && <p className="text-text-gray line-clamp-2">{item.description}</p>}
          </div>
        </div>

        {/* Action Button */}
        <Button
          onClick={handleClick}
          loading={isLoading || loading}
          variant="contained"
          size="sm"
          fullWidth
          aria-label={actionLabel}
        >
          {actionLabel}
        </Button>
      </div>
    </div>
  );
}
