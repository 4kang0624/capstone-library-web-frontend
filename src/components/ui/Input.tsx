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
        <label className="text-sm font-semibold text-[#4E5968]">{label}</label>
      )}
      <div className="relative">
        {startAdornment && (
          <div className="absolute left-4 top-1/2 -translate-y-1/2 text-[#6B7684]">
            {startAdornment}
          </div>
        )}
        <input
          ref={ref}
          className={cn(
            'w-full border border-[#E5E8EB] rounded-xl px-4 py-3 text-[#191F28]',
            'placeholder:text-[#8B95A1] outline-none',
            'focus:border-[#3182F6] focus:ring-2 focus:ring-[#3182F6]/20 transition-all',
            error && 'border-[#F44336] focus:border-[#F44336] focus:ring-[#F44336]/20',
            startAdornment ? 'pl-11' : undefined,
            endAdornment ? 'pr-11' : undefined,
            className,
          )}
          {...props}
        />
        {endAdornment && (
          <div className="absolute right-4 top-1/2 -translate-y-1/2 text-[#6B7684]">
            {endAdornment}
          </div>
        )}
      </div>
      {error && <p className="text-sm text-[#F44336]">{error}</p>}
      {helperText && !error && <p className="text-sm text-[#6B7684]">{helperText}</p>}
    </div>
  );
});
