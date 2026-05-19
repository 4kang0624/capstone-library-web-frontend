import { apiClient } from '@/lib/api/client';
import type { WishlistCreateRequest, WishlistItem } from './types';

export const wishlistsApi = {
  create: (data: WishlistCreateRequest) =>
    apiClient.post<WishlistItem>('/wishlists', data).then((r) => r.data),

  getMy: () => apiClient.get<WishlistItem[]>('/wishlists/me').then((r) => r.data),

  delete: (wishlistId: number) =>
    apiClient.delete(`/wishlists/${wishlistId}`).then((r) => r.data),
};
