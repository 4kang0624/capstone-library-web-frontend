'use client';

import Link from 'next/link';
import { Book } from 'lucide-react';
import { ROUTES } from '@/constants/routes';

export function AppFooter() {
  return (
    <footer className="bg-bg-light-2 border-t border-border py-8 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <Link href={ROUTES.HOME} className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-primary-blue-3 to-primary-blue-1 rounded-lg flex items-center justify-center">
              <Book className="w-4 h-4 text-white" />
            </div>
            <span className="font-bold text-text-dark">BookChain</span>
          </Link>
          <p className="text-sm text-text-gray">
            © 2026 BookChain. 블록체인 기반 P2P 도서 대여 플랫폼
          </p>
        </div>
      </div>
    </footer>
  );
}
