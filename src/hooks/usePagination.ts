'use client';

import { useState } from 'react';

export function usePagination(initialPage = 1, initialSize = 20) {
  const [page, setPage] = useState(initialPage);
  const [size] = useState(initialSize);

  const nextPage = () => setPage((p) => p + 1);
  const prevPage = () => setPage((p) => Math.max(1, p - 1));
  const goToPage = (n: number) => setPage(n);

  return { page, size, nextPage, prevPage, goToPage };
}
