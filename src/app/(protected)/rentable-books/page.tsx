import { RentableBookList } from '@/features/book-copies/components/RentableBookList';
import { PageHeader } from '@/components/common/PageHeader';

export default function RentableBooksPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <PageHeader
        title="대여 가능 도서"
        description="현재 대여 가능한 도서 목록입니다"
      />
      <RentableBookList />
    </div>
  );
}