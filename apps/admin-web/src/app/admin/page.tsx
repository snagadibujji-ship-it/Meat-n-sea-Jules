'use client';

import React, { useState } from 'react';
import { useAdminDailyReport } from 'shared';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const queryClient = new QueryClient();

export default function AppWrapper() {
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
  const { data, isLoading } = useAdminDailyReport();
  const [couponCode, setCouponCode] = useState('');
  const [discountPercent, setDiscountPercent] = useState('10');
  const [maxDiscount, setMaxDiscount] = useState('50');

  const handleCreateCoupon = () => {
    // In real app, this would use a mutation hook calling the POST /coupons endpoint
    alert(`Created coupon ${couponCode} for ${discountPercent}% off (max ₹${maxDiscount})`);
    setCouponCode('');
  };

  return (
    <div className="p-8 max-w-6xl mx-auto space-y-8 bg-[#0A0F1D] min-h-screen text-white">
      <h1 className="text-4xl font-black text-[#FFD400]">Platform Command Center</h1>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="p-6 bg-[#171f33] shadow-lg rounded-xl border border-gray-800">
          <h2 className="text-gray-400 font-bold mb-2">Daily Revenue</h2>
          <p className="text-3xl font-black text-white">
            {isLoading ? '...' : `₹${((data?.totalRevenuePaise || 0) / 100).toFixed(2)}`}
          </p>
        </div>
        <div className="p-6 bg-[#171f33] shadow-lg rounded-xl border border-gray-800">
          <h2 className="text-gray-400 font-bold mb-2">Platform Comm. (10%)</h2>
          <p className="text-3xl font-black text-[#FFD400]">
             {/* Note: Ideally returned from API, mocking derived value for demo */}
            {isLoading ? '...' : `₹${(((data?.totalRevenuePaise || 0) * 0.1) / 100).toFixed(2)}`}
          </p>
        </div>
        <div className="p-6 bg-[#171f33] shadow-lg rounded-xl border border-gray-800">
          <h2 className="text-gray-400 font-bold mb-2">Active Orders</h2>
          <p className="text-3xl font-black text-white">
            {isLoading ? '...' : data?.totalOrders}
          </p>
        </div>
        <div className="p-6 bg-[#171f33] shadow-lg rounded-xl border border-gray-800">
          <h2 className="text-gray-400 font-bold mb-2">COD Cash Held</h2>
          <p className="text-3xl font-black text-[#CC0000]">
            ₹1,450.00
          </p>
        </div>
      </div>

      {/* Coupon Manager */}
      <div className="p-8 bg-[#171f33] shadow-lg rounded-xl border border-gray-800 mt-12">
        <h2 className="text-2xl font-bold mb-6 text-[#1E6FBF]">Coupon Manager</h2>

        <div className="flex flex-col md:flex-row gap-4 items-end">
            <div className="flex-1">
                <label className="block text-gray-400 mb-2 font-bold">Promo Code</label>
                <input
                    type="text"
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                    placeholder="e.g. WELCOME10"
                    className="w-full p-3 bg-[#0A0F1D] border border-gray-700 rounded-lg text-white font-bold"
                />
            </div>
            <div className="w-32">
                <label className="block text-gray-400 mb-2 font-bold">% Off</label>
                <input
                    type="number"
                    value={discountPercent}
                    onChange={(e) => setDiscountPercent(e.target.value)}
                    className="w-full p-3 bg-[#0A0F1D] border border-gray-700 rounded-lg text-white"
                />
            </div>
            <div className="w-48">
                <label className="block text-gray-400 mb-2 font-bold">Max Discount (₹)</label>
                <input
                    type="number"
                    value={maxDiscount}
                    onChange={(e) => setMaxDiscount(e.target.value)}
                    className="w-full p-3 bg-[#0A0F1D] border border-gray-700 rounded-lg text-white"
                />
            </div>
            <button
                onClick={handleCreateCoupon}
                className="bg-[#1E6FBF] text-white font-bold py-3 px-8 rounded-lg hover:bg-blue-600 transition-colors"
            >
                Generate
            </button>
        </div>
      </div>

      {/* Analytics Placeholder */}
      <div className="p-6 bg-[#171f33] shadow-lg rounded-xl border border-gray-800 opacity-50 mt-8">
        <h2 className="text-xl font-semibold mb-4 text-white">Vendor Performance (Top 5)</h2>
        <div className="h-64 bg-[#0A0F1D] rounded-lg border border-gray-700 flex items-center justify-center">
            <p className="text-gray-500 font-bold">Chart requires Recharts</p>
        </div>
      </div>
    </div>
  );
}
