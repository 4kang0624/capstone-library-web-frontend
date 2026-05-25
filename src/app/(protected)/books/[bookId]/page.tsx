'use client';

import { use } from 'react';
import Image from 'next/image';
import { ArrowLeft, Heart, LibraryBig, Check, Loader } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useBook } from '@/features/books/queries';
import { useBookCopiesByBook, useMyBookCopies } from '@/features/book-copies/queries';
import { LoadingState } from '@/components/common/LoadingState';
import { EmptyState } from '@/components/common/EmptyState';
import { useMyWishlists } from '@/features/wishlists/queries';
import { useAddWishlistMutation, useRemoveWishlistMutation } from '@/features/wishlists/mutations';
import { useCreateBookCopyMutation } from '@/features/book-copies/mutations';
import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { AvailableCopiesSection, RentalModal } from '@/features/book-copies/components';
import { useCreateRentalMutation } from '@/features/rentals/mutations';
import { DeliveryMethod, BookCopyConditionStatus, BookCopyCurrentStatus } from '@/types/enums';
import type { BookCopy } from '@/features/book-copies/types';
import { cn } from '@/lib/utils/cn';
import { useToast } from '@/hooks/useToast';
import { parseAxiosError } from '@/lib/api/errors';

export default function BookDetailPage({ params }: { params: Promise<{ bookId: string }> }) {
  const router = useRouter();
  const { bookId } = use(params);
  const id = parseInt(bookId);
  const { addToast } = useToast();

  const { data: book, isLoading: bookLoading } = useBook(id);
  const { data: copies = [], isLoading: copiesLoading } = useBookCopiesByBook(id);
  const { data: myCopies = [] } = useMyBookCopies();
  const { data: wishlists = [] } = useMyWishlists();
  const { mutateAsync: addWishlist } = useAddWishlistMutation();
  const { mutateAsync: removeWishlist } = useRemoveWishlistMutation();
  const { mutateAsync: createBookCopy, isPending: isAddingToLibrary } = useCreateBookCopyMutation();
  const { mutateAsync: createRental, isPending: renting } = useCreateRentalMutation();

  const [selectedCopy, setSelectedCopy] = useState<BookCopy | null>(null);
  const [rentalModalOpen, setRentalModalOpen] = useState(false);

  const wishlistItem = wishlists.find((w) => w.book_id === id);
  const myBookCopy = myCopies.find((c) => c.book_id === id);
  const rentableCopies = copies.filter((c) => c.is_available_for_rent && c.current_status === BookCopyCurrentStatus.AVAILABLE);

  if (bookLoading) return <LoadingState />;
  if (!book) return <EmptyState title="도서를 찾을 수 없습니다" />;

  const handleWishlist = async () => {
    if (wishlistItem) {
      await removeWishlist(wishlistItem.id);
    } else {
      await addWishlist({ book_id: id });
    }
  };

  const handleAddToLibrary = async () => {
    if (myBookCopy || isAddingToLibrary) return;
    
    try {
      await createBookCopy({ 
        book_id: id, 
        condition_status: BookCopyConditionStatus.GOOD,
        is_available_for_rent: false 
      });
      addToast('내 서재에 도서를 추가했습니다', 'success');
    } catch (error) {
      console.error('Failed to add book to library:', error);
      addToast(parseAxiosError(error).message, 'error');
    }
  };

  const handleSelectCopy = (copy: BookCopy) => {
    setSelectedCopy(copy);
  };

  const handleRentalConfirm = async (rentalDays: number, shippingAddress: string) => {
    if (!selectedCopy) return;
    try {
      const dueDate = new Date();
      dueDate.setDate(dueDate.getDate() + rentalDays);
      const dueDateStr = dueDate.toISOString().split('T')[0];
      await createRental({
        book_copy_id: selectedCopy.id,
        delivery_method: DeliveryMethod.PARCEL,
        shipping_address: shippingAddress,
        deposit_wei: '0',
        shipping_fee_wei: '0',
        due_date: dueDateStr,
      });
      setSelectedCopy(null);
      setRentalModalOpen(false);
    } catch (error) {
      console.error('Failed to create rental:', error);
      addToast(parseAxiosError(error).message, 'error');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header with Back Button and Library Button */}
      <div className="flex justify-between items-center mb-6">
        <Button
          variant="text"
          onClick={() => router.back()}
          className="gap-2"
        >
          <ArrowLeft className="w-4 h-4" />
          뒤로가기
        </Button>
        <Button
          variant="text"
          onClick={handleAddToLibrary}
          disabled={!!myBookCopy || isAddingToLibrary}
          className={cn(
            'flex items-center gap-2 px-4 py-3 rounded-lg transition-all duration-300 font-medium',
            myBookCopy || isAddingToLibrary
              ? 'bg-bg-light-3 text-text-gray border border-gray cursor-not-allowed'
              : 'bg-bg-light-1 text-primary-blue-3 border border-primary-blue-3 hover:bg-primary-blue-2 active:scale-95'
          )}
        >
          {isAddingToLibrary ? (
            <>
              <Loader className="w-5 h-5 animate-spin" />
              <span>추가 중...</span>
            </>
          ) : myBookCopy ? (
            <>
              <Check className="w-5 h-5 animate-pulse" />
              <span>서재 등록 완료</span>
            </>
          ) : (
            <>
              <LibraryBig className="w-5 h-5" />
              <span>내 서재 추가</span>
            </>
          )}
        </Button>
      </div>

      {/* Main Grid Layout */}
      <div className="grid md:grid-cols-3 gap-8">
        {/* Left Column: Book Cover */}
        <div className="md:col-span-1">
          <Card padding="none">
            <div className="aspect-[2/3] relative bg-gradient-to-br from-primary-blue-1 to-primary-blue-2 rounded-2xl overflow-hidden">
              {book.cover_image_url ? (
                <Image 
                  src={book.cover_image_url} 
                  alt={book.title} 
                  fill 
                  className="object-cover"
                  priority
                />
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center p-8 text-center">
                  <p className="font-bold text-2xl text-text-dark mb-2">{book.title}</p>
                  <p className="text-lg text-text-medium">{book.author}</p>
                </div>
              )}
            </div>
          </Card>
        </div>

        {/* Right Column: Details and Copies */}
        <div className="md:col-span-2 space-y-6">
          {/* Book Info Section */}
          <div>
            <h1 className="font-serif text-4xl font-bold text-text-dark mb-3">{book.title}</h1>
            <p className="font-serif text-2xl text-text-medium font-semibold mb-4">{book.author}</p>
            <div className="flex gap-4 text-sm text-text-gray mb-4">
              <span className="font-medium">출판사: {book.publisher}</span>
              <span>•</span>
              {book.published_date && (
                <span className="font-medium">출간일: {book.published_date}</span>
              )}
            </div>
          </div>

          {/* Book Description */}
          {book.description && (
            <div>
              <h2 className="font-bold text-xl text-text-dark mb-3">책 소개</h2>
              <p className="text-text-medium leading-relaxed">{book.description}</p>
            </div>
          )}

          {/* Available Copies Card */}
          <Card padding="lg">
            <AvailableCopiesSection
              copies={rentableCopies}
              selectedCopy={selectedCopy}
              onSelectCopy={handleSelectCopy}
              loading={copiesLoading}
            />
          </Card>

          {/* Rental Button */}
          <div className="flex gap-3">
            <Button
              onClick={() => {
                if (selectedCopy) {
                  setRentalModalOpen(true);
                } else if (rentableCopies.length > 0) {
                  setSelectedCopy(rentableCopies[0]);
                  setRentalModalOpen(true);
                }
              }}
              size="lg"
              fullWidth
            >
              대여 신청
            </Button>
            <Button
              variant="outlined"
              onClick={handleWishlist}
              size="lg"
            >
              <Heart className={cn('w-5 h-5', wishlistItem && 'fill-primary-blue-3')} />
            </Button>
          </div>
        </div>
      </div>

      {/* Rental Modal */}
      <RentalModal
        open={rentalModalOpen}
        book={book}
        selectedCopy={selectedCopy}
        onClose={() => {
          setRentalModalOpen(false);
          setSelectedCopy(null);
        }}
        onConfirm={handleRentalConfirm}
        loading={renting}
      />
    </div>
  );
}
