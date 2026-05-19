import { useQuery } from '@tanstack/react-query';
import { wishlistsApi } from './api';
import { QUERY_KEYS } from '@/constants/queryKeys';

export const useMyWishlists = () =>
  useQuery({
    queryKey: QUERY_KEYS.MY_WISHLISTS,
    queryFn: wishlistsApi.getMy,
  });
