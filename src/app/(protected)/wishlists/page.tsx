'use client';

import { useMyWishlists } from '@/features/wishlists/queries';
import { useRemoveWishlistMutation } from '@/features/wishlists/mutations';
import { PageHeader } from '@/components/common/PageHeader';
import { LoadingState } from '@/components/common/LoadingState';
import { EmptyState } from '@/components/common/EmptyState';
import { Button } from '@/components/ui/Button';
import Link from 'next/link';
import { ROUTES } from '@/constants/routes';
import { Heart } from 'lucide-react';

export default function WishlistsPage() {
  const { data: items = [], isLoading } = useMyWishlists();
  const { mutateAsync: remove, isPending } = useRemoveWishlistMutation();

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <PageHeader title="위시리스트" description="읽고 싶은 도서 목록" />

      {isLoading ? (
        <LoadingState />
      ) : items.length === 0 ? (
        <EmptyState
          icon={<Heart className="w-16 h-16" />}
          title="위시리스트가 비어 있습니다"
          description="도서 상세 페이지에서 위시리스트에 추가하세요"
        />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {items.map((item) => (
            <div key={item.id} className="bg-white rounded-2xl border border-border p-5">
              <Link href={ROUTES.BOOK_DETAIL(item.book_id)} className="block mb-3">
                <h3 className="font-bold text-text-dark hover:text-primary transition-colors">
                  도서 #{item.book_id}
                </h3>
              </Link>
              <Button
                variant="outlined"
                size="sm"
                onClick={() => remove(item.id)}
                loading={isPending}
              >
                <Heart className="w-4 h-4" /> 삭제
              </Button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}