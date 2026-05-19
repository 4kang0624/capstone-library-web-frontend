export interface Bookmark {
  id: number;
  user_id: number;
  book_id: number;
  book_copy_id?: number;
  current_page: number;
  note?: string;
  created_at: string;
  updated_at: string;
  // Joined from books
  title?: string;
  author?: string;
  cover_image_url?: string;
}

export interface BookmarkUpsertRequest {
  book_id: number;
  book_copy_id?: number;
  current_page: number;
  note?: string;
}
