import Image from 'next/image';
import Link from 'next/link';
import type { Book } from '../types';
import { ROUTES } from '@/constants/routes';

interface BookCardProps {
  book: Book;
}

export function BookCard({ book }: BookCardProps) {
  return (
    <Link href={ROUTES.BOOK_DETAIL(book.id)} className="block">
      <div className="bg-white rounded-2xl border border-border overflow-hidden hover:shadow-lg hover:-translate-y-1 transition-all">
        <div className="aspect-[2/3] relative bg-bg-light overflow-hidden">
          {book.cover_image_url ? (
            <Image
              src={book.cover_image_url}
              alt={book.title}
              fill
              className="object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-text-light text-4xl">
              📚
            </div>
          )}
        </div>
        <div className="p-4">
          <h3 className="font-bold text-text-dark text-sm line-clamp-2 mb-1">{book.title}</h3>
          <p className="text-xs text-text-gray">{book.author}</p>
        </div>
      </div>
    </Link>
  );
}
