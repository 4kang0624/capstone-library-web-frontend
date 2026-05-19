import { useMutation, useQueryClient } from '@tanstack/react-query';
import { readingLogsApi } from './api';
import { QUERY_KEYS } from '@/constants/queryKeys';

export const useCreateReadingLogMutation = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: readingLogsApi.create,
    onSuccess: () => qc.invalidateQueries({ queryKey: QUERY_KEYS.MY_READING_LOGS }),
  });
};

export const useUpdateReadingLogMutation = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: Parameters<typeof readingLogsApi.update>[1] }) =>
      readingLogsApi.update(id, data),
    onSuccess: () => qc.invalidateQueries({ queryKey: QUERY_KEYS.MY_READING_LOGS }),
  });
};

export const useDeleteReadingLogMutation = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: readingLogsApi.delete,
    onSuccess: () => qc.invalidateQueries({ queryKey: QUERY_KEYS.MY_READING_LOGS }),
  });
};
