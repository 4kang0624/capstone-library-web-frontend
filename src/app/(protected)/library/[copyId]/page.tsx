'use client';

import { useState } from 'react';
import Image from 'next/image';
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft, Plus, Bookmark, BookOpen, Trash2, Loader2 } from 'lucide-react';

import { useBookCopy } from '@/features/book-copies/queries';
import { useMyReadingLogs } from '@/features/reading-logs/queries';
import { useCreateReadingLogMutation, useUpdateReadingLogMutation, useDeleteReadingLogMutation } from '@/features/reading-logs/mutations';
import { ReadingLogForm, ReadingLogList } from '@/features/reading-logs/components';
import type { ReadingLog } from '@/features/reading-logs/types';

import { useBookmarksByBook } from '@/features/bookmarks/queries';
import { useUpsertBookmarkMutation, useDeleteBookmarkMutation } from '@/features/bookmarks/mutations';
import { BookmarkForm } from '@/features/bookmarks/components';
import type { Bookmark as BookmarkType } from '@/features/bookmarks/types';

import { BookmarkRibbonButton } from '@/components/ui/BookmarkRibbon';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Modal } from '@/components/ui/Modal';
import { LoadingState } from '@/components/common/LoadingState';
import { EmptyState } from '@/components/common/EmptyState';
import { BookCopyConditionStatusLabel, BookCopyCurrentStatusLabel } from '@/types/enums';
import { Badge } from '@/components/ui/Badge';
import { useToast } from '@/hooks/useToast';
import { parseAxiosError } from '@/lib/api/errors';

