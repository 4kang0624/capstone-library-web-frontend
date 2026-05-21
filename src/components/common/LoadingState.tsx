import { cn } from '@/lib/utils/cn';

export function LoadingState({ className, text = '불러오는 중...' }: { className?: string; text?: string }) {
  return (
    <div className={cn('flex flex-col items-center justify-center py-20 gap-4', className)}>
      <div className="w-10 h-10 border-4 border-border border-t-primary rounded-full animate-spin" />
      <p className="text-text-gray text-sm">{text}</p>
    </div>
  );
}
