import React from 'react';
import { AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils/cn';

interface ErrorStateProps {
  message?: string;
  onRetry?: () => void;
  className?: string;
}

export function ErrorState({ message = '오류가 발생했습니다.', onRetry, className }: ErrorStateProps) {
  return (
    <div className={cn('flex flex-col items-center justify-center py-20 gap-4 text-center', className)}>
      <AlertCircle className="w-12 h-12 text-[#F44336]" />
      <p className="text-[#4E5968] font-medium">{message}</p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="px-6 py-2 text-sm font-semibold text-[#3182F6] border border-[#3182F6] rounded-xl hover:bg-[#3182F6]/5 transition-colors"
        >
          다시 시도
        </button>
      )}
    </div>
  );
}
