import { useMutation, useQueryClient } from '@tanstack/react-query';
import { rentalsApi } from './api';
import { QUERY_KEYS } from '@/constants/queryKeys';
import type { Rental, RentalApproveRequest } from './types';

export const useCreateRentalMutation = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: rentalsApi.create,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: QUERY_KEYS.MY_RENTALS });
      qc.invalidateQueries({ queryKey: QUERY_KEYS.BOOK_COPIES });
      qc.invalidateQueries({ queryKey: QUERY_KEYS.RENTABLE_COPIES });
    },
  });
};

export const useApproveRentalMutation = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ rentalId, data }: { rentalId: number; data: RentalApproveRequest }) =>
      rentalsApi.approve(rentalId, data),
    onSuccess: (data, variables) => {
      const approvedRental: Rental = {
        ...data,
        deposit_wei: variables.data.deposit_wei,
        shipping_fee_wei: variables.data.shipping_fee_wei,
        due_date: variables.data.due_date,
      };
      qc.setQueryData(QUERY_KEYS.RENTAL(variables.rentalId), approvedRental);
      qc.invalidateQueries({ queryKey: QUERY_KEYS.MY_RENTALS });
      qc.invalidateQueries({ queryKey: QUERY_KEYS.MY_LENDINGS });
      qc.invalidateQueries({ queryKey: QUERY_KEYS.BOOK_COPIES });
      qc.invalidateQueries({ queryKey: QUERY_KEYS.RENTABLE_COPIES });
    },
  });
};

export const useRejectRentalMutation = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (rentalId: number) => rentalsApi.reject(rentalId),
    onSuccess: (data, rentalId) => {
      qc.setQueryData(QUERY_KEYS.RENTAL(rentalId), data);
      qc.invalidateQueries({ queryKey: QUERY_KEYS.MY_RENTALS });
      qc.invalidateQueries({ queryKey: QUERY_KEYS.MY_LENDINGS });
      qc.invalidateQueries({ queryKey: QUERY_KEYS.BOOK_COPIES });
      qc.invalidateQueries({ queryKey: QUERY_KEYS.RENTABLE_COPIES });
    },
  });
};

export const useCancelRentalMutation = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: rentalsApi.cancel,
    onSuccess: (data, rentalId) => {
      qc.setQueryData(QUERY_KEYS.RENTAL(rentalId), data);
      qc.invalidateQueries({ queryKey: QUERY_KEYS.MY_RENTALS });
      qc.invalidateQueries({ queryKey: QUERY_KEYS.BOOK_COPIES });
      qc.invalidateQueries({ queryKey: QUERY_KEYS.RENTABLE_COPIES });
    },
  });
};

export const useReturnRentalMutation = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: rentalsApi.return,
    onSuccess: (data, rentalId) => {
      qc.setQueryData(QUERY_KEYS.RENTAL(rentalId), data);
      qc.invalidateQueries({ queryKey: QUERY_KEYS.MY_RENTALS });
      qc.invalidateQueries({ queryKey: QUERY_KEYS.BOOK_COPIES });
      qc.invalidateQueries({ queryKey: QUERY_KEYS.RENTABLE_COPIES });
    },
  });
};
