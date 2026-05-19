import { useMutation, useQueryClient } from '@tanstack/react-query';
import { rentalsApi } from './api';
import { QUERY_KEYS } from '@/constants/queryKeys';

export const useCreateRentalMutation = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: rentalsApi.create,
    onSuccess: () => qc.invalidateQueries({ queryKey: QUERY_KEYS.MY_RENTALS }),
  });
};

export const useApproveRentalMutation = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: rentalsApi.approve,
    onSuccess: () => qc.invalidateQueries({ queryKey: QUERY_KEYS.MY_RENTALS }),
  });
};

export const useRejectRentalMutation = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (rentalId: number) => rentalsApi.reject(rentalId),
    onSuccess: () => qc.invalidateQueries({ queryKey: QUERY_KEYS.MY_RENTALS }),
  });
};

export const useCancelRentalMutation = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: rentalsApi.cancel,
    onSuccess: () => qc.invalidateQueries({ queryKey: QUERY_KEYS.MY_RENTALS }),
  });
};

export const useReturnRentalMutation = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: rentalsApi.return,
    onSuccess: () => qc.invalidateQueries({ queryKey: QUERY_KEYS.MY_RENTALS }),
  });
};
