'use client';

import { useEffect } from 'react';
import { AlertCircle } from 'lucide-react';

export default function GlobalError({ error, reset }: { error: Error; reset: () => void }) {
  useEffect(() => { console.error(error); }, [error]);
  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-4 bg-bg-light-1">
      <AlertCircle className="w-16 h-16 text-error" />
      <h1 className="text-2xl font-bold text-text-dark">오류가 발생했습니다</h1>
      <p className="text-text-gray">{error.message}</p>
      <button
        onClick={reset}
        className="bg-primary-blue-3 text-white rounded-xl px-6 py-3 font-semibold hover:bg-primary-blue-4 transition-colors"
      >
        다시 시도
      </button>
    </div>
  );
}
