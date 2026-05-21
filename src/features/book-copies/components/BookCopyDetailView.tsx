import type { BookCopy } from '../types';
import { CopyStatusBadge } from '@/components/common/StatusBadge';
import { BookCopyConditionStatusLabel } from '@/types/enums';

export function BookCopyDetailView({ copy }: { copy: BookCopy }) {
  return (
    <div className="bg-white rounded-2xl border border-border p-6">
      <h2 className="text-xl font-bold text-text-dark mb-4">도서 상세 정보</h2>
      <dl className="grid grid-cols-2 gap-4 text-sm">
        <div>
          <dt className="text-text-gray mb-1">상태</dt>
          <dd><CopyStatusBadge status={copy.current_status} /></dd>
        </div>
        <div>
          <dt className="text-text-gray mb-1">도서 컨디션</dt>
          <dd className="font-semibold text-text-dark">{BookCopyConditionStatusLabel[copy.condition_status]}</dd>
        </div>
        <div>
          <dt className="text-text-gray mb-1">대여 가능</dt>
          <dd className="font-semibold text-text-dark">{copy.is_available_for_rent ? '가능' : '불가'}</dd>
        </div>
        {copy.memo && (
          <div className="col-span-2">
            <dt className="text-text-gray mb-1">메모</dt>
            <dd className="font-semibold text-text-dark">{copy.memo}</dd>
          </div>
        )}
      </dl>
    </div>
  );
}
