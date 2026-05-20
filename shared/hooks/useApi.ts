import { useQuery, useMutation, UseQueryOptions, UseMutationOptions, QueryKey } from '@tanstack/react-query';
import { apiClient } from '../lib/apiClient';

export function useApiQuery<TData = unknown, TError = unknown>(
  queryKey: QueryKey,
  url: string,
  options?: Omit<UseQueryOptions<TData, TError, TData, QueryKey>, 'queryKey' | 'queryFn'>
) {
  return useQuery<TData, TError>({
    queryKey,
    queryFn: async () => {
      const { data } = await apiClient.get<TData>(url);
      return data;
    },
    ...options,
  });
}

interface MutationVariables {
  url: string;
  method?: 'POST' | 'PUT' | 'PATCH' | 'DELETE';
  data?: any;
}

export function useApiMutation<TData = unknown, TError = unknown>(
  options?: UseMutationOptions<TData, TError, MutationVariables>
) {
  return useMutation<TData, TError, MutationVariables>({
    mutationFn: async ({ url, method = 'POST', data }) => {
      const response = await apiClient({
        url,
        method,
        data,
      });
      return response.data;
    },
    ...options,
  });
}
