'use client';

import { useMyBookmarks } from '@/features/bookmarks/queries';
import { useDeleteBookmarkMutation } from '@/features/bookmarks/mutations';
import { PageHeader } from '@/components/common/PageHeader';
import { LoadingState } from '@/components/common/LoadingState';
import { EmptyState } from '@/components/common/EmptyState';
import { Button } from '@/components/ui/Button';
import Link from 'next/link';
import { ROUTES } from '@/constants/routes';
import { Bookmark } from 'lucide-react';

export default function BookmarksPage() {
  const { data: items = [], isLoading } = useMyBookmarks();
  const { mutateAsync: remove, isPending } = useDeleteBookmarkMutation();

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <PageHeader title="즐겨찾기" description="즐겨찾기한 도서 목록" />

      {isLoading ? (
        <LoadingState />
      ) : items.length === 0 ? (
        <EmptyState
          icon={<Bookmark className="w-16 h-16" />}
          title="즐겨찾기가 비어 있습니다"
          description="도서 상세 페이지에서 즐겨찾기에 추가하세요"
        />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {items.map((item) => (
            <div key={item.id} className="bg-white rounded-2xl border border-[#E5E8EB] p-5">
              <Link href={ROUTES.BOOK_DETAIL(item.book_id)} className="block mb-3">
                <h3 className="font-bold text-[#191F28] hover:text-[#3182F6] transition-colors">
                  도서 #{item.book_id}
                </h3>
                {item.memo && <p className="text-sm text-[#6B7684] mt-1">{item.memo}</p>}
              </Link>
              <Button
                variant="outlined"
                size="sm"
                onClick={() => remove(item.id)}
                loading={isPending}
              >
                <Bookmark className="w-4 h-4" /> 삭제
              </Button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}