'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Search, SearchX } from 'lucide-react';
import { useSearchBooks } from '@/features/search/queries';
import { useImportBookMutation } from '@/features/books/mutations';
import { useDebounce } from '@/hooks/useDebounce';
import { LoadingState } from '@/components/common/LoadingState';
import { EmptyState } from '@/components/common/EmptyState';
import { PageHeader } from '@/components/common/PageHeader';
import { Input } from '@/components/ui';
import { SearchResultCard } from '@/features/search/components/BookSearchResults';
import type { SearchBookResult } from '@/features/search/types';

export default function SearchPage() {
  const router = useRouter();
  const [query, setQuery] = useState('');
  const [loadingIsbn, setLoadingIsbn] = useState<string | null>(null);
  const debouncedQuery = useDebounce(query, 400);
  const { data, isLoading } = useSearchBooks(debouncedQuery);
  const { mutateAsync: importBook } = useImportBookMutation();

  const books = data?.items ?? [];

  const handleDetailClick = async (item: SearchBookResult) => {
    setLoadingIsbn(item.isbn13);
    try {
      const importedBook = await importBook({
        isbn13: item.isbn13,
        isbn10: item.isbn10,
        title: item.title,
        author: item.author,
        publisher: item.publisher,
        published_date: item.published_date,
        description: item.description,
        cover_image_url: item.cover_image_url,
        source: item.source,
        external_book_id: item.external_book_id,
        external_url: item.external_url,
      });
      
      router.push(`/books/${importedBook.id}`);
    } catch (error) {
      console.error('Failed to import and navigate to book detail:', error);
    } finally {
      setLoadingIsbn(null);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <PageHeader title="도서 검색" description="원하는 도서를 검색하세요" />

      <div className="mb-8">
        <Input
          startAdornment={<Search className="w-5 h-5" />}
          placeholder="책 제목, 저자, ISBN을 입력하세요"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="rounded-2xl text-lg py-4 shadow-sm bg-bg-light-1 pl-12"
        />
      </div>

      {isLoading && <LoadingState />}
      {!isLoading && debouncedQuery && books.length === 0 && (
        <EmptyState icon={<SearchX className="w-14 h-14 text-text-gray/20" />} title="검색 결과가 없습니다" description="다른 검색어로 시도해보세요" />
      )}
      {!isLoading && !debouncedQuery && (
        <EmptyState icon={<Search className="w-14 h-14 text-text-gray/20" />} title="검색어를 입력하세요" description="도서 제목, 저자 이름으로 검색할 수 있습니다" />
      )}
      {books.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {books.map((book) => (
            <SearchResultCard 
              key={book.isbn13} 
              item={book}
              onAction={() => handleDetailClick(book)}
              loading={loadingIsbn === book.isbn13}
            />
          ))}
        </div>
      )}
    </div>
  );
}
