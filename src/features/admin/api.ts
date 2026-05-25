import { apiClient } from '@/lib/api/client';
import type { User } from '@/features/auth/types';
import type { Rental } from '@/features/rentals/types';
import type { AdminDisputeResolveRequest, AdminEscrowDbStatusRequest, ChangeUserStatusRequest } from './types';

export const adminApi = {
  listUsers: () =>
    apiClient.get<User[]>('/admin/users').then((r) => r.data),

  getUserById: (userId: number) =>
    apiClient.get<User>(`/admin/users/${userId}`).then((r) => r.data),

  changeUserStatus: (userId: number, data: ChangeUserStatusRequest) =>
    apiClient.patch<User>(`/admin/users/${userId}/status`, data).then((r) => r.data),

  listDisputes: () =>
    apiClient.get<Rental[]>('/admin/rentals/disputes').then((r) => r.data),

  getDisputeById: (rentalId: number) =>
    apiClient.get<Rental>(`/admin/rentals/disputes/${rentalId}`).then((r) => r.data),

  resolveDispute: (rentalId: number, data: AdminDisputeResolveRequest) =>
    apiClient
      .patch<Rental>(`/admin/rentals/disputes/${rentalId}/resolve`, data)
      .then((r) => r.data),

  listEscrows: () =>
    apiClient.get<Rental[]>('/admin/rentals/escrows').then((r) => r.data),

  getEscrowById: (rentalId: number) =>
    apiClient.get<Rental>(`/admin/rentals/escrows/${rentalId}`).then((r) => r.data),

  updateEscrowDbStatus: (rentalId: number, data: AdminEscrowDbStatusRequest) =>
    apiClient
      .patch<Rental>(`/admin/rentals/escrows/${rentalId}/db-status`, data)
      .then((r) => r.data),
};
