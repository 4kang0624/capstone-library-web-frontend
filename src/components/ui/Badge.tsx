import React from 'react';
import { cn } from '@/lib/utils/cn';

type BadgeVariant = 'default' | 'primary' | 'success' | 'warning' | 'error' | 'info';

interface BadgeProps {
  children: React.ReactNode;
  variant?: BadgeVariant;
  className?: string;
}

const variantClasses: Record<BadgeVariant, string> = {
  default: 'bg-[#F2F4F6] text-[#4E5968]',
  primary: 'bg-[#3182F6]/10 text-[#3182F6]',
  success: 'bg-[#4CAF50]/10 text-[#2E7D32]',
  warning: 'bg-[#FF9800]/10 text-[#E65100]',
  error: 'bg-[#F44336]/10 text-[#C62828]',
  info: 'bg-[#2196F3]/10 text-[#1565C0]',
};

export function Badge({ children, variant = 'default', className }: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold',
        variantClasses[variant],
        className,
      )}
    >
      {children}
    </span>
  );
}
