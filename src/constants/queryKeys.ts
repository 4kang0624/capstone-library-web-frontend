export const QUERY_KEYS = {
  // Auth
  ME: ['me'] as const,

  // Books
  BOOKS: ['books'] as const,
  BOOK: (id: number) => ['books', id] as const,

  // Book Copies
  BOOK_COPIES: ['book-copies'] as const,
  BOOK_COPIES_BY_BOOK: (bookId: number) => ['book-copies', 'book', bookId] as const,
  MY_BOOK_COPIES: ['book-copies', 'me'] as const,
  RENTABLE_COPIES: ['book-copies', 'rentable'] as const,
  BOOK_COPY: (id: number) => ['book-copies', id] as const,

  // Rentals
  MY_RENTALS: ['rentals', 'me'] as const,
  MY_LENDINGS: ['rentals', 'lendings'] as const,
  RENTAL: (id: number) => ['rentals', id] as const,

  // Wishlists
  MY_WISHLISTS: ['wishlists', 'me'] as const,

  // Bookmarks
  MY_BOOKMARKS: ['bookmarks', 'me'] as const,

  // Reading Logs
  MY_READING_LOGS: ['reading-logs', 'me'] as const,

  // Search
  SEARCH: (keyword: string) => ['search', keyword] as const,
  SEARCH_ISBN: (isbn: string) => ['search', 'isbn', isbn] as const,

  // Wallet
  MY_WALLET: ['wallet', 'me'] as const,
} as const;
