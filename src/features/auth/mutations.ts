import { useMutation, useQueryClient } from '@tanstack/react-query';
import { authApi } from './api';
import { QUERY_KEYS } from '@/constants/queryKeys';
import { tokenStorage } from '@/lib/api/token';

export const useLoginMutation = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: authApi.login,
    onSuccess: (data) => {
      tokenStorage.setTokens(data.access_token, data.refresh_token);
      qc.invalidateQueries({ queryKey: QUERY_KEYS.ME });
    },
  });
};

export const useSignupMutation = () =>
  useMutation({ mutationFn: authApi.signup });

export const useLogoutMutation = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: authApi.logout,
    onSettled: () => {
      tokenStorage.clearTokens();
      qc.clear();
    },
  });
};
