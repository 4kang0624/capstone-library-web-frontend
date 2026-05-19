import { useMutation, useQueryClient } from '@tanstack/react-query';
import { booksApi } from './api';
import { QUERY_KEYS } from '@/constants/queryKeys';

export const useImportBookMutation = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: booksApi.import,
    onSuccess: () => qc.invalidateQueries({ queryKey: QUERY_KEYS.BOOK_COPIES }),
  });
};
