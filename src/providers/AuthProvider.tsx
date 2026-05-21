'use client';

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from 'react';
import { useRouter } from 'next/navigation';
import { authApi } from '@/features/auth/api';
import { usersApi } from '@/features/users/api';
import { tokenStorage } from '@/lib/api/token';
import { ROUTES } from '@/constants/routes';
import type { User } from '@/features/auth/types';

interface AuthContextValue {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string, nickname: string) => Promise<void>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  const refreshUser = useCallback(async () => {
    const token = tokenStorage.getAccessToken();
    if (!token) {
      setUser(null);
      setIsLoading(false);
      return;
    }
    try {
      const me = await usersApi.getMe();
      setUser(me);
    } catch {
      tokenStorage.clearTokens();
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Handle automatic logout when token refresh fails
  useEffect(() => {
    const handleLogout = () => {
      tokenStorage.clearTokens();
      setUser(null);
      router.replace(ROUTES.LOGIN);
    };

    if (typeof window !== 'undefined') {
      window.addEventListener('auth:logout', handleLogout);
      return () => window.removeEventListener('auth:logout', handleLogout);
    }
  }, [router]);

  // Periodically check token expiration and refresh if needed
  useEffect(() => {
    if (!tokenStorage.getAccessToken()) return;

    const checkAndRefreshToken = async () => {
      try {
        const refreshToken = tokenStorage.getRefreshToken();
        if (!refreshToken) return;

        // Try to refresh token
        const response = await authApi.refresh(refreshToken);
        tokenStorage.setAccessToken(response.access_token);
      } catch {
        // Token refresh failed, will be handled by API interceptor
        tokenStorage.clearTokens();
        setUser(null);
        router.replace(ROUTES.LOGIN);
      }
    };

    // Check every 5 minutes
    const interval = setInterval(checkAndRefreshToken, 5 * 60 * 1000);

    return () => clearInterval(interval);
  }, [router]);

  useEffect(() => {
    refreshUser();
  }, [refreshUser]);

  const login = useCallback(async (email: string, password: string) => {
    const tokens = await authApi.login({ email, password });
    tokenStorage.setTokens(tokens.access_token, tokens.refresh_token);
    const me = await usersApi.getMe();
    setUser(me);
  }, []);

  const signup = useCallback(async (email: string, password: string, nickname: string) => {
    await authApi.signup({ email, password, nickname });
    const tokens = await authApi.login({ email, password });
    tokenStorage.setTokens(tokens.access_token, tokens.refresh_token);
    const me = await usersApi.getMe();
    setUser(me);
  }, []);

  const logout = useCallback(async () => {
    const refreshToken = tokenStorage.getRefreshToken();
    if (refreshToken) {
      await authApi.logout(refreshToken).catch(() => {});
    }
    tokenStorage.clearTokens();
    setUser(null);
    // Use window.location to do a full page navigation to home
    // This bypasses all React state race conditions
    setTimeout(() => {
      window.location.href = '/';
    }, 0);
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        signup,
        logout,
        refreshUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuthContext(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuthContext must be used within AuthProvider');
  return ctx;
}
