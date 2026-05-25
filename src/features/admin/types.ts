import type { RentalStatus, UserStatus } from '@/types/enums';

export interface ChangeUserStatusRequest {
  status: UserStatus;
}

export interface AdminDisputeResolveRequest {
  rental_status: RentalStatus;
  return_tx_hash?: string;
  onchain_status?: string;
}
