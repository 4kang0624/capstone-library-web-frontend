'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useState } from 'react';
import { Book, Search, FileText, Heart, User, Wallet, LogOut, Menu, X } from 'lucide-react';
import { ROUTES } from '@/constants/routes';
import { useAuth } from '@/hooks/useAuth';
import { useWeb3Context } from '@/providers/Web3Provider';

const NAV_LINKS = [
  { path: ROUTES.SEARCH, label: '도서 검색', icon: Search },
  { path: ROUTES.LIBRARY, label: '내 서재', icon: Book },
  { path: ROUTES.RENTALS, label: '대여 관리', icon: FileText },
  { path: ROUTES.WISHLISTS, label: '위시리스트', icon: Heart },
];

export function AppHeader() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, isAuthenticated, logout } = useAuth();
  const { account, isConnected, connectWallet, disconnectWallet } = useWeb3Context();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isActive = (path: string) => pathname.startsWith(path);

  const handleLogout = async () => {
    await logout();
  };

  return (
    <header className="border-b border-background-bright sticky top-0 z-50 backdrop-blur-lg bg-bg-light-2">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href={ROUTES.HOME} className="flex items-center gap-2 group">
            <div className="w-10 h-10 bg-primary-blue-3 rounded-xl flex items-center justify-center shadow-lg shadow-primary-blue-3/20 group-hover:shadow-primary-blue-3/40 transition-all">
              <Book className="w-6 h-6 text-white" />
            </div>
            <span className="font-extrabold font-serif text-xl text-text-dark">BookChain</span>
          </Link>

          {/* Desktop Nav */}
          {isAuthenticated && (
            <nav className="hidden md:flex items-center gap-1">
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.path}
                  href={link.path}
                  className={`font-medium px-4 py-2 rounded-xl flex items-center gap-2 transition-all text-sm ${
                    isActive(link.path)
                      ? 'bg-bg-light-5 text-primary-blue-5'
                      : 'text-text-gray hover:bg-bg-light-4 hover:text-text-dark active:bg-bg-light-5'
                  }`}
                >
                  <link.icon className="w-4 h-4" />
                  {link.label}
                </Link>
              ))}
            </nav>
          )}

          {/* Right Actions */}
          <div className="hidden md:flex items-center gap-3">
            {isAuthenticated ? (
              <>
                {!isConnected ? (
                  <button
                    onClick={connectWallet}
                    className="flex items-center gap-2 px-4 py-2 border border-border rounded-xl text-sm font-semibold text-text-gray hover:bg-bg-light-4 hover:text-primary transition-all hover:text-text-dark"
                  >
                    <Wallet className="w-4 h-4" />
                    지갑 연결
                  </button>
                ) : (
                  <div className="flex items-center gap-2">
                    <span className="px-4 py-2 bg-primary-blue-2 text-white rounded-xl text-sm font-bold shadow-md">
                      {account?.slice(0, 6)}...{account?.slice(-4)}
                    </span>
                    <button
                      onClick={disconnectWallet}
                      className="text-sm font-semibold text-text-gray hover:text-text-dark px-2"
                    >
                      해제
                    </button>
                  </div>
                )}
                <Link
                  href={ROUTES.PROFILE}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold text-text-gray hover:bg-bg-light-4 hover:text-text-dark transition-all"
                >
                  <User className="w-4 h-4" />
                  {user?.nickname}
                </Link>
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold text-text-gray hover:bg-bg-light-4 hover:text-red-500 transition-all"
                >
                  <LogOut className="w-4 h-4" />
                  로그아웃
                </button>
              </>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  href={ROUTES.LOGIN}
                  className="px-4 py-2 rounded-xl text-sm font-semibold text-text-gray hover:bg-bg-light-1 hover:text-text-dark transition-all"
                >
                  로그인
                </Link>
                <Link
                  href={ROUTES.SIGNUP}
                  className="px-4 py-2 bg-primary-blue-3 text-white rounded-xl text-sm font-bold hover:bg-primary-blue-4 transition-all shadow-md shadow-primary-blue-3/20"
                >
                  회원가입
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <button
            className="md:hidden p-2 rounded-xl text-text-gray hover:bg-bg-light-1"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-border bg-white px-4 py-4 space-y-2">
          {isAuthenticated &&
            NAV_LINKS.map((link) => (
              <Link
                key={link.path}
                href={link.path}
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl font-semibold ${
                  isActive(link.path)
                    ? 'bg-bg-light-2 text-primary'
                    : 'text-text-gray hover:bg-bg-light-1'
                }`}
              >
                <link.icon className="w-5 h-5" />
                {link.label}
              </Link>
            ))}
          {isAuthenticated ? (
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-xl font-semibold text-red-500 hover:bg-red-50"
            >
              <LogOut className="w-5 h-5" />
              로그아웃
            </button>
          ) : (
            <div className="flex gap-2 pt-2">
              <Link
                href={ROUTES.LOGIN}
                onClick={() => setMobileMenuOpen(false)}
                className="flex-1 text-center px-4 py-3 border-2 border-border rounded-xl font-semibold text-text-gray"
              >
                로그인
              </Link>
              <Link
                href={ROUTES.SIGNUP}
                onClick={() => setMobileMenuOpen(false)}
                className="flex-1 text-center px-4 py-3 bg-primary text-white rounded-xl font-bold"
              >
                회원가입
              </Link>
            </div>
          )}
        </div>
      )}
    </header>
  );
}
