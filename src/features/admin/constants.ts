import { RentalStatus, UserRole, UserStatus } from '@/types/enums';

export const USER_ROLE_LABEL: Record<UserRole, string> = {
  [UserRole.USER]: '일반 사용자',
  [UserRole.ADMIN]: '관리자',
};

export const USER_STATUS_LABEL: Record<UserStatus, string> = {
  [UserStatus.ACTIVE]: '활성',
  [UserStatus.SUSPENDED]: '정지',
  [UserStatus.DELETED]: '탈퇴',
};

export const USER_STATUS_OPTIONS = Object.values(UserStatus);

export const ADMIN_DISPUTE_RESULT_OPTIONS = [
  RentalStatus.COMPLETED,
  RentalStatus.RETURNED,
  RentalStatus.BORROWING,
  RentalStatus.CANCELLED,
] as const;
