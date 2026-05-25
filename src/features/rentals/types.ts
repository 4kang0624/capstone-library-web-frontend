import type { RentalStatus, RentalSyncStatus, DeliveryMethod } from '@/types/enums';

export interface Rental {
  id: number;
  book_id: number;
  book_title?: string;
  title?: string;
  book?: {
    title?: string;
  };
  book_copy_id: number;
  lender_user_id: number;
  lender_nickname?: string;
  lender?: {
    nickname?: string;
  };
  borrower_user_id: number;
  borrower_nickname?: string;
  borrower?: {
    nickname?: string;
  };
  rental_status: RentalStatus;
  sync_status: RentalSyncStatus;
  deposit_wei: string;
  shipping_fee_wei: string;
  delivery_method: DeliveryMethod;
  shipping_address?: string;
  tracking_number?: string;
  courier_company?: string;
  due_date?: string;
  request_message?: string;
  reject_reason?: string;
  dispute_reason?: string;
  requested_at: string;
  approved_at?: string;
  rejected_at?: string;
  cancelled_at?: string;
  borrowed_at?: string;
  returned_at?: string;
  contract_address?: string;
  chain_id?: number;
  tx_hash?: string;
  return_tx_hash?: string;
  onchain_rental_id?: number;
  lender_wallet_address?: string;
  borrower_wallet_address?: string;
  onchain_status?: string;
  last_synced_at?: string;
  created_at: string;
  updated_at: string;
}

export interface RentalCreateRequest {
  book_copy_id: number;
  deposit_wei?: string;
  shipping_fee_wei?: string;
  delivery_method?: DeliveryMethod;
  shipping_address?: string;
  due_date?: string;
  request_message?: string;
}

export interface RentalApproveRequest {
  deposit_wei: string;
  shipping_fee_wei: string;
  due_date: string;
}

export interface RentalImageResponse {
  id: number;
  rental_id: number;
  uploader_user_id: number;
  image_phase: string;
  file_path: string;
  original_name?: string;
  content_type?: string;
  file_size?: number;
  created_at: string;
}

export interface PrepareOnchainResponse {
  rental_id: number;
  contract_address: string;
  chain_id: number;
  book_copy_id: number;
  due_date_unix?: number;
  deposit_wei: string;
  shipping_fee_wei: string;
  lender_wallet_address?: string;
  borrower_wallet_address?: string;
}
