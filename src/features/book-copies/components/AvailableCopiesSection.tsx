'use client';

import type { BookCopy } from '../types';
import { Badge } from '@/components/ui/Badge';
import { BookCopyConditionStatusLabel } from '@/types/enums';
import type { BookCopyConditionStatus } from '@/types/enums';
import { cn } from '@/lib/utils/cn';
import { Package, User } from 'lucide-react';

const getOwnerName = (copy: BookCopy) =>
  copy.owner_nickname || '알 수 없는 소유자';

interface AvailableCopiesSectionProps {
  copies: BookCopy[];
  selectedCopy: BookCopy | null;
  onSelectCopy: (copy: BookCopy) => void;
  loading?: boolean;
}

export function AvailableCopiesSection({
  copies,
  selectedCopy,
  onSelectCopy,
  loading = false,
}: AvailableCopiesSectionProps) {
  if (loading) {
    return (
      <div className="space-y-4">
        <h2 className="text-xl font-bold text-text-dark">대여 가능한 도서 ({copies.length}권)</h2>
        <div className="text-center text-text-light py-8">로드 중...</div>
      </div>
    );
  }

  if (copies.length === 0) {
    return (
      <div className="space-y-4">
        <h2 className="text-xl font-bold text-text-dark">대여 가능한 도서</h2>
        <div className="text-center text-text-light py-8">현재 대여 가능한 사본이 없습니다</div>
      </div>
    );
  }

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

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold text-text-dark">
        대여 가능한 도서 ({copies.length}권)
      </h2>

      <div className="space-y-3">
        {copies.map((copy) => (
          <div
            key={copy.id}
            onClick={() => onSelectCopy(copy)}
            className={cn(
              'p-5 border-1 rounded-2xl cursor-pointer transition-all',
              selectedCopy?.id === copy.id
                ? 'border-primary-blue-3 bg-primary-blue-1/10 shadow-md shadow-primary-blue-3/10'
                : 'border-border hover:border-primary-blue-2 hover:shadow-sm'
            )}
          >
            {/* Owner Info */}
            <div className="flex justify-between items-start mb-4">
              <div className="flex-1">
                <p className="font-bold text-lg text-text-dark flex items-center gap-1">
                  <User className="w-4 h-4 inline-block text-gray" />
                  {getOwnerName(copy)}
                  </p>
                <p className="text-sm text-text-gray mt-1 flex items-center gap-1">
                  <Package className="w-4 h-4 inline-block text-gray" />
                  배송 대여 · 소유자 승인 필요
                </p>
              </div>

              {/* Condition Badge */}
              <Badge variant={getConditionBadgeVariant(copy.condition_status)}>
                상태: {BookCopyConditionStatusLabel[copy.condition_status]}
              </Badge>
            </div>

            {/* Pricing Info */}
            <div className="border-t border-border/30 pt-4">
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <p className="text-xs text-text-gray mb-1">보증금</p>
                  <p className="text-sm font-bold text-text-dark">승인 후 확정</p>
                </div>
                <div>
                  <p className="text-xs text-text-gray mb-1">배송료</p>
                  <p className="text-sm font-bold text-text-dark">승인 후 확정</p>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
