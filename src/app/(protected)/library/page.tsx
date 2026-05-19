'use client';

import { useState } from 'react';
import { Plus } from 'lucide-react';
import { PageHeader } from '@/components/common/PageHeader';
import { MyLibraryList } from '@/features/book-copies/components/MyLibraryList';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import { useSearchByIsbn } from '@/features/search/queries';
import { useImportBookMutation } from '@/features/books/mutations';
import { useCreateBookCopyMutation } from '@/features/book-copies/mutations';
import { BookCopyForm } from '@/features/book-copies/components/BookCopyForm';
import { Input } from '@/components/ui/Input';
import { BookCopyConditionStatus } from '@/types/enums';

export default function LibraryPage() {
  const [addOpen, setAddOpen] = useState(false);
  const [isbn, setIsbn] = useState('');
  const [step, setStep] = useState<'isbn' | 'form'>('isbn');
  const { data: searchResult } = useSearchByIsbn(isbn);
  const { mutateAsync: importBook, isPending: importing } = useImportBookMutation();
  const { mutateAsync: createCopy, isPending: creating } = useCreateBookCopyMutation();
  const [bookId, setBookId] = useState<number | null>(null);

  const handleIsbnSearch = async () => {
    if (!searchResult) return;
    const book = await importBook(searchResult as unknown as Parameters<typeof importBook>[0]);
    setBookId((book as unknown as { id: number }).id);
    setStep('form');
  };

  const handleAddCopy = async (values: { condition_status: BookCopyConditionStatus; is_available_for_rent: boolean; memo?: string }) => {
    if (!bookId) return;
    await createCopy({ book_id: bookId, ...values });
    setAddOpen(false);
    setIsbn('');
    setStep('isbn');
    setBookId(null);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <PageHeader
        title="내 서재"
        description="소장 도서를 관리하세요"
        action={
          <Button onClick={() => setAddOpen(true)} size="sm">
            <Plus className="w-4 h-4" /> 도서 추가
          </Button>
        }
      />
      <MyLibraryList />

      <Modal open={addOpen} onClose={() => { setAddOpen(false); setStep('isbn'); setIsbn(''); setBookId(null); }} title="도서 추가">
        {step === 'isbn' ? (
          <div className="flex flex-col gap-4">
            <Input
              label="ISBN13"
              placeholder="ISBN13을 입력하세요"
              value={isbn}
              onChange={(e) => setIsbn(e.target.value)}
            />
            {searchResult && (
              <div className="p-4 bg-[#F9FAFB] rounded-xl">
                <p className="font-bold text-[#191F28]">{(searchResult as unknown as { title: string }).title}</p>
                <p className="text-sm text-[#6B7684]">{(searchResult as unknown as { author: string }).author}</p>
              </div>
            )}
            <Button onClick={handleIsbnSearch} loading={importing} disabled={!searchResult} fullWidth>
              다음
            </Button>
          </div>
        ) : (
          <BookCopyForm onSubmit={handleAddCopy} loading={creating} submitLabel="추가" />
        )}
      </Modal>
    </div>
  );
}