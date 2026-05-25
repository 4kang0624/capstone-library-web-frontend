import { useMutation, useQueryClient } from '@tanstack/react-query';
import { QUERY_KEYS } from '@/constants/queryKeys';
import { adminApi } from './api';
import type { AdminDisputeResolveRequest, ChangeUserStatusRequest } from './types';

export const useChangeUserStatusMutation = () => {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: ({ userId, data }: { userId: number; data: ChangeUserStatusRequest }) =>
      adminApi.changeUserStatus(userId, data),
    onSuccess: (data, variables) => {
      qc.setQueryData(QUERY_KEYS.ADMIN_USER(variables.userId), data);
      qc.invalidateQueries({ queryKey: QUERY_KEYS.ADMIN_USERS });
      qc.invalidateQueries({ queryKey: QUERY_KEYS.ME });
    },
  });
};

export const useResolveAdminDisputeMutation = () => {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: ({ rentalId, data }: { rentalId: number; data: AdminDisputeResolveRequest }) =>
      adminApi.resolveDispute(rentalId, data),
    onSuccess: (data, variables) => {
      qc.setQueryData(QUERY_KEYS.ADMIN_DISPUTE(variables.rentalId), data);
      qc.setQueryData(QUERY_KEYS.RENTAL(variables.rentalId), data);
      qc.invalidateQueries({ queryKey: QUERY_KEYS.ADMIN_DISPUTES });
      qc.invalidateQueries({ queryKey: QUERY_KEYS.MY_RENTALS });
      qc.invalidateQueries({ queryKey: QUERY_KEYS.MY_LENDINGS });
      qc.invalidateQueries({ queryKey: QUERY_KEYS.BOOK_COPIES });
      qc.invalidateQueries({ queryKey: QUERY_KEYS.RENTABLE_COPIES });
    },
  });
};
