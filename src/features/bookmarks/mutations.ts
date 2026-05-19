import { useMutation, useQueryClient } from '@tanstack/react-query';
import { bookmarksApi } from './api';
import { QUERY_KEYS } from '@/constants/queryKeys';

export const useUpsertBookmarkMutation = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: bookmarksApi.upsert,
    onSuccess: () => qc.invalidateQueries({ queryKey: QUERY_KEYS.MY_BOOKMARKS }),
  });
};

export const useDeleteBookmarkMutation = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: bookmarksApi.delete,
    onSuccess: () => qc.invalidateQueries({ queryKey: QUERY_KEYS.MY_BOOKMARKS }),
  });
};
