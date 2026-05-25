'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { AlertTriangle, ShieldCheck, Users } from 'lucide-react';
import { ROUTES } from '@/constants/routes';
import { useAuth } from '@/hooks/useAuth';
import { UserRole } from '@/types/enums';
import { cn } from '@/lib/utils/cn';

const ADMIN_LINKS = [
  { href: ROUTES.ADMIN, label: '관리자 홈', icon: ShieldCheck },
  { href: ROUTES.ADMIN_USERS, label: '회원 관리', icon: Users },
  { href: ROUTES.ADMIN_DISPUTES, label: '분쟁 관리', icon: AlertTriangle },
];

export function AdminNav() {
  const pathname = usePathname();
  const { user } = useAuth();

  if (user?.role !== UserRole.ADMIN) return null;

  return (
    <nav className="mb-6 flex flex-wrap gap-2 border-b border-border pb-4">
      {ADMIN_LINKS.map((link) => {
        const isActive =
          link.href === ROUTES.ADMIN ? pathname === link.href : pathname.startsWith(link.href);

        return (
          <Link
            key={link.href}
            href={link.href}
            className={cn(
              'inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-semibold transition-colors',
              isActive
                ? 'bg-primary-blue-3 text-white'
                : 'text-text-gray hover:bg-bg-light-3 hover:text-text-dark',
            )}
          >
            <link.icon className="h-4 w-4" />
            {link.label}
          </Link>
        );
      })}
    </nav>
  );
}
