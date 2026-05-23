export enum OnchainRentalStatus {
  Requested = 0,
  Accepted = 1,
  Rejected = 2,
  Paid = 3,
  Shipped = 4,
  Delivered = 5,
  ReturnRequested = 6,
  Completed = 7,
  Cancelled = 8,
  Disputed = 9,
}

export const OnchainRentalStatusLabel: Record<OnchainRentalStatus, string> = {
  [OnchainRentalStatus.Requested]: '요청됨',
  [OnchainRentalStatus.Accepted]: '승인됨',
  [OnchainRentalStatus.Rejected]: '거절됨',
  [OnchainRentalStatus.Paid]: '예치 완료',
  [OnchainRentalStatus.Shipped]: '발송 완료',
  [OnchainRentalStatus.Delivered]: '수령 확인',
  [OnchainRentalStatus.ReturnRequested]: '반납 요청',
  [OnchainRentalStatus.Completed]: '정산 완료',
  [OnchainRentalStatus.Cancelled]: '취소됨',
  [OnchainRentalStatus.Disputed]: '분쟁 중',
};

export interface OnchainRental {
  rentalId: number;
  bookId: number;
  owner: string;
  renter: string;
  depositWei: string;
  shippingFeeWei: string;
  createdAt: number;
  dueDate: number;
  status: OnchainRentalStatus;
  statusLabel: string;
}

export interface CreateEscrowRentalParams {
  bookId: number;
  owner: string;
  depositWei: string;
  shippingFeeWei: string;
  dueDateUnix: number;
}

export interface EscrowTransactionResult {
  txHash: string;
  onchainRentalId?: number;
  status?: OnchainRentalStatus;
  from?: string;
}
