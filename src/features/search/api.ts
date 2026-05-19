import { apiClient } from '@/lib/api/client';
import type { SearchResponse } from './types';

export const searchApi = {
  searchBooks: (keyword: string) =>
    apiClient
      .get<SearchResponse>('/search/books', { params: { keyword } })
      .then((r) => r.data),

  searchByIsbn: (isbn: string) =>
    apiClient.get<SearchResponse>(`/search/books/isbn/${isbn}`).then((r) => r.data),
};
