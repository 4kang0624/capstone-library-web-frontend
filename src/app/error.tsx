'use client';

import { useEffect } from 'react';
import { AlertCircle } from 'lucide-react';

export default function GlobalError({ error, reset }: { error: Error; reset: () => void }) {
  useEffect(() => { console.error(error); }, [error]);
  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-4 bg-[#F9FAFB]">
      <AlertCircle className="w-16 h-16 text-[#F44336]" />
      <h1 className="text-2xl font-bold text-[#191F28]">오류가 발생했습니다</h1>
      <p className="text-[#6B7684]">{error.message}</p>
      <button
        onClick={reset}
        className="bg-[#3182F6] text-white rounded-xl px-6 py-3 font-semibold hover:bg-[#2272E3] transition-colors"
      >
        다시 시도
      </button>
    </div>
  );
}
