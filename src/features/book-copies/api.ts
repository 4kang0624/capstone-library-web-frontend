import { apiClient } from '@/lib/api/client';
import type { BookCopy, BookCopyCreateRequest, BookCopyUpdateRequest } from './types';

export const bookCopiesApi = {
  create: (data: BookCopyCreateRequest) =>
    apiClient.post<BookCopy>('/book-copies', data).then((r) => r.data),

  getByBook: (bookId: number) =>
    apiClient.get<BookCopy[]>('/book-copies', { params: { book_id: bookId } }).then((r) => r.data),

  getMy: () =>
    apiClient.get<BookCopy[]>('/book-copies/me').then((r) => r.data),

  getRentable: () =>
    apiClient.get<BookCopy[]>('/book-copies/rentable').then((r) => r.data),

  getById: (copyId: number) =>
    apiClient.get<BookCopy>(`/book-copies/${copyId}`).then((r) => r.data),

  update: (copyId: number, data: BookCopyUpdateRequest) =>
    apiClient.patch<BookCopy>(`/book-copies/${copyId}`, data).then((r) => r.data),

  delete: (copyId: number) =>
    apiClient.delete(`/book-copies/${copyId}`).then((r) => r.data),
};
