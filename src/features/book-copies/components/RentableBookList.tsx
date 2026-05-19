'use client';

import { useState } from 'react';
import { useRentableBookCopies } from '../queries';
import { BookCopyCard } from './BookCopyCard';
import { EmptyState } from '@/components/common/EmptyState';
import { LoadingState } from '@/components/common/LoadingState';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { useCreateRentalMutation } from '@/features/rentals/mutations';
import { DeliveryMethod } from '@/types/enums';
import type { BookCopy } from '../types';

export function RentableBookList() {
  const { data: copies = [], isLoading } = useRentableBookCopies();
  const { mutateAsync: createRental, isPending } = useCreateRentalMutation();
  const [selected, setSelected] = useState<BookCopy | null>(null);
  const [shipping, setShipping] = useState('');

  if (isLoading) return <LoadingState />;
  if (copies.length === 0) return <EmptyState title="대여 가능한 도서가 없습니다" />;

  const handleRent = async () => {
    if (!selected) return;
    await createRental({
      book_copy_id: selected.id,
      delivery_method: DeliveryMethod.PARCEL,
      shipping_address: shipping,
      deposit_wei: '0',
      shipping_fee_wei: '0',
    });
    setSelected(null);
    setShipping('');
  };

  return (
    <>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {copies.map((copy) => (
          <BookCopyCard key={copy.id} copy={copy} onClick={() => setSelected(copy)} />
        ))}
      </div>

      <Modal open={!!selected} onClose={() => { setSelected(null); setShipping(''); }} title="대여 신청">
        {selected && (
          <div className="flex flex-col gap-4">
            <p className="text-[#4E5968]">
              <span className="font-bold text-[#191F28]">{selected.title}</span>
              을(를) 대여하시겠습니까?
            </p>
            <input
              className="w-full border border-[#E5E8EB] rounded-xl px-4 py-3 text-[#191F28] focus:border-[#3182F6] outline-none placeholder:text-[#8B95A1]"
              placeholder="배송 주소를 입력하세요"
              value={shipping}
              onChange={(e) => setShipping(e.target.value)}
            />
            <div className="flex gap-3 justify-end">
              <Button variant="outlined" onClick={() => { setSelected(null); setShipping(''); }}>취소</Button>
              <Button onClick={handleRent} loading={isPending} disabled={!shipping}>대여 신청</Button>
            </div>
          </div>
        )}
      </Modal>
    </>
  );
}
