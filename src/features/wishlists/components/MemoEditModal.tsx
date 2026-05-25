'use client';

import { useState, useEffect } from 'react';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';

interface MemoEditModalProps {
  open: boolean;
  onClose: () => void;
  onSave: (memo: string) => Promise<void>;
  initialMemo?: string;
  bookTitle?: string;
}

export function MemoEditModal({ open, onClose, onSave, initialMemo = '', bookTitle }: MemoEditModalProps) {
  const [memo, setMemo] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (open) {
      setMemo(initialMemo || '');
    }
  }, [open, initialMemo]);

  const handleSave = async () => {
    setSaving(true);
    try {
      await onSave(memo);
      onClose();
    } finally {
      setSaving(false);
    }
  };

  const handleClose = () => {
    setMemo(initialMemo || '');
    onClose();
  };

  return (
    <Modal open={open} onClose={handleClose} title={`메모 ${initialMemo ? '수정' : '추가'}`} maxWidth="sm">
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-text-dark mb-2">
            {bookTitle && <span className="text-text-gray">📖 {bookTitle}</span>}
          </label>
          <textarea
            value={memo}
            onChange={(e) => setMemo(e.target.value)}
            placeholder="이 책에 대한 생각이나 읽을 계획을 작성하세요&#10;예: 추천받은 책, 꼭 읽고 싶은 이유 등"
            className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-blue-3 resize-none bg-bg-light"
            rows={5}
            maxLength={500}
          />
          <div className="text-xs text-text-gray mt-1 text-right">{memo?.length || 0}/500</div>
        </div>

        <div className="flex gap-2 justify-end">
          <Button variant="text" onClick={handleClose} disabled={saving}>
            취소
          </Button>
          <Button onClick={handleSave} loading={saving}>
            저장
          </Button>
        </div>
      </div>
    </Modal>
  );
}
