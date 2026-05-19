import { apiClient } from '@/lib/api/client';
import type { Book, BookImportRequest } from './types';

export const booksApi = {
  import: (data: BookImportRequest) =>
    apiClient.post<Book>('/books/import', data).then((r) => r.data),

  getBook: (bookId: number) =>
    apiClient.get<Book>(`/books/${bookId}`).then((r) => r.data),
};
