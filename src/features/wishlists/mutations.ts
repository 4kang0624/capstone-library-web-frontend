import { useMutation, useQueryClient } from '@tanstack/react-query';
import { wishlistsApi } from './api';
import { QUERY_KEYS } from '@/constants/queryKeys';

export const useAddWishlistMutation = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: wishlistsApi.create,
    onSuccess: () => qc.invalidateQueries({ queryKey: QUERY_KEYS.MY_WISHLISTS }),
  });
};

export const useRemoveWishlistMutation = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: wishlistsApi.delete,
    onSuccess: () => qc.invalidateQueries({ queryKey: QUERY_KEYS.MY_WISHLISTS }),
  });
};
