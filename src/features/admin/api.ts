import { apiClient } from '@/lib/api/client';
import type { User } from '@/features/auth/types';
import type { ChangeUserStatusRequest } from './types';

export const adminApi = {
  listUsers: () =>
    apiClient.get<User[]>('/admin/users').then((r) => r.data),

  getUserById: (userId: number) =>
    apiClient.get<User>(`/admin/users/${userId}`).then((r) => r.data),

  changeUserStatus: (userId: number, data: ChangeUserStatusRequest) =>
    apiClient.patch<User>(`/admin/users/${userId}/status`, data).then((r) => r.data),
};
