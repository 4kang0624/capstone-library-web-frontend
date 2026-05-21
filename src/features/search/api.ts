import { apiClient } from '@/lib/api/client';
import type { SearchResponse } from './types';
import { mapNaverSearchResponse } from './mappers';

export const searchApi = {
  searchBooks: (keyword: string) =>
    apiClient
      .get('/search/books', { params: { keyword } })
      .then((r) => mapNaverSearchResponse(r.data)),

  searchByIsbn: (isbn: string) =>
    apiClient
      .get(`/search/books/isbn/${isbn}`)
      .then((r) => mapNaverSearchResponse(r.data)),
};
