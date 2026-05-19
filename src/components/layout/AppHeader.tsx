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
    router.push(ROUTES.HOME);
  };

  return (
    <header className="bg-white border-b border-[#E5E8EB] sticky top-0 z-50 backdrop-blur-lg bg-white/95">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href={ROUTES.HOME} className="flex items-center gap-2 group">
            <div className="w-10 h-10 bg-gradient-to-br from-[#3182F6] to-[#5BA4FF] rounded-xl flex items-center justify-center shadow-lg shadow-[#3182F6]/20 group-hover:shadow-[#3182F6]/40 transition-all">
              <Book className="w-6 h-6 text-white" />
            </div>
            <span className="font-bold text-xl text-[#191F28]">BookChain</span>
          </Link>

          {/* Desktop Nav */}
          {isAuthenticated && (
            <nav className="hidden md:flex items-center gap-1">
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.path}
                  href={link.path}
                  className={`px-4 py-2 rounded-xl flex items-center gap-2 transition-all font-semibold text-sm ${
                    isActive(link.path)
                      ? 'bg-[#F2F4F6] text-[#3182F6]'
                      : 'text-[#6B7684] hover:bg-[#F9FAFB] hover:text-[#191F28]'
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
                    className="flex items-center gap-2 px-4 py-2 border-2 border-[#E5E8EB] rounded-xl text-sm font-semibold text-[#6B7684] hover:border-[#3182F6] hover:text-[#3182F6] transition-all"
                  >
                    <Wallet className="w-4 h-4" />
                    지갑 연결
                  </button>
                ) : (
                  <div className="flex items-center gap-2">
                    <span className="px-4 py-2 bg-gradient-to-r from-[#4CAF50] to-[#66BB6A] text-white rounded-xl text-sm font-bold shadow-md">
                      {account?.slice(0, 6)}...{account?.slice(-4)}
                    </span>
                    <button
                      onClick={disconnectWallet}
                      className="text-sm font-semibold text-[#6B7684] hover:text-[#191F28] px-2"
                    >
                      해제
                    </button>
                  </div>
                )}
                <Link
                  href={ROUTES.PROFILE}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold text-[#6B7684] hover:bg-[#F9FAFB] hover:text-[#191F28] transition-all"
                >
                  <User className="w-4 h-4" />
                  {user?.nickname}
                </Link>
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold text-[#6B7684] hover:bg-[#F9FAFB] hover:text-red-500 transition-all"
                >
                  <LogOut className="w-4 h-4" />
                  로그아웃
                </button>
              </>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  href={ROUTES.LOGIN}
                  className="px-4 py-2 rounded-xl text-sm font-semibold text-[#6B7684] hover:bg-[#F9FAFB] hover:text-[#191F28] transition-all"
                >
                  로그인
                </Link>
                <Link
                  href={ROUTES.SIGNUP}
                  className="px-4 py-2 bg-[#3182F6] text-white rounded-xl text-sm font-bold hover:bg-[#2772E6] transition-all shadow-md shadow-[#3182F6]/20"
                >
                  회원가입
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <button
            className="md:hidden p-2 rounded-xl text-[#6B7684] hover:bg-[#F9FAFB]"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-[#E5E8EB] bg-white px-4 py-4 space-y-2">
          {isAuthenticated &&
            NAV_LINKS.map((link) => (
              <Link
                key={link.path}
                href={link.path}
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl font-semibold ${
                  isActive(link.path)
                    ? 'bg-[#F2F4F6] text-[#3182F6]'
                    : 'text-[#6B7684] hover:bg-[#F9FAFB]'
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
                className="flex-1 text-center px-4 py-3 border-2 border-[#E5E8EB] rounded-xl font-semibold text-[#6B7684]"
              >
                로그인
              </Link>
              <Link
                href={ROUTES.SIGNUP}
                onClick={() => setMobileMenuOpen(false)}
                className="flex-1 text-center px-4 py-3 bg-[#3182F6] text-white rounded-xl font-bold"
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
