import { useQuery } from '@tanstack/react-query';
import { readingLogsApi } from './api';
import { QUERY_KEYS } from '@/constants/queryKeys';

export const useMyReadingLogs = () =>
  useQuery({
    queryKey: QUERY_KEYS.MY_READING_LOGS,
    queryFn: readingLogsApi.getMy,
  });
