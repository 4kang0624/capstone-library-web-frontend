import { useQuery } from '@tanstack/react-query';
import { booksApi } from './api';
import { QUERY_KEYS } from '@/constants/queryKeys';

export const useBook = (bookId: number) =>
  useQuery({
    queryKey: QUERY_KEYS.BOOK(bookId),
    queryFn: () => booksApi.getBook(bookId),
    enabled: !!bookId,
  });
