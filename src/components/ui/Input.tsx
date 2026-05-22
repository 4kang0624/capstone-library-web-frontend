'use client';

import React from 'react';
import { cn } from '@/lib/utils/cn';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  startAdornment?: React.ReactNode;
  endAdornment?: React.ReactNode;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(function Input(
  { label, error, helperText, startAdornment, endAdornment, className, ...props },
  ref,
) {
  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label className="text-sm font-semibold text-text-medium">{label}</label>
      )}
      <div className="relative">
        {startAdornment && (
          <div className="absolute left-4 top-1/2 -translate-y-1/2 text-text-gray">
            {startAdornment}
          </div>
        )}
        <input
          ref={ref}
          className={cn(
            'w-full border border-border rounded-xl px-4 py-3 text-text-dark',
            'bg-bg-light-1 placeholder:text-text-lightlack outline-none',
            'focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all',
            error && 'border-error focus:border-error focus:ring-error/20',
            startAdornment ? 'pl-11' : undefined,
            endAdornment ? 'pr-11' : undefined,
            className,
          )}
          {...props}
        />
        {endAdornment && (
          <div className="absolute right-4 top-1/2 -translate-y-1/2 text-text-gray">
            {endAdornment}
          </div>
        )}
      </div>
      {error && <p className="text-sm text-error">{error}</p>}
      {helperText && !error && <p className="text-sm text-text-gray">{helperText}</p>}
    </div>
  );
});
