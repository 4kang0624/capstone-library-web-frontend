'use client';

import { MapPin } from 'lucide-react';
import type { BookCopy } from '../types';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { BookCopyConditionStatusLabel } from '@/types/enums';
import type { BookCopyConditionStatus } from '@/types/enums';
import { cn } from '@/lib/utils/cn';

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
              'p-5 border-2 rounded-2xl cursor-pointer transition-all',
              selectedCopy?.id === copy.id
                ? 'border-primary-blue-3 bg-primary-blue-1/10 shadow-md shadow-primary-blue-3/10'
                : 'border-border hover:border-primary-blue-2 hover:shadow-sm'
            )}
          >
            <div className="space-y-4">
              {/* Owner Info */}
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  {/* Owner Name - would come from owner data */}
                  <p className="font-bold text-lg text-text-dark">
                    {/* Mock owner name - replace with actual owner data from API */}
                    Owner {copy.owner_user_id}
                  </p>

                  {/* Location Info - would come from owner profile */}
                  <div className="flex items-center gap-2 text-sm text-text-gray mt-2">
                    <MapPin className="w-4 h-4" />
                    <span>위치 정보 로드 중</span>
                    <span>•</span>
                    <span className="text-primary-blue-3 font-semibold">거리 계산 중</span>
                  </div>
                </div>

                {/* Condition Badge */}
                <Badge variant={getConditionBadgeVariant(copy.condition_status)}>
                  상태: {BookCopyConditionStatusLabel[copy.condition_status]}
                </Badge>
              </div>

              {/* Pricing Info */}
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="flex justify-between">
                  <span className="text-text-gray">일일 대여료:</span>
                  <span className="font-bold text-text-dark">가격 정보 로드 중</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-text-gray">보증금:</span>
                  <span className="font-bold text-text-dark">가격 정보 로드 중</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
