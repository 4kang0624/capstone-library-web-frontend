import { apiClient } from '@/lib/api/client';
import type { Bookmark, BookmarkUpsertRequest } from './types';

export const bookmarksApi = {
  upsert: (data: BookmarkUpsertRequest) =>
    apiClient.put<Bookmark>('/bookmarks', data).then((r) => r.data),

  getMy: () => apiClient.get<Bookmark[]>('/bookmarks/me').then((r) => r.data),

  getByBook: (bookId: number) =>
    apiClient.get<Bookmark>(`/bookmarks/books/${bookId}`).then((r) => (r.data ? [r.data] : [])),

  delete: (bookmarkId: number) =>
    apiClient.delete(`/bookmarks/${bookmarkId}`).then((r) => r.data),
};
