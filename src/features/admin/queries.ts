import { useQuery } from '@tanstack/react-query';
import { QUERY_KEYS } from '@/constants/queryKeys';
import { adminApi } from './api';

export const useAdminUsers = () =>
  useQuery({
    queryKey: QUERY_KEYS.ADMIN_USERS,
    queryFn: adminApi.listUsers,
  });

export const useAdminUser = (userId: number) =>
  useQuery({
    queryKey: QUERY_KEYS.ADMIN_USER(userId),
    queryFn: () => adminApi.getUserById(userId),
    enabled: !!userId,
  });

export const useAdminDisputes = () =>
  useQuery({
    queryKey: QUERY_KEYS.ADMIN_DISPUTES,
    queryFn: adminApi.listDisputes,
  });

export const useAdminDispute = (rentalId: number) =>
  useQuery({
    queryKey: QUERY_KEYS.ADMIN_DISPUTE(rentalId),
    queryFn: () => adminApi.getDisputeById(rentalId),
    enabled: !!rentalId,
  });

export const useAdminEscrows = () =>
  useQuery({
    queryKey: QUERY_KEYS.ADMIN_ESCROWS,
    queryFn: adminApi.listEscrows,
  });

export const useAdminEscrow = (rentalId: number) =>
  useQuery({
    queryKey: QUERY_KEYS.ADMIN_ESCROW(rentalId),
    queryFn: () => adminApi.getEscrowById(rentalId),
    enabled: !!rentalId,
  });
