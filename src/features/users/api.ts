import { apiClient } from '@/lib/api/client';
import type { User } from '@/features/auth/types';

export const usersApi = {
  getMe: () => apiClient.get<User>('/users/me').then((r) => r.data),

  updateMe: (data: { nickname: string }) =>
    apiClient.patch<User>('/users/me', data).then((r) => r.data),

  updatePassword: (data: { current_password: string; new_password: string }) =>
    apiClient.patch('/users/me/password', data).then((r) => r.data),

  deleteMe: () => apiClient.delete('/users/me').then((r) => r.data),
};
