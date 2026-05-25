export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  SIGNUP: '/signup',
  SEARCH: '/search',
  RENTABLE_BOOKS: '/rentable-books',
  BOOK_DETAIL: (bookId: number | string) => `/books/${bookId}`,

  // Protected
  LIBRARY: '/library',
  LIBRARY_COPY: (copyId: number | string) => `/library/${copyId}`,
  RENTALS: '/rentals',
  RENTAL_DETAIL: (rentalId: number | string) => `/rentals/${rentalId}`,
  PROFILE: '/profile',
  WISHLISTS: '/wishlists',
  BOOKMARKS: '/bookmarks',
  READING_LOGS: '/reading-logs',

  // Admin
  ADMIN: '/admin',
  ADMIN_USERS: '/admin/users',
  ADMIN_USER_DETAIL: (userId: number | string) => `/admin/users/${userId}`,
  ADMIN_DISPUTES: '/admin/disputes',
  ADMIN_DISPUTE_DETAIL: (rentalId: number | string) => `/admin/disputes/${rentalId}`,
} as const;
