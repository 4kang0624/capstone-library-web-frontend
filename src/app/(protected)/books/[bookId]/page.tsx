'use client';

import { use } from 'react';
import Image from 'next/image';
import { ArrowLeft, Heart, LibraryBig, Check, MapPin } from 'lucide-react';
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
import { Badge } from '@/components/ui/Badge';
import { RentalModal } from '@/features/book-copies/components';
import { useCreateRentalMutation } from '@/features/rentals/mutations';
import { DeliveryMethod, BookCopyConditionStatus, BookCopyConditionStatusLabel } from '@/types/enums';
import type { BookCopy } from '@/features/book-copies/types';
import { cn } from '@/lib/utils/cn';

export default function BookDetailPage({ params }: { params: Promise<{ bookId: string }> }) {
  const router = useRouter();
  const { bookId } = use(params);
  const id = parseInt(bookId);

  const { data: book, isLoading: bookLoading } = useBook(id);
  const { data: copies = [], isLoading: copiesLoading } = useBookCopiesByBook(id);
  const { data: myCopies = [] } = useMyBookCopies();
  const { data: wishlists = [] } = useMyWishlists();
  const { mutateAsync: addWishlist } = useAddWishlistMutation();
  const { mutateAsync: removeWishlist } = useRemoveWishlistMutation();
  const { mutateAsync: createBookCopy } = useCreateBookCopyMutation();
  const { mutateAsync: createRental, isPending: renting } = useCreateRentalMutation();

  const [selectedCopy, setSelectedCopy] = useState<BookCopy | null>(null);
  const [rentalModalOpen, setRentalModalOpen] = useState(false);

  const wishlistItem = wishlists.find((w) => w.book_id === id);
  const myBookCopy = myCopies.find((c) => c.book_id === id);

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
    if (!myBookCopy) {
      await createBookCopy({ 
        book_id: id, 
        condition_status: BookCopyConditionStatus.GOOD,
        is_available_for_rent: false 
      });
    }
  };

  const handleSelectCopy = (copy: BookCopy) => {
    setSelectedCopy(copy);
    setRentalModalOpen(true);
  };

  const handleRentalConfirm = async (rentalDays: number, shippingAddress: string) => {
    if (!selectedCopy) return;
    try {
      await createRental({
        book_copy_id: selectedCopy.id,
        delivery_method: DeliveryMethod.PARCEL,
        shipping_address: shippingAddress,
        deposit_wei: '0',
        shipping_fee_wei: '0',
      });
      setSelectedCopy(null);
      setRentalModalOpen(false);
    } catch (error) {
      console.error('Failed to create rental:', error);
    }
  };

  const getConditionBadgeVariant = (condition: string) => {
    switch (condition) {
      case 'GOOD':
        return 'success';
      case 'FAIR':
        return 'warning';
      case 'POOR':
        return 'error';
      default:
        return 'default';
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
          disabled={!!myBookCopy}
          className={cn(
            'flex items-center gap-2 px-4 py-3 rounded-lg transition-all duration-300 font-medium',
            myBookCopy
              ? 'bg-bg-light-3 text-text-gray border border-gray cursor-not-allowed'
              : 'bg-bg-light-1 text-primary-blue-3 border border-primary-blue-3 hover:bg-primary-blue-2 active:scale-95'
          )}
        >
          {myBookCopy ? (
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
            <h1 className="text-4xl font-bold text-text-dark mb-3">{book.title}</h1>
            <p className="text-2xl text-text-medium font-semibold mb-4">{book.author}</p>
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
            <h2 className="font-semibold text-lg text-text-dark mb-4">
              대여 가능한 도서 ({copies.length}권)
            </h2>

            {copiesLoading ? (
              <div className="text-center py-8 text-text-light">로드 중...</div>
            ) : copies.length === 0 ? (
              <div className="text-center py-8 text-text-light">현재 대여 가능한 사본이 없습니다</div>
            ) : (
              <div className="space-y-3">
                {copies.map((copy) => (
                  <div
                    key={copy.id}
                    onClick={() => handleSelectCopy(copy)}
                    className={cn(
                      'p-5 border-2 rounded-2xl cursor-pointer transition-all',
                      selectedCopy?.id === copy.id
                        ? 'border-primary-blue-3 bg-primary-blue-1/10 shadow-md'
                        : 'border-border hover:border-primary-blue-2 hover:shadow-sm'
                    )}
                  >
                    <div className="space-y-4">
                      {/* Owner and Condition */}
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <p className="font-bold text-lg text-text-dark">Owner {copy.owner_user_id}</p>
                          <div className="flex items-center gap-2 text-sm text-text-gray mt-2">
                            <MapPin className="w-4 h-4" />
                            <span>위치 정보 로드 중</span>
                            <span>•</span>
                            <span className="text-primary-blue-3 font-semibold">거리 계산 중</span>
                          </div>
                        </div>
                        <Badge variant={getConditionBadgeVariant(copy.condition_status)}>
                          상태: {BookCopyConditionStatusLabel[copy.condition_status as keyof typeof BookCopyConditionStatusLabel]}
                        </Badge>
                      </div>

                      {/* Pricing */}
                      <div className="grid grid-cols-2 gap-4 text-sm pt-2 border-t border-border">
                        <div className="flex justify-between">
                          <span className="text-text-gray">일일 대여료:</span>
                          <span className="font-bold text-text-dark">가격 정보 로드</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-text-gray">보증금:</span>
                          <span className="font-bold text-text-dark">가격 정보 로드</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </Card>

          {/* Rental Button */}
          <div className="flex gap-3">
            <Button
              onClick={() => {
                if (selectedCopy) {
                  setRentalModalOpen(true);
                } else if (copies.length > 0) {
                  handleSelectCopy(copies[0]);
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