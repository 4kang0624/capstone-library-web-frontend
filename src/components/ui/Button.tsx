import React from 'react';
import { cn } from '@/lib/utils/cn';

type Variant = 'contained' | 'outlined' | 'text' | 'danger';
type Size = 'sm' | 'md' | 'lg';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
  loading?: boolean;
  fullWidth?: boolean;
}

const variantClasses: Record<Variant, string> = {
  contained: 'bg-primary-blue-3 text-white hover:bg-primary-blue-4 active:bg-primary-blue-5 shadow-sm',
  outlined: 'bg-white text-primary-blue-3 border border-primary-blue-3 hover:bg-primary-blue-3/5',
  text: 'bg-transparent text-primary-blue-3 hover:bg-primary-blue-3/5',
  danger: 'bg-error text-white hover:bg-error-dark shadow-sm',
};

const sizeClasses: Record<Size, string> = {
  sm: 'px-4 py-2 text-sm rounded-xl',
  md: 'px-6 py-3 text-base rounded-xl',
  lg: 'px-10 py-4 text-lg rounded-2xl',
};

export function Button({
  variant = 'contained',
  size = 'md',
  loading = false,
  fullWidth = false,
  className,
  children,
  disabled,
  ...props
}: ButtonProps) {
  return (
    <button
      disabled={disabled || loading}
      className={cn(
        'font-semibold transition-all inline-flex items-center justify-center gap-2',
        'disabled:opacity-50 disabled:cursor-not-allowed',
        variantClasses[variant],
        sizeClasses[size],
        fullWidth && 'w-full',
        className,
      )}
      {...props}
    >
      {loading && (
        <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
      )}
      {children}
    </button>
  );
}
