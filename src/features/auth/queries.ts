import { useQuery } from '@tanstack/react-query';
import { usersApi } from '@/features/users/api';
import { QUERY_KEYS } from '@/constants/queryKeys';
import { tokenStorage } from '@/lib/api/token';

export const useMe = () =>
  useQuery({
    queryKey: QUERY_KEYS.ME,
    queryFn: usersApi.getMe,
    enabled: !!tokenStorage.getAccessToken(),
    staleTime: 5 * 60 * 1000,
  });
