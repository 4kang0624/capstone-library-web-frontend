import { useMutation, useQueryClient } from '@tanstack/react-query';
import { bookCopiesApi } from './api';
import { QUERY_KEYS } from '@/constants/queryKeys';

export const useCreateBookCopyMutation = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: bookCopiesApi.create,
    onSuccess: () => qc.invalidateQueries({ queryKey: QUERY_KEYS.MY_BOOK_COPIES }),
  });
};

export const useUpdateBookCopyMutation = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: Parameters<typeof bookCopiesApi.update>[1] }) =>
      bookCopiesApi.update(id, data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: QUERY_KEYS.MY_BOOK_COPIES });
      qc.invalidateQueries({ queryKey: QUERY_KEYS.RENTABLE_COPIES });
      qc.invalidateQueries({ queryKey: QUERY_KEYS.BOOK_COPIES });
    },
  });
};

export const useDeleteBookCopyMutation = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: bookCopiesApi.delete,
    onSuccess: () => qc.invalidateQueries({ queryKey: QUERY_KEYS.MY_BOOK_COPIES }),
  });
};
