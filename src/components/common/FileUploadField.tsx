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
      {label && <label className="text-sm font-semibold text-[#4E5968]">{label}</label>}
      <div
        onClick={() => inputRef.current?.click()}
        className={cn(
          'border-2 border-dashed border-[#E5E8EB] rounded-xl p-6 flex flex-col items-center justify-center gap-2 cursor-pointer hover:border-[#3182F6] hover:bg-[#3182F6]/5 transition-all',
          error && 'border-[#F44336]',
        )}
      >
        {preview ? (
          <img src={preview} alt="preview" className="max-h-48 rounded-lg object-contain" />
        ) : (
          <>
            <Upload className="w-8 h-8 text-[#8B95A1]" />
            <p className="text-sm text-[#6B7684]">클릭하여 파일 선택</p>
          </>
        )}
      </div>
      <input ref={inputRef} type="file" accept={accept} className="hidden" onChange={(e) => { const f = e.target.files?.[0]; if (f) onChange(f); }} />
      {error && <p className="text-sm text-[#F44336]">{error}</p>}
    </div>
  );
}
