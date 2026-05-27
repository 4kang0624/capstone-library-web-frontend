'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ShelfieLogoColor } from '@/assets';
import { ROUTES } from '@/constants/routes';
import { useAuth } from '@/hooks/useAuth';
import { LogOut, User, Wallet, Menu, X } from 'lucide-react';
import { useWeb3Context } from '@/providers';

const navItems = [
  { label: 'Features', href: '#features' },
  { label: 'Shelf', href: '#featured-books' },
  { label: 'How It Works', href: '#how-it-works' },
  { label: 'Trust', href: '#trust' },
  { label: 'Start', href: '#start' },
];

export function PublicHeader() {
  const { user, isAuthenticated, logout } = useAuth();
  const { account, isConnected, connectWallet, disconnectWallet } =
    useWeb3Context();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
  };

  const scrollToSection = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    if (!href.startsWith('#')) return;
    e.preventDefault();
    const target = document.querySelector(href) as HTMLElement | null;
    const scrollContainer = document.querySelector('main') as HTMLElement | null;
    if (target && scrollContainer) {
      const targetTop =
        target.getBoundingClientRect().top -
        scrollContainer.getBoundingClientRect().top +
        scrollContainer.scrollTop;
      scrollContainer.scrollTo({ top: targetTop, behavior: 'smooth' });
    }
    setMobileMenuOpen(false);
  };

  return (
    <header className="border-b border-border-dark sticky top-0 z-50 backdrop-blur-lg bg-bg-light-2">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href={ROUTES.HOME + '#main'} onClick={(e) => scrollToSection(e, '#main')} className="flex items-center gap-1 group">
            <ShelfieLogoColor className="w-9 h-9" />
            <span className="font-extrabold font-serif text-xl text-text-dark">
              Shelfie
            </span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-1">
            {navItems.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                onClick={(e) => scrollToSection(e, item.href)}
                className="font-medium px-4 py-2 rounded-xl flex items-center gap-2 transition-all text-sm text-text-gray hover:bg-bg-light-4 hover:text-text-dark active:bg-bg-light-5"
              >
                {item.label}
              </Link>
            ))}
          </nav>

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
                    <span className="px-4 py-2 bg-primary-blue-3 text-white rounded-xl text-sm font-bold shadow-md flex items-center gap-2">
                      <Wallet className="w-4 h-4" />
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
          {navItems.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              onClick={(e) => scrollToSection(e, item.href)}
              className="flex items-center gap-3 px-4 py-3 rounded-xl font-semibold text-text-gray hover:bg-bg-light-1"
            >
              {item.label}
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