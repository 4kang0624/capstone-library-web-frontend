import { useQuery } from '@tanstack/react-query';
import { bookmarksApi } from './api';
import { QUERY_KEYS } from '@/constants/queryKeys';

export const useMyBookmarks = () =>
  useQuery({
    queryKey: QUERY_KEYS.MY_BOOKMARKS,
    queryFn: bookmarksApi.getMy,
  });
