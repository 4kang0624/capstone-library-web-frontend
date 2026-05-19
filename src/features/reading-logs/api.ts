import { apiClient } from '@/lib/api/client';
import type { ReadingLog, ReadingLogCreateRequest, ReadingLogUpdateRequest } from './types';

export const readingLogsApi = {
  create: (data: ReadingLogCreateRequest) =>
    apiClient.post<ReadingLog>('/reading-logs', data).then((r) => r.data),

  getMy: () => apiClient.get<ReadingLog[]>('/reading-logs/me').then((r) => r.data),

  update: (logId: number, data: ReadingLogUpdateRequest) =>
    apiClient.patch<ReadingLog>(`/reading-logs/${logId}`, data).then((r) => r.data),

  delete: (logId: number) =>
    apiClient.delete(`/reading-logs/${logId}`).then((r) => r.data),
};
