'use client';

import { useState } from 'react';
import { Search } from 'lucide-react';
import { useSearchBooks } from '@/features/search/queries';
import { useDebounce } from '@/hooks/useDebounce';
import { LoadingState } from '@/components/common/LoadingState';
import { EmptyState } from '@/components/common/EmptyState';
import { PageHeader } from '@/components/common/PageHeader';
import type { SearchBookResult } from '@/features/search/types';
import Image from 'next/image';

function SearchResultCard({ item }: { item: SearchBookResult }) {
  return (
    <div className="bg-white rounded-2xl border border-[#E5E8EB] p-4 hover:shadow-lg hover:-translate-y-1 transition-all">
      {item.cover_image_url && (
        <div className="relative w-full aspect-[2/3] mb-3 rounded-xl overflow-hidden bg-[#F2F4F6]">
          <Image src={item.cover_image_url} alt={item.title} fill className="object-cover" unoptimized />
        </div>
      )}
      <h3 className="font-bold text-[#191F28] text-sm line-clamp-2 mb-1">{item.title}</h3>
      <p className="text-xs text-[#6B7684] line-clamp-1">{item.author}</p>
      <p className="text-xs text-[#8B95A1]">{item.publisher}</p>
    </div>
  );
}

export default function SearchPage() {
  const [query, setQuery] = useState('');
  const debouncedQuery = useDebounce(query, 400);
  const { data, isLoading } = useSearchBooks(debouncedQuery);

  const books = data?.items ?? [];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <PageHeader title="도서 검색" description="원하는 도서를 검색하세요" />

      <div className="relative mb-8">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#8B95A1]" />
        <input
          className="w-full border border-[#E5E8EB] rounded-2xl pl-12 pr-4 py-4 text-[#191F28] text-lg placeholder:text-[#8B95A1] outline-none focus:border-[#3182F6] focus:ring-2 focus:ring-[#3182F6]/20 transition-all bg-white shadow-sm"
          placeholder="책 제목, 저자, ISBN을 입력하세요"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
      </div>

      {isLoading && <LoadingState />}
      {!isLoading && debouncedQuery && books.length === 0 && (
        <EmptyState title="검색 결과가 없습니다" description="다른 검색어로 시도해보세요" />
      )}
      {!isLoading && !debouncedQuery && (
        <EmptyState title="검색어를 입력하세요" description="도서 제목, 저자 이름으로 검색할 수 있습니다" />
      )}
      {books.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
          {books.map((book) => (
            <SearchResultCard key={book.isbn13} item={book} />
          ))}
        </div>
      )}
    </div>
  );
}
