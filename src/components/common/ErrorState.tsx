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
      <AlertCircle className="w-12 h-12 text-error" />
      <p className="text-text-medium font-medium">{message}</p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="px-6 py-2 text-sm font-semibold text-primary border border-primary rounded-xl hover:bg-primary/5 transition-colors"
        >
          다시 시도
        </button>
      )}
    </div>
  );
}
