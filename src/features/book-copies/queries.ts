import { useQuery } from '@tanstack/react-query';
import { bookCopiesApi } from './api';
import { QUERY_KEYS } from '@/constants/queryKeys';

export const useMyBookCopies = () =>
  useQuery({
    queryKey: QUERY_KEYS.MY_BOOK_COPIES,
    queryFn: bookCopiesApi.getMy,
  });

export const useRentableBookCopies = () =>
  useQuery({
    queryKey: QUERY_KEYS.RENTABLE_COPIES,
    queryFn: bookCopiesApi.getRentable,
  });

export const useBookCopiesByBook = (bookId: number) =>
  useQuery({
    queryKey: QUERY_KEYS.BOOK_COPIES_BY_BOOK(bookId),
    queryFn: () => bookCopiesApi.getByBook(bookId),
    enabled: !!bookId,
  });

export const useBookCopy = (copyId: number) =>
  useQuery({
    queryKey: QUERY_KEYS.BOOK_COPY(copyId),
    queryFn: () => bookCopiesApi.getById(copyId),
    enabled: !!copyId,
  });
