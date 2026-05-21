import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '../lib/apiClient';

// Ops Hooks
export const useNearbyVendors = (lng: number, lat: number, maxDistance?: number) => {
  return useQuery({
    queryKey: ['nearbyVendors', lng, lat, maxDistance],
    queryFn: async () => {
      const { data } = await apiClient.get('/vendors/nearby', {
        params: { lng, lat, maxDistance }
      });
      return data;
    },
    enabled: !!lng && !!lat, // Only run if we have coordinates
  });
};

export const useOrderWhatsAppLink = (orderId: string) => {
  return useQuery({
    queryKey: ['whatsappLink', orderId],
    queryFn: async () => {
      const { data } = await apiClient.get(`/orders/${orderId}/whatsapp-link`);
      return data;
    },
    enabled: !!orderId,
  });
};

export const useToggleVendorStatus = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ vendorId, isOpen }: { vendorId: string, isOpen: boolean }) => {
      const { data } = await apiClient.patch(`/vendors/${vendorId}/status`, { isOpen });
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['nearbyVendors'] });
    }
  });
};

export const useToggleProductStock = () => {
  return useMutation({
    mutationFn: async ({ productId, stockQuantity }: { productId: string, stockQuantity?: number }) => {
      const { data } = await apiClient.post(`/products/${productId}/toggle-stock`, { stockQuantity });
      return data;
    }
  });
};

// Search Hook
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

export const useAdminDailyReport = () => {
  return useQuery({
    queryKey: ['adminDailyReport'],
    queryFn: async () => {
      const { data } = await apiClient.get('/admin/daily-report');
      return data;
    }
  });
};
