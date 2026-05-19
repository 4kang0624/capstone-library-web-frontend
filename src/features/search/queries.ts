import { useQuery } from '@tanstack/react-query';
import { searchApi } from './api';
import { QUERY_KEYS } from '@/constants/queryKeys';

export const useSearchBooks = (keyword: string) =>
  useQuery({
    queryKey: QUERY_KEYS.SEARCH(keyword),
    queryFn: () => searchApi.searchBooks(keyword),
    enabled: keyword.length > 1,
  });

export const useSearchByIsbn = (isbn: string) =>
  useQuery({
    queryKey: QUERY_KEYS.SEARCH_ISBN(isbn),
    queryFn: () => searchApi.searchByIsbn(isbn),
    enabled: isbn.length > 0,
  });
