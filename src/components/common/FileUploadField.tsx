'use client';

import React, { useRef } from 'react';
import { Upload } from 'lucide-react';
import { cn } from '@/lib/utils/cn';

interface FileUploadFieldProps {
  label?: string;
  accept?: string;
  onChange: (file: File) => void;
  preview?: string;
  error?: string;
  className?: string;
}

export function FileUploadField({ label, accept, onChange, preview, error, className }: FileUploadFieldProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  return (
    <div className={cn('flex flex-col gap-1.5', className)}>
      {label && <label className="text-sm font-semibold text-text-medium">{label}</label>}
      <div
        onClick={() => inputRef.current?.click()}
        className={cn(
          'border-2 border-dashed border-border rounded-xl p-6 flex flex-col items-center justify-center gap-2 cursor-pointer hover:border-primary hover:bg-primary/5 transition-all',
          error && 'border-error',
        )}
      >
        {preview ? (
          <img src={preview} alt="preview" className="max-h-48 rounded-lg object-contain" />
        ) : (
          <>
            <Upload className="w-8 h-8 text-text-light" />
            <p className="text-sm text-text-gray">클릭하여 파일 선택</p>
          </>
        )}
      </div>
      <input ref={inputRef} type="file" accept={accept} className="hidden" onChange={(e) => { const f = e.target.files?.[0]; if (f) onChange(f); }} />
      {error && <p className="text-sm text-error">{error}</p>}
    </div>
  );
}
