'use client';

import type { ReactNode } from 'react';
import { AppHeader } from './AppHeader';
import { AppFooter } from './AppFooter';

export function AppShell({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col bg-bg-light-2">
      <AppHeader />
      <main className="bg-bg-light-4 flex-1">{children}</main>
      <AppFooter />
    </div>
  );
}
