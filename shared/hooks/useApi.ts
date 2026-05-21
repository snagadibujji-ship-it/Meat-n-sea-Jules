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

// SPRINT D SPECIFIC ENDPOINTS
export const useToggleVendorStatus = () => useMutation({
  mutationFn: async ({ vendorId, isOpen }: { vendorId: string, isOpen: boolean }) => {
    const { data } = await apiClient.patch(`/vendors/${vendorId}/status`, { isOpen });
    return data;
  }
});

export const useToggleProductStock = () => useMutation({
  mutationFn: async ({ productId, stockQuantity }: { productId: string, stockQuantity?: number }) => {
    const { data } = await apiClient.post(`/products/${productId}/toggle-stock`, { stockQuantity });
    return data;
  }
});

export const useAdminDailyReport = () => useApiQuery<{
  totalOrders: number;
  grossRevenuePaise: number;
  platformFeePaise: number;
  topVendorId: string | null;
}>(
  ['admin', 'daily-report'],
  '/admin/daily-report'
);

export const useOrderWhatsAppLink = (orderId: string) => useApiQuery<{ link: string }>(
  ['order', 'whatsapp-link', orderId],
  `/orders/${orderId}/whatsapp-link`,
  { enabled: !!orderId }
);
