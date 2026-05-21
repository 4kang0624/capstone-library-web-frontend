import React from 'react';
import { cn } from '@/lib/utils/cn';

type BadgeVariant = 'default' | 'primary' | 'success' | 'warning' | 'error' | 'info';

interface BadgeProps {
  children: React.ReactNode;
  variant?: BadgeVariant;
  className?: string;
}

const variantClasses: Record<BadgeVariant, string> = {
  default: 'bg-bg-light-4 text-text-medium',
  primary: 'bg-primary/10 text-primary',
  success: 'bg-success/10 text-success-dark',
  warning: 'bg-warning/10 text-warning-dark',
  error: 'bg-error/10 text-error-dark',
  info: 'bg-info/10 text-info-dark',
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
