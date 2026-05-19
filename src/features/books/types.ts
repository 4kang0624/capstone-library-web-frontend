export interface Book {
  id: number;
  isbn13: string;
  isbn10?: string;
  title: string;
  author: string;
  publisher: string;
  published_date?: string;
  description?: string;
  cover_image_url?: string;
  source: string;
  view_count: number;
  created_at: string;
}

export interface BookImportRequest {
  isbn13: string;
  isbn10?: string;
  title: string;
  author: string;
  publisher: string;
  published_date?: string;
  description?: string;
  cover_image_url?: string;
  source: string;
  external_book_id?: string;
  external_url?: string;
}
