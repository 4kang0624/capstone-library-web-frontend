'use client';

import { useState } from 'react';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import type { Book } from '@/features/books/types';
import type { BookCopy } from '../types';
import { BookCopyConditionStatusLabel } from '@/types/enums';
import type { BookCopyConditionStatus } from '@/types/enums';

interface RentalModalProps {
  open: boolean;
  book: Book | null;
  selectedCopy: BookCopy | null;
  onClose: () => void;
  onConfirm: (rentalDays: number, shippingAddress: string) => Promise<void>;
  loading?: boolean;
}

// Mock pricing data - would come from API
const MOCK_PRICING = {
  [1]: { dailyFee: 1200, deposit: 18000 },
  [2]: { dailyFee: 1000, deposit: 15000 },
};

const getConditionBadgeVariant = (condition: BookCopyConditionStatus) => {
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

export function RentalModal({
  open,
  book,
  selectedCopy,
  onClose,
  onConfirm,
  loading = false,
}: RentalModalProps) {
  const [rentalDays, setRentalDays] = useState(7);
  const [shippingAddress, setShippingAddress] = useState('');

  const pricing = selectedCopy?.id ? MOCK_PRICING[selectedCopy.id as keyof typeof MOCK_PRICING] : null;
  const dailyFee = pricing?.dailyFee || 0;
  const deposit = pricing?.deposit || 0;
  const totalRentalFee = dailyFee * rentalDays;
  const totalCost = totalRentalFee + deposit;

  const handleConfirm = async () => {
    await onConfirm(rentalDays, shippingAddress);
    handleReset();
  };

  const handleReset = () => {
    setRentalDays(7);
    setShippingAddress('');
  };

  const handleClose = () => {
    handleReset();
    onClose();
  };

  return (
    <Modal open={open} onClose={handleClose} title="대여 신청">
      {book && selectedCopy && (
        <div className="space-y-6">
          {/* Book & Copy Info */}
          <Card className="bg-bg-light-2" padding="md">
            <div className="space-y-2">
              <p className="font-bold text-lg text-text-dark">{book.title}</p>
              <p className="text-sm text-text-gray">
                <span className="font-semibold">소유자:</span> Owner {selectedCopy.owner_user_id}
              </p>
              <p className="text-sm text-text-gray">
                <span className="font-semibold">위치:</span> 위치 정보 로드 중
              </p>
              <p className="text-sm text-text-gray">
                <span className="font-semibold">상태:</span>{' '}
                <Badge variant={getConditionBadgeVariant(selectedCopy.condition_status)}>
                  {BookCopyConditionStatusLabel[selectedCopy.condition_status]}
                </Badge>
              </p>
            </div>
          </Card>

          {/* Rental Days Input */}
          <Input
            label="대여 기간 (일)"
            type="number"
            min={1}
            max={30}
            value={rentalDays}
            onChange={(e) => setRentalDays(Math.max(1, Math.min(30, parseInt(e.target.value) || 1)))}
            placeholder="대여 일수"
          />

          {/* Shipping Address Input */}
          <Input
            label="배송 주소"
            type="text"
            value={shippingAddress}
            onChange={(e) => setShippingAddress(e.target.value)}
            placeholder="배송 주소를 입력하세요"
          />

          {/* Cost Summary */}
          <Card className="bg-gradient-to-br from-primary-blue-1/20 to-primary-blue-1/5" padding="md">
            <div className="space-y-3">
              <div className="flex justify-between items-center text-sm text-text-dark">
                <span>일일 대여료:</span>
                <span className="font-semibold">{dailyFee.toLocaleString()}원</span>
              </div>
              <div className="flex justify-between items-center text-sm text-text-dark">
                <span>대여 일수:</span>
                <span className="font-semibold">{rentalDays}일</span>
              </div>
              <div className="flex justify-between items-center text-sm text-text-dark">
                <span>총 대여료:</span>
                <span className="font-bold">{totalRentalFee.toLocaleString()}원</span>
              </div>
              <div className="flex justify-between items-center text-sm text-text-dark">
                <span>보증금:</span>
                <span className="font-bold">{deposit.toLocaleString()}원</span>
              </div>

              <div className="border-t border-primary-blue-2/50 pt-3 mt-2">
                <div className="flex justify-between items-center">
                  <span className="font-bold text-text-dark">총 결제 금액:</span>
                  <span className="font-bold text-2xl text-primary-blue-3">
                    {totalCost.toLocaleString()}원
                  </span>
                </div>
              </div>
            </div>
          </Card>

          {/* Notice */}
          <Card className="bg-warning/5" padding="sm">
            <p className="text-xs text-text-gray leading-relaxed">
              <span className="font-semibold text-text-dark">💡 안내사항</span>
              <br />• 보증금은 도서 반납 후 자동으로 환불됩니다
              <br />• 스마트 컨트랙트를 통해 안전하게 거래가 진행됩니다
            </p>
          </Card>

          {/* Actions */}
          <div className="flex gap-3 justify-end">
            <Button variant="outlined" onClick={handleClose}>
              취소
            </Button>
            <Button
              onClick={handleConfirm}
              loading={loading}
              disabled={!shippingAddress.trim()}
            >
              신청하기
            </Button>
          </div>
        </div>
      )}
    </Modal>
  );
}
