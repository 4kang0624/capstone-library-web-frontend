'use client';

import { useMyWishlists } from '@/features/wishlists/queries';
import { WishlistList } from '@/features/wishlists/components';
import { PageHeader } from '@/components/common/PageHeader';
import { LoadingState } from '@/components/common/LoadingState';

export default function WishlistsPage() {
  const { data: items = [], isLoading } = useMyWishlists();

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex items-center justify-between mb-6">
        <PageHeader
          title="위시리스트"
          description={items.length > 0 ? `총 ${items.length}권` : '읽고 싶은 도서 목록'}
        />
      </div>

      {isLoading ? (
        <LoadingState />
      ) : (
        <WishlistList items={items} />
      )}
    </div>
  );
}