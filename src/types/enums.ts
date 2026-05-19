// Rental Status
export enum RentalStatus {
  REQUESTED = 'REQUESTED',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED',
  CANCELLED = 'CANCELLED',
  BORROWING = 'BORROWING',
  RETURNED = 'RETURNED',
  COMPLETED = 'COMPLETED',
  DISPUTED = 'DISPUTED',
}

export const RentalStatusLabel: Record<RentalStatus, string> = {
  [RentalStatus.REQUESTED]: '승인 대기',
  [RentalStatus.APPROVED]: '승인됨',
  [RentalStatus.REJECTED]: '거절됨',
  [RentalStatus.CANCELLED]: '취소됨',
  [RentalStatus.BORROWING]: '대여중',
  [RentalStatus.RETURNED]: '반납됨',
  [RentalStatus.COMPLETED]: '완료',
  [RentalStatus.DISPUTED]: '분쟁중',
};

// Rental Sync Status
export enum RentalSyncStatus {
  NOT_REQUIRED = 'NOT_REQUIRED',
  PREPARED = 'PREPARED',
  TX_SUBMITTED = 'TX_SUBMITTED',
  SYNCED = 'SYNCED',
  FAILED = 'FAILED',
}

// Delivery Method
export enum DeliveryMethod {
  PARCEL = 'PARCEL',
  IN_PERSON = 'IN_PERSON',
}

export const DeliveryMethodLabel: Record<DeliveryMethod, string> = {
  [DeliveryMethod.PARCEL]: '택배',
  [DeliveryMethod.IN_PERSON]: '직거래',
};

// Book Copy Condition
export enum BookCopyConditionStatus {
  GOOD = 'GOOD',
  FAIR = 'FAIR',
  POOR = 'POOR',
}

export const BookCopyConditionStatusLabel: Record<BookCopyConditionStatus, string> = {
  [BookCopyConditionStatus.GOOD]: '상',
  [BookCopyConditionStatus.FAIR]: '중',
  [BookCopyConditionStatus.POOR]: '하',
};

// Book Copy Current Status
export enum BookCopyCurrentStatus {
  AVAILABLE = 'AVAILABLE',
  REQUESTED = 'REQUESTED',
  RENTED = 'RENTED',
  UNAVAILABLE = 'UNAVAILABLE',
}

export const BookCopyCurrentStatusLabel: Record<BookCopyCurrentStatus, string> = {
  [BookCopyCurrentStatus.AVAILABLE]: '대여가능',
  [BookCopyCurrentStatus.REQUESTED]: '신청됨',
  [BookCopyCurrentStatus.RENTED]: '대여중',
  [BookCopyCurrentStatus.UNAVAILABLE]: '대여불가',
};

// Reading Status
export enum ReadingStatus {
  READING = 'READING',
  COMPLETED = 'COMPLETED',
  PAUSED = 'PAUSED',
}

export const ReadingStatusLabel: Record<ReadingStatus, string> = {
  [ReadingStatus.READING]: '읽는 중',
  [ReadingStatus.COMPLETED]: '완독',
  [ReadingStatus.PAUSED]: '일시중지',
};

// User Role
export enum UserRole {
  USER = 'USER',
  ADMIN = 'ADMIN',
}

// User Status
export enum UserStatus {
  ACTIVE = 'ACTIVE',
  SUSPENDED = 'SUSPENDED',
  DELETED = 'DELETED',
}
