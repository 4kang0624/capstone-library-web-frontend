import { useQuery } from '@tanstack/react-query';
import { rentalsApi } from './api';
import { QUERY_KEYS } from '@/constants/queryKeys';

export const useMyRentals = () =>
  useQuery({
    queryKey: QUERY_KEYS.MY_RENTALS,
    queryFn: rentalsApi.getMy,
  });

export const useRental = (rentalId: number) =>
  useQuery({
    queryKey: QUERY_KEYS.RENTAL(rentalId),
    queryFn: () => rentalsApi.getById(rentalId),
    enabled: !!rentalId,
  });