export default function LibraryCopyPage() {
  const params = useParams();
  const router = useRouter();
  const copyId = parseInt(params.copyId as string);
  const { addToast } = useToast();

  // State
  const [showReadingLogForm, setShowReadingLogForm] = useState(false);
  const [editingReadingLog, setEditingReadingLog] = useState<ReadingLog | null>(null);
  const [showBookmarkModal, setShowBookmarkModal] = useState(false);
  const [editingBookmark, setEditingBookmark] = useState<BookmarkType | null>(null);

  // Queries
  const { data: bookCopy, isLoading: isLoadingCopy, error: copyError } = useBookCopy(copyId);
  const { data: readingLogs = [], refetch: refetchReadingLogs } = useMyReadingLogs();
  const { data: bookmarks = [], refetch: refetchBookmarks, isLoading: isLoadingBookmarks } = useBookmarksByBook(bookCopy?.book_id || 0);

  // Mutations
  const createReadingLogMutation = useCreateReadingLogMutation();
  const updateReadingLogMutation = useUpdateReadingLogMutation();
  const deleteReadingLogMutation = useDeleteReadingLogMutation();
  const upsertBookmarkMutation = useUpsertBookmarkMutation();
  const deleteBookmarkMutation = useDeleteBookmarkMutation();

  // Filter logs by current book
  const relevantReadingLogs = readingLogs.filter(
    (log) => log.book_id === bookCopy?.book_id && (log.book_copy_id === copyId || !log.book_copy_id),
  );
  const relevantBookmarks = bookmarks;
  
  // 초기 로드 중에는 연한색, 로드 완료 후에는 실제 북마크 여부에 따라
  const activeRibbon = !isLoadingBookmarks && relevantBookmarks.length > 0;
  const ribbonKey = `${isLoadingBookmarks}-${activeRibbon}-${relevantBookmarks.length}`;

  // Handlers
  const handleCreateReadingLog = async (data: any) => {
    try {
      await createReadingLogMutation.mutateAsync(data);
      addToast('읽기 기록이 추가되었습니다.', 'success');
      setShowReadingLogForm(false);
      refetchReadingLogs();
    } catch (error) {
      addToast(parseAxiosError(error).message, 'error');
      throw error;
    }
  };

  const handleUpdateReadingLog = async (data: any) => {
    if (!editingReadingLog) return;
    try {
      await updateReadingLogMutation.mutateAsync({ id: editingReadingLog.id, data });
      addToast('읽기 기록이 수정되었습니다.', 'success');
      setEditingReadingLog(null);
      refetchReadingLogs();
    } catch (error) {
      addToast(parseAxiosError(error).message, 'error');
      throw error;
    }
  };

  const handleDeleteReadingLog = async (logId: number) => {
    try {
      await deleteReadingLogMutation.mutateAsync(logId);
      addToast('읽기 기록이 삭제되었습니다.', 'success');
      refetchReadingLogs();
    } catch (error) {
      addToast(parseAxiosError(error).message, 'error');
    }
  };

  const handleUpsertBookmark = async (data: any) => {
    try {
      await upsertBookmarkMutation.mutateAsync(data);
      addToast('책갈피가 저장되었습니다.', 'success');
      setShowBookmarkModal(false);
      setEditingBookmark(null);
      refetchBookmarks();
    } catch (error) {
      addToast(parseAxiosError(error).message, 'error');
      throw error;
    }
  };

  const handleDeleteBookmark = async (bookmarkId: number) => {
    try {
      await deleteBookmarkMutation.mutateAsync(bookmarkId);
      addToast('책갈피가 삭제되었습니다.', 'success');
      refetchBookmarks();
    } catch (error) {
      addToast(parseAxiosError(error).message, 'error');
    }
  };

  if (isLoadingCopy) {
    return <LoadingState />;
  }

  if (copyError || !bookCopy) {
    return <EmptyState title="책 사본을 찾을 수 없습니다" />;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header with Back Button */}
      <div className="flex justify-between items-center mb-6">
        <Button
          variant="text"
          onClick={() => router.back()}
          className="gap-2"
        >
          <ArrowLeft className="w-4 h-4" />
          뒤로가기
        </Button>
      </div>

      {/* Main Grid Layout */}
      <div className="grid md:grid-cols-3 gap-8 mb-10">
        {/* Left Column: Book Cover */}
        <div className="md:col-span-1">
          <Card padding="none">
            <div className="aspect-[2/3] relative bg-gradient-to-br from-primary-blue-1 to-primary-blue-2 rounded-2xl overflow-hidden">
              {bookCopy.cover_image_url ? (
                <Image
                  src={bookCopy.cover_image_url}
                  alt={bookCopy.title || 'Book Cover'}
                  fill
                  className="object-cover"
                  priority
                />
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center p-8 text-center">
                  <p className="font-bold text-2xl text-text-dark mb-2">{bookCopy.title}</p>
                  <p className="text-lg text-text-medium">{bookCopy.author}</p>
                </div>
              )}
            </div>
          </Card>
        </div>

        {/* Right Column: Book Info & Copy Details */}
        <div className="md:col-span-2 space-y-6">
          {/* Book Info */}
          <div>
            <h1 className="font-serif text-4xl font-bold text-text-dark mb-3">{bookCopy.title || '제목 없음'}</h1>
            <p className="font-serif text-2xl text-text-medium font-semibold mb-4">{bookCopy.author}</p>
          </div>

          {/* Copy Details Card */}
          <div className="relative">
            {/* Bookmark Ribbon */}
            <BookmarkRibbonButton
              key={`ribbon-${isLoadingBookmarks}-${activeRibbon}`}
              active={activeRibbon}
              title={relevantBookmarks.length > 0 ? `${relevantBookmarks[0].current_page}페이지에 책갈피` : '책갈피 추가'}
              onClick={() => {
                if (relevantBookmarks.length > 0) {
                  setEditingBookmark(relevantBookmarks[0]);
                }
                setShowBookmarkModal(true);
              }}
            >
              {isLoadingBookmarks ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : relevantBookmarks.length > 0 ? (
                <>
                  <Bookmark className="w-4 h-4 mb-1 flex-shrink-0" />
                  <span className="text-[9px] font-bold leading-none text-center">
                    {relevantBookmarks[0].current_page}
                  </span>
                  <span className="text-[8px] leading-none">page</span>
                </>
              ) : (
                <Plus className="w-4 h-4 mt-1" />
              )}
            </BookmarkRibbonButton>

            <Card padding="lg">
            <h2 className="font-semibold text-lg text-text-dark mb-4">소장 정보</h2>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <span className="text-sm text-text-gray w-20 flex-shrink-0">상태</span>
                <Badge variant="default">
                  {BookCopyCurrentStatusLabel[bookCopy.current_status as keyof typeof BookCopyCurrentStatusLabel]}
                </Badge>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-sm text-text-gray w-20 flex-shrink-0">컨디션</span>
                <Badge variant="default">
                  {BookCopyConditionStatusLabel[bookCopy.condition_status]}
                </Badge>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-sm text-text-gray w-20 flex-shrink-0">대여 여부</span>
                <span className="text-sm font-medium text-text-dark">
                  {bookCopy.is_available_for_rent ? '대여 가능' : '대여 불가'}
                </span>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-sm text-text-gray w-20 flex-shrink-0">등록일</span>
                <span className="text-sm font-medium text-text-dark">
                  {new Date(bookCopy.created_at).toLocaleDateString('ko-KR')}
                </span>
              </div>
              {bookCopy.memo && (
                <div className="pt-2 border-t border-border">
                  <span className="text-sm text-text-gray block mb-1">메모</span>
                  <p className="text-sm text-text-medium bg-bg-light-1 rounded-lg p-3">{bookCopy.memo}</p>
                </div>
              )}
            </div>
          </Card>
          </div>{/* closes relative wrapper */}
        </div>{/* closes md:col-span-2 */}
      </div>{/* closes grid */}

      {/* Reading Logs Section */}
      <div className="space-y-6">
        <div>
          {showReadingLogForm || editingReadingLog ? (
            <Card padding="lg" className="bg-bg-light-2">
              <h2 className="font-semibold text-lg text-text-dark mb-4">
                {editingReadingLog ? '읽기 기록 수정' : '새로운 읽기 기록'}
              </h2>
              <ReadingLogForm
                bookId={bookCopy.book_id}
                bookCopyId={copyId}
                initialLog={editingReadingLog || undefined}
                onSubmit={editingReadingLog ? handleUpdateReadingLog : handleCreateReadingLog}
                onCancel={() => {
                  setShowReadingLogForm(false);
                  setEditingReadingLog(null);
                }}
                isLoading={createReadingLogMutation.isPending || updateReadingLogMutation.isPending}
              />
            </Card>
          ) : (
            <Button onClick={() => setShowReadingLogForm(true)} className="gap-2">
              <Plus className="w-4 h-4" />
              읽기 기록 추가
            </Button>
          )}

          <div className="mt-6">
          {relevantReadingLogs.length > 0 ? (
            <Card padding="lg">
              <h2 className="font-semibold text-lg text-text-dark mb-4 flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-primary" />
                읽기 기록 ({relevantReadingLogs.length})
              </h2>
              <ReadingLogList
                logs={relevantReadingLogs}
                onEdit={(log) => {
                  setEditingReadingLog(log);
                  setShowReadingLogForm(false);
                }}
                onDelete={handleDeleteReadingLog}
                isDeleting={deleteReadingLogMutation.isPending}
                isEditing={updateReadingLogMutation.isPending}
              />
            </Card>
          ) : (
            !showReadingLogForm && (
              <div className="text-center py-12 text-text-light">읽기 기록이 없습니다</div>
            )
          )}
          </div>
        </div>
      </div>

      {/* Bookmark Modal */}
      <Modal
        open={showBookmarkModal}
        onClose={() => {
          setShowBookmarkModal(false);
          setEditingBookmark(null);
        }}
        title={editingBookmark ? '책갈피 수정' : '새로운 책갈피'}
        maxWidth="md"
      >
        <div className="space-y-4">
          <BookmarkForm
            bookId={bookCopy.book_id}
            bookCopyId={copyId}
            initialBookmark={editingBookmark || undefined}
            onSubmit={handleUpsertBookmark}
            onCancel={() => {
              setShowBookmarkModal(false);
              setEditingBookmark(null);
            }}
            isLoading={upsertBookmarkMutation.isPending}
          />
          {editingBookmark && (
            <Button
              variant="text"
              onClick={() => handleDeleteBookmark(editingBookmark.id)}
              className="w-full text-error"
              disabled={deleteBookmarkMutation.isPending}
            >
              <Trash2 className="w-4 h-4 mr-2" />
              {deleteBookmarkMutation.isPending ? '삭제 중...' : '책갈피 삭제'}
            </Button>
          )}
        </div>
      </Modal>
    </div>
  );
}