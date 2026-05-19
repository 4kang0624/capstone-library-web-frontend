'use client';

import { use } from 'react';
import { useBook } from '@/features/books/queries';
import { useBookCopiesByBook } from '@/features/book-copies/queries';
import { BookDetailView } from '@/features/books/components/BookDetailView';
import { BookCopyCard } from '@/features/book-copies/components/BookCopyCard';
import { LoadingState } from '@/components/common/LoadingState';
import { EmptyState } from '@/components/common/EmptyState';
import { useMyWishlists } from '@/features/wishlists/queries';
import { useMyBookmarks } from '@/features/bookmarks/queries';
import { useAddWishlistMutation, useRemoveWishlistMutation } from '@/features/wishlists/mutations';
import { useUpsertBookmarkMutation, useDeleteBookmarkMutation } from '@/features/bookmarks/mutations';
import { useState } from 'react';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { useCreateRentalMutation } from '@/features/rentals/mutations';
import { DeliveryMethod } from '@/types/enums';
import type { BookCopy } from '@/features/book-copies/types';

export default function BookDetailPage({ params }: { params: Promise<{ bookId: string }> }) {
  const { bookId } = use(params);
  const id = parseInt(bookId);

  const { data: book, isLoading: bookLoading } = useBook(id);
  const { data: copies = [], isLoading: copiesLoading } = useBookCopiesByBook(id);
  const { data: wishlists = [] } = useMyWishlists();
  const { data: bookmarks = [] } = useMyBookmarks();
  const { mutateAsync: addWishlist } = useAddWishlistMutation();
  const { mutateAsync: removeWishlist } = useRemoveWishlistMutation();
  const { mutateAsync: upsertBookmark } = useUpsertBookmarkMutation();
  const { mutateAsync: deleteBookmark } = useDeleteBookmarkMutation();
  const { mutateAsync: createRental, isPending: renting } = useCreateRentalMutation();

  const [selectedCopy, setSelectedCopy] = useState<BookCopy | null>(null);
  const [shipping, setShipping] = useState('');

  const wishlistItem = wishlists.find((w) => w.book_id === id);
  const bookmarkItem = bookmarks.find((b) => b.book_id === id);

  if (bookLoading) return <LoadingState />;
  if (!book) return <EmptyState title="도서를 찾을 수 없습니다" />;

  const handleWishlist = async () => {
    if (wishlistItem) {
      await removeWishlist(wishlistItem.id);
    } else {
      await addWishlist({ book_id: id });
    }
  };

  const handleBookmark = async () => {
    if (bookmarkItem) {
      await deleteBookmark(bookmarkItem.id);
    } else {
      await upsertBookmark({ book_id: id, memo: '' });
    }
  };

  const handleRent = async () => {
    if (!selectedCopy) return;
    await createRental({
      book_copy_id: selectedCopy.id,
      delivery_method: DeliveryMethod.PARCEL,
      shipping_address: shipping,
      deposit_wei: '0',
      shipping_fee_wei: '0',
    });
    setSelectedCopy(null);
    setShipping('');
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="bg-white rounded-2xl border border-[#E5E8EB] p-8 mb-8">
        <BookDetailView
          book={book}
          isWishlisted={!!wishlistItem}
          isBookmarked={!!bookmarkItem}
          onWishlist={handleWishlist}
          onBookmark={handleBookmark}
        />
      </div>

      <h2 className="text-2xl font-bold text-[#191F28] mb-4">대여 가능한 사본</h2>
      {copiesLoading ? (
        <LoadingState />
      ) : copies.length === 0 ? (
        <EmptyState title="현재 대여 가능한 사본이 없습니다" />
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {copies.map((copy) => (
            <BookCopyCard key={copy.id} copy={copy} onClick={() => setSelectedCopy(copy)} />
          ))}
        </div>
      )}

      <Modal
        open={!!selectedCopy}
        onClose={() => { setSelectedCopy(null); setShipping(''); }}
        title="대여 신청"
      >
        {selectedCopy && (
          <div className="flex flex-col gap-4">
            <p className="text-[#4E5968]">
              <span className="font-bold text-[#191F28]">{book.title}</span>을(를) 대여하시겠습니까?
            </p>
            <input
              className="w-full border border-[#E5E8EB] rounded-xl px-4 py-3 text-[#191F28] focus:border-[#3182F6] outline-none placeholder:text-[#8B95A1]"
              placeholder="배송 주소를 입력하세요"
              value={shipping}
              onChange={(e) => setShipping(e.target.value)}
            />
            <div className="flex gap-3 justify-end">
              <Button variant="outlined" onClick={() => { setSelectedCopy(null); setShipping(''); }}>취소</Button>
              <Button onClick={handleRent} loading={renting} disabled={!shipping}>대여 신청</Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}