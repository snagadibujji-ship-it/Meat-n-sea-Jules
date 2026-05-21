'use client';

import React from 'react';
import { useAdminDailyReport, displayPrice } from 'shared';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const queryClient = new QueryClient();

export default function AppWrapper() {
    // Suppress Next.js static prerender errors by delaying child render to client-side
    const [mounted, setMounted] = React.useState(false);
    React.useEffect(() => setMounted(true), []);

    if (!mounted) return null;

    return (
        <QueryClientProvider client={queryClient}>
            <AdminDashboard />
        </QueryClientProvider>
    );
}

function AdminDashboard() {
  const { data, isLoading, error } = useAdminDailyReport();

  if (isLoading) return <div className="p-8">Loading metrics...</div>;
  if (error) return <div className="p-8 text-red-500">Failed to load admin report</div>;

  return (
    <div className="p-8 max-w-4xl mx-auto space-y-8">
      <h1 className="text-3xl font-bold">Admin Analytics Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-6 bg-blue-50 border border-blue-100 rounded-xl shadow-sm">
          <h2 className="text-sm font-semibold text-blue-800 uppercase tracking-wider mb-2">Total Orders (Today)</h2>
          <p className="text-4xl font-bold text-blue-900">{data?.totalOrders || 0}</p>
        </div>

        <div className="p-6 bg-green-50 border border-green-100 rounded-xl shadow-sm">
          <h2 className="text-sm font-semibold text-green-800 uppercase tracking-wider mb-2">Gross Revenue</h2>
          <p className="text-4xl font-bold text-green-900">₹{displayPrice(data?.grossRevenuePaise || 0)}</p>
        </div>

        <div className="p-6 bg-purple-50 border border-purple-100 rounded-xl shadow-sm">
          <h2 className="text-sm font-semibold text-purple-800 uppercase tracking-wider mb-2">Platform Fee (10%)</h2>
          <p className="text-4xl font-bold text-purple-900">₹{displayPrice(data?.platformFeePaise || 0)}</p>
        </div>
      </div>

      <div className="p-6 bg-gray-50 border border-gray-200 rounded-xl shadow-sm mt-8">
          <h2 className="text-lg font-semibold text-gray-800 mb-2">Top Performing Vendor</h2>
          <p className="text-gray-600 font-mono">{data?.topVendorId ? data.topVendorId : 'No data yet today'}</p>
      </div>
    </div>
  );
}
