import { cn } from '@/lib/utils/cn';

export function LoadingState({ className, text = '불러오는 중...' }: { className?: string; text?: string }) {
  return (
    <div className={cn('flex flex-col items-center justify-center py-20 gap-4', className)}>
      <div className="w-10 h-10 border-4 border-[#E5E8EB] border-t-[#3182F6] rounded-full animate-spin" />
      <p className="text-[#6B7684] text-sm">{text}</p>
    </div>
  );
}
