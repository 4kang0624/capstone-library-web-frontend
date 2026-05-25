import { apiClient } from '@/lib/api/client';
import type {
  Rental,
  RentalApproveRequest,
  RentalCreateRequest,
  PrepareOnchainResponse,
  RentalImageResponse,
} from './types';

export const rentalsApi = {
  create: (data: RentalCreateRequest) =>
    apiClient.post<Rental>('/rentals', data).then((r) => r.data),

  getMy: () =>
    apiClient.get<Rental[]>('/rentals/me').then((r) => r.data),

  getById: (rentalId: number) =>
    apiClient.get<Rental>(`/rentals/${rentalId}`).then((r) => r.data),

  approve: (rentalId: number, data: RentalApproveRequest) =>
    apiClient
      .post<Rental>(`/rentals/${rentalId}/approve`, {
        ...data,
        depositWei: data.deposit_wei,
        shippingFeeWei: data.shipping_fee_wei,
        dueDate: data.due_date,
      })
      .then((r) => r.data),

  reject: (rentalId: number, rejectReason?: string) =>
    apiClient
      .post<Rental>(`/rentals/${rentalId}/reject`, { reject_reason: rejectReason })
      .then((r) => r.data),

  cancel: (rentalId: number) =>
    apiClient.post<Rental>(`/rentals/${rentalId}/cancel`, {}).then((r) => r.data),

  updateDelivery: (
    rentalId: number,
    data: { tracking_number?: string; courier_company?: string; shipping_address?: string },
  ) => apiClient.patch<Rental>(`/rentals/${rentalId}/delivery`, data).then((r) => r.data),

  prepareOnchain: (rentalId: number) =>
    apiClient
      .post<PrepareOnchainResponse>(`/rentals/${rentalId}/prepare-onchain`, {})
      .then((r) => r.data),

  syncOnchain: (
    rentalId: number,
    data: {
      tx_hash: string;
      onchain_rental_id: number;
      onchain_status?: string;
      caller_wallet_address?: string;
      owner_wallet_address?: string;
    },
  ) => apiClient.post<Rental>(`/rentals/${rentalId}/sync-onchain`, data).then((r) => r.data),

  syncReturnOnchain: (rentalId: number, data: { return_tx_hash: string }) =>
    apiClient
      .post<Rental>(`/rentals/${rentalId}/sync-return-onchain`, data)
      .then((r) => r.data),

  getImages: (rentalId: number) =>
    apiClient.get<RentalImageResponse[]>(`/rentals/${rentalId}/images`).then((r) => r.data),

  uploadBeforeImage: (rentalId: number, file: File) => {
    const formData = new FormData();
    formData.append('file', file);
    return apiClient
      .post<RentalImageResponse>(`/rentals/${rentalId}/images/before`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      })
      .then((r) => r.data);
  },

  uploadAfterImage: (rentalId: number, file: File) => {
    const formData = new FormData();
    formData.append('file', file);
    return apiClient
      .post<RentalImageResponse>(`/rentals/${rentalId}/images/after`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      })
      .then((r) => r.data);
  },

  return: (rentalId: number) =>
    apiClient.post<Rental>(`/rentals/${rentalId}/return`, {}).then((r) => r.data),

  dispute: (rentalId: number, disputeReason: string) =>
    apiClient
      .post<Rental>(`/rentals/${rentalId}/dispute`, { dispute_reason: disputeReason })
      .then((r) => r.data),
};
