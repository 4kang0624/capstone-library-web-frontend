export interface SearchBookResult {
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

export interface SearchResponse {
  items: SearchBookResult[];
  total_count: number;
}
