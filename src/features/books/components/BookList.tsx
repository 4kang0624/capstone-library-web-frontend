import type { Book } from '../types';
import { BookCard } from './BookCard';
import { EmptyState } from '@/components/common/EmptyState';

export function BookList({ books }: { books: Book[] }) {
  if (books.length === 0) {
    return <EmptyState title="도서가 없습니다" description="등록된 도서가 없습니다." />;
  }
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
      {books.map((book) => (
        <BookCard key={book.id} book={book} />
      ))}
    </div>
  );
}
