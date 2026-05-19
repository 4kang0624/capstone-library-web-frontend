export interface ReadingLog {
  id: number;
  user_id: number;
  book_id: number;
  book_copy_id?: number;
  reading_status: string;
  started_at?: string;
  finished_at?: string;
  rating?: number;
  memo?: string;
  created_at: string;
  updated_at: string;
  // Joined from books
  title?: string;
  author?: string;
  cover_image_url?: string;
}

export interface ReadingLogCreateRequest {
  book_id: number;
  book_copy_id?: number;
  reading_status: string;
  started_at?: string;
  finished_at?: string;
  rating?: number;
  memo?: string;
}

export interface ReadingLogUpdateRequest {
  reading_status?: string;
  finished_at?: string;
  rating?: number;
  memo?: string;
}
