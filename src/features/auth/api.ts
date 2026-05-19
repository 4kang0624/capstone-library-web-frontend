import { apiClient } from '@/lib/api/client';
import type { LoginRequest, SignUpRequest, TokenResponse } from './types';

export const authApi = {
  signup: (data: SignUpRequest) =>
    apiClient.post<TokenResponse>('/auth/signup', data).then((r) => r.data),

  login: (data: LoginRequest) =>
    apiClient.post<TokenResponse>('/auth/login', data).then((r) => r.data),

  refresh: (refreshToken: string) =>
    apiClient
      .post<{ access_token: string }>('/auth/refresh', { refresh_token: refreshToken })
      .then((r) => r.data),

  logout: (refreshToken: string) =>
    apiClient.post('/auth/logout', { refresh_token: refreshToken }).then((r) => r.data),
};
