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

// Add missing hooks from previous phases
export const useSearch = (query: string, lat: string, lng: string, radiusKm?: string) => {
  return useQuery({
    queryKey: ['search', query, lat, lng, radiusKm],
    queryFn: async () => {
      const { data } = await apiClient.get('/search', {
        params: { q: query, lat, lng, radiusKm }
      });
      return data;
    },
    enabled: !!query && !!lat && !!lng && query.trim().length > 0, // Only search if query exists
    staleTime: 1000 * 60 * 5, // 5 minutes cache
  });
};

export const useStudioHome = () => {
  return useQuery({
    queryKey: ['studioHome'],
    queryFn: async () => {
      const { data } = await apiClient.get('/studio/home');
      return data;
    },
    staleTime: 1000 * 60 * 5, // 5 mins
  });
};

export const useStudioPlans = () => {
  return useQuery({
    queryKey: ['studioPlans'],
    queryFn: async () => {
      const { data } = await apiClient.get('/studio/plans');
      return data;
    },
    staleTime: 1000 * 60 * 60, // 1 hour
  });
};

export const useMySubscriptions = () => {
  return useQuery({
    queryKey: ['mySubscriptions'],
    queryFn: async () => {
      const { data } = await apiClient.get('/studio/subscriptions/me');
      return data;
    },
  });
};

export const useCreateSubscription = () => {
  return useMutation({
    mutationFn: async (payload: any) => {
      const { data } = await apiClient.post('/studio/subscriptions', payload);
      return data;
    },
    // We would invalidate queries here if we had queryClient in scope
  });
};

export const useAnalyticsSummary = () => {
  return useQuery({
    queryKey: ['analyticsSummary'],
    queryFn: async () => {
      const { data } = await apiClient.get('/analytics/summary');
      return data;
    },
    refetchInterval: 1000 * 60, // Refresh every minute
  });
};

export const useLogEvent = () => {
  return useMutation({
    mutationFn: async (payload: { eventName: string; metaData?: Record<string, any> }) => {
      const { data } = await apiClient.post('/analytics/event', payload);
      return data;
    },
  });
};
