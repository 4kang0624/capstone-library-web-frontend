'use client';

import { useEffect } from 'react';
import { AlertCircle } from 'lucide-react';

export default function PublicError({ error, reset }: { error: Error; reset: () => void }) {
  useEffect(() => { console.error(error); }, [error]);
  return (
    <div className="flex flex-col items-center justify-center min-h-[40vh] gap-4">
      <AlertCircle className="w-12 h-12 text-[#F44336]" />
      <p className="text-[#4E5968]">{error.message || '오류가 발생했습니다'}</p>
      <button onClick={reset} className="bg-[#3182F6] text-white rounded-xl px-5 py-2.5 font-semibold hover:bg-[#2272E3] transition-colors">다시 시도</button>
    </div>
  );
}
