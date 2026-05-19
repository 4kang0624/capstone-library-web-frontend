export interface WishlistItem {
  id: number;
  user_id: number;
  book_id: number;
  memo?: string;
  created_at: string;
  // Joined from books
  title?: string;
  author?: string;
  cover_image_url?: string;
  description?: string;
}

export interface WishlistCreateRequest {
  book_id: number;
  memo?: string;
}
