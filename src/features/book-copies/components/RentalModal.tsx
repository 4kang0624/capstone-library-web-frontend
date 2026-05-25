'use client';

import { useState } from 'react';
import DaumPostcode, { type Address } from 'react-daum-postcode';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import type { Book } from '@/features/books/types';
import type { BookCopy } from '../types';
import { BookCopyConditionStatusLabel } from '@/types/enums';
import type { BookCopyConditionStatus } from '@/types/enums';
import { Package, User } from 'lucide-react';

interface RentalModalProps {
  open: boolean;
  book: Book | null;
  selectedCopy: BookCopy | null;
  onClose: () => void;
  onConfirm: (rentalDays: number, shippingAddress: string) => Promise<void>;
  loading?: boolean;
}

const getOwnerName = (copy: BookCopy) =>
  copy.owner_nickname || '알 수 없는 소유자';

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
  const [step, setStep] = useState<1 | 2>(1);
  const [rentalDays, setRentalDays] = useState(7);
  const [zonecode, setZonecode] = useState('');
  const [baseAddress, setBaseAddress] = useState('');
  const [detailAddress, setDetailAddress] = useState('');
  const [showPostcode, setShowPostcode] = useState(false);

  const handleAddressComplete = (data: Address) => {
    setZonecode(data.zonecode);
    setBaseAddress(data.roadAddress || data.jibunAddress);
    setDetailAddress('');
    setShowPostcode(false);
  };

  const combinedAddress = baseAddress
    ? `${baseAddress} ${detailAddress} (우)${zonecode}`.trim()
    : '';

  const handleConfirm = async () => {
    await onConfirm(rentalDays, combinedAddress);
    handleReset();
  };

  const handleReset = () => {
    setStep(1);
    setRentalDays(7);
    setZonecode('');
    setBaseAddress('');
    setDetailAddress('');
    setShowPostcode(false);
  };

  const handleClose = () => {
    handleReset();
    onClose();
  };

  const isStep1Valid = !!baseAddress.trim();

  const BookCopyInfoCard = () =>
    book && selectedCopy ? (
      <Card className="bg-bg-light-2" padding="md">
        <div className="space-y-5">
          {/* Book Information Section */}
          <div className="space-y-1 font-serif">
            <h3 className="font-bold text-lg text-text-dark">
              {book.title}
            </h3>
            {book.author && (
              <p className="text-sm text-text-gray">
                <span className="text-text-dark font-medium">{book.author}</span>
              </p>
            )}
            {book.publisher && (
              <p className="text-xs text-text-gray">
                <span className="text-text-dark font-medium">{book.publisher}</span>
              </p>
            )}
          </div>

          {/* Divider */}
          <div className="border-t border-border/30" />

          {/* Copy Owner & Condition Section */}
          <div className="space-y-3">
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <User className="w-6 h-6 text-text-gray" />
                <div className="space-y-0">
                  <p className="text-xs text-text-gray">소유자</p>
                  <p className="font-medium text-text-dark">{getOwnerName(selectedCopy)}</p>
                </div>
              </div>
              <Badge variant={getConditionBadgeVariant(selectedCopy.condition_status)}>
                상태: {BookCopyConditionStatusLabel[selectedCopy.condition_status]}
              </Badge>
            </div>
            <p className="text-xs text-text-gray flex items-center gap-1">
              <Package size={14} className="inline" />
              배송 대여 · 소유자 승인 필요
            </p>
          </div>
        </div>
      </Card>
    ) : null;

  return (
    <Modal open={open} onClose={handleClose} title="대여 신청">
      {book && selectedCopy && (
        <div className="space-y-6">
          {/* Step Indicator */}
          <div className="flex items-center gap-2">
            <div className={`flex items-center justify-center w-7 h-7 rounded-full text-sm font-bold ${step === 1 ? 'bg-primary-blue-3 text-white' : 'bg-primary-blue-3 text-white'}`}>1</div>
            <div className="flex-1 h-0.5 bg-border" />
            <div className={`flex items-center justify-center w-7 h-7 rounded-full text-sm font-bold ${step === 2 ? 'bg-primary-blue-3 text-white' : 'bg-border-light text-text-gray'}`}>2</div>
          </div>

          {step === 1 && (
            <>
              <BookCopyInfoCard />

              {/* Rental Details */}
              <div className="space-y-4">
                <Input
                  label="대여 기간 (일)"
                  type="number"
                  min={1}
                  max={30}
                  value={rentalDays}
                  onChange={(e) => setRentalDays(Math.max(1, Math.min(30, parseInt(e.target.value) || 1)))}
                  placeholder="대여 일수"
                />

                {/* 주소 검색 */}
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-text-dark">배송 주소</label>
                  <div className="flex gap-2">
                    <Input
                      value={zonecode}
                      readOnly
                      placeholder="우편번호"
                      className="w-32 flex-shrink-0"
                    />
                    <Button
                      type="button"
                      variant="outlined"
                      onClick={() => setShowPostcode((v) => !v)}
                    >
                      주소 검색
                    </Button>
                  </div>
                  {showPostcode && (
                    <div className="border border-border rounded-xl overflow-hidden">
                      <DaumPostcode onComplete={handleAddressComplete} autoClose={false} />
                    </div>
                  )}
                  <Input
                    value={baseAddress}
                    readOnly
                    placeholder="기본 주소"
                  />
                  <Input
                    value={detailAddress}
                    onChange={(e) => setDetailAddress(e.target.value)}
                    placeholder="상세 주소를 입력하세요"
                    disabled={!baseAddress}
                  />
                </div>
              </div>

              <div className="flex gap-3 justify-end pt-4">
                <Button variant="outlined" onClick={handleClose}>취소</Button>
                <Button onClick={() => setStep(2)} disabled={!isStep1Valid}>다음</Button>
              </div>
            </>
          )}

          {step === 2 && (
            <>
              <BookCopyInfoCard />

              {/* Payment Info */}
              <Card className="bg-bg-light-blue-1 border border-border/20" padding="md">
                <h4 className="font-semibold text-text-dark mb-3">결제 정보</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center justify-between">
                    <span className="text-text-gray">결제 방식</span>
                    <span className="text-text-dark">스마트 컨트랙트</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-text-gray">보증금</span>
                    <span className="text-text-dark">승인 후 확정</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-text-gray">배송비</span>
                    <span className="text-text-dark">승인 후 확정</span>
                  </div>
                  <div className="border-t border-border/30 pt-2 flex items-center justify-between">
                    <span className="font-semibold text-text-dark">총 결제 금액</span>
                    <span className="font-semibold text-text-dark">승인 후 확인 가능</span>
                  </div>
                </div>
              </Card>

              {/* Notice */}
              <Card className="bg-warning/5 border border-warning/20" padding="md">
                <h4 className="font-semibold text-text-dark mb-3">💡 안내사항</h4>
                <ul className="space-y-2 text-xs text-text-gray">
                  <li className="flex gap-2">
                    <span>•</span>
                    <span>소유자가 승인하면 보증금과 배송비가 안내됩니다.</span>
                  </li>
                  <li className="flex gap-2">
                    <span>•</span>
                    <span>결제는 스마트 컨트랙트를 통해 안전하게 진행됩니다.</span>
                  </li>
                  <li className="flex gap-2">
                    <span>•</span>
                    <span>보증금은 반납 완료 후 조건에 따라 환불됩니다.</span>
                  </li>
                </ul>
              </Card>

              <div className="flex gap-3 justify-end pt-4">
                <Button variant="outlined" onClick={() => setStep(1)}>이전</Button>
                <Button
                  onClick={handleConfirm}
                  loading={loading}
                  disabled={!combinedAddress.trim()}
                >
                  신청하기
                </Button>
              </div>
            </>
          )}
        </div>
      )}
    </Modal>
  );
}
