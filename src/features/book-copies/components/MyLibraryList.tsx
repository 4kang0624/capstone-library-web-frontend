'use client';

import { useState } from 'react';
import { BookCopyCard } from './BookCopyCard';
import { BookCopyForm } from './BookCopyForm';
import { Modal } from '@/components/ui/Modal';
import { ConfirmDialog } from '@/components/common/ConfirmDialog';
import { EmptyState } from '@/components/common/EmptyState';
import { useMyBookCopies } from '../queries';
import { useUpdateBookCopyMutation, useDeleteBookCopyMutation } from '../mutations';
import type { BookCopy, BookCopyUpdateRequest } from '../types';

export function MyLibraryList() {
  const { data: copies = [] } = useMyBookCopies();
  const { mutateAsync: update, isPending: updating } = useUpdateBookCopyMutation();
  const { mutateAsync: del, isPending: deleting } = useDeleteBookCopyMutation();
  const [editTarget, setEditTarget] = useState<BookCopy | null>(null);
  const [deleteId, setDeleteId] = useState<number | null>(null);

  const handleEdit = async (values: BookCopyUpdateRequest) => {
    if (!editTarget) return;
    await update({ id: editTarget.id, data: values });
    setEditTarget(null);
  };

  if (copies.length === 0) {
    return <EmptyState title="등록된 도서가 없습니다" description="도서를 추가하여 서재를 구성하세요" />;
  }

  return (
    <>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {copies.map((copy) => (
          <BookCopyCard
            key={copy.id}
            copy={copy}
            showActions
            onEdit={() => setEditTarget(copy)}
            onDelete={() => setDeleteId(copy.id)}
          />
        ))}
      </div>

      <Modal open={!!editTarget} onClose={() => setEditTarget(null)} title="도서 편집">
        {editTarget && (
          <BookCopyForm
            initialValues={editTarget}
            onSubmit={handleEdit}
            loading={updating}
            submitLabel="저장"
          />
        )}
      </Modal>

      <ConfirmDialog
        open={deleteId !== null}
        onClose={() => setDeleteId(null)}
        onConfirm={async () => { if (deleteId) { await del(deleteId); setDeleteId(null); } }}
        title="도서 삭제"
        message="정말 이 도서를 서재에서 삭제하시겠습니까?"
        loading={deleting}
        danger
      />
    </>
  );
}
