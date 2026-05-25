import type { BookCopyConditionStatus, BookCopyCurrentStatus } from '@/types/enums';

export interface BookCopy {
  id: number;
  owner_user_id: number;
  owner_nickname?: string;
  book_id: number;
  condition_status: BookCopyConditionStatus;
  is_available_for_rent: boolean;
  current_status: BookCopyCurrentStatus;
  memo?: string;
  created_at: string;
  updated_at: string;
  // Joined from books
  title?: string;
  author?: string;
  cover_image_url?: string;
}

export interface BookCopyCreateRequest {
  book_id: number;
  condition_status: BookCopyConditionStatus;
  is_available_for_rent: boolean;
  memo?: string;
}

export interface BookCopyUpdateRequest {
  condition_status?: BookCopyConditionStatus;
  is_available_for_rent?: boolean;
  memo?: string;
}
