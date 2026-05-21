'use client';

import { useState } from 'react';
import { Plus, ScanBarcode } from 'lucide-react';
import { PageHeader } from '@/components/common/PageHeader';
import { MyLibraryList } from '@/features/book-copies/components/MyLibraryList';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import { useSearchByIsbn } from '@/features/search/queries';
import { useImportBookMutation } from '@/features/books/mutations';
import { useCreateBookCopyMutation } from '@/features/book-copies/mutations';
import { BookCopyForm } from '@/features/book-copies/components/BookCopyForm';
import { BarcodeScanner } from '@/features/search/components/BarcodeScanner';
import { Input } from '@/components/ui/Input';
import { BookCopyConditionStatus } from '@/types/enums';

export default function LibraryPage() {
  const [addOpen, setAddOpen] = useState(false);
  const [isbn, setIsbn] = useState('');
  const [step, setStep] = useState<'isbn' | 'form'>('isbn');
  const [barcodeScannerOpen, setBarcodeScannerOpen] = useState(false);
  const { data: searchResult } = useSearchByIsbn(isbn);
  const { mutateAsync: importBook, isPending: importing } = useImportBookMutation();
  const { mutateAsync: createCopy, isPending: creating } = useCreateBookCopyMutation();
  const [bookId, setBookId] = useState<number | null>(null);

  const handleIsbnSearch = async () => {
    if (!searchResult?.items || searchResult.items.length === 0) return;
    const book = await importBook(searchResult.items[0]);
    setBookId((book as unknown as { id: number }).id);
    setStep('form');
  };

  const handleBarcodeScan = (scannedIsbn: string) => {
    setIsbn(scannedIsbn);
    setAddOpen(true);
    setStep('isbn');
  };

  const handleAddCopy = async (values: { condition_status: BookCopyConditionStatus; is_available_for_rent: boolean; memo?: string }) => {
    if (!bookId) return;
    await createCopy({ book_id: bookId, ...values });
    setAddOpen(false);
    setIsbn('');
    setStep('isbn');
    setBookId(null);
  };

  const firstBook = searchResult?.items?.[0];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <PageHeader
        title="내 서재"
        description="소장 도서를 관리하세요"
        action={
          <div className="flex gap-2">
            <Button onClick={() => setBarcodeScannerOpen(true)} variant="outlined" size="sm">
              <ScanBarcode className="w-4 h-4" /> 바코드 인식
            </Button>
            <Button onClick={() => setAddOpen(true)} size="sm">
              <Plus className="w-4 h-4" /> 도서 추가
            </Button>
          </div>
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
            {firstBook && (
              <div className="p-4 bg-bg-lighter rounded-xl">
                <p className="font-bold text-text-dark">{firstBook.title}</p>
                <p className="text-sm text-text-gray">{firstBook.author}</p>
              </div>
            )}
            <Button onClick={handleIsbnSearch} loading={importing} disabled={!firstBook} fullWidth>
              다음
            </Button>
          </div>
        ) : (
          <BookCopyForm onSubmit={handleAddCopy} loading={creating} submitLabel="추가" />
        )}
      </Modal>

      <BarcodeScanner
        open={barcodeScannerOpen}
        onClose={() => setBarcodeScannerOpen(false)}
        onScan={handleBarcodeScan}
      />
    </div>
  );
}