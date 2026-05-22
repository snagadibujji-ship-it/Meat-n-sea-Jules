'use client';

import React, { useState } from 'react';
import { useToggleVendorStatus, useToggleProductStock, t } from 'shared';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';


export default function AppWrapper() {
    const [queryClient] = React.useState(() => new QueryClient());
    // Suppress Next.js static prerender errors by delaying child render to client-side
    const [mounted, setMounted] = React.useState(false);
    React.useEffect(() => setMounted(true), []);

    if (!mounted) return null;

    return (
        <QueryClientProvider client={queryClient}>
            <VendorDashboard />
        </QueryClientProvider>
    );
}

function VendorDashboard() {
  const [isOpen, setIsOpen] = useState(true);
  const [fssai, setFssai] = useState('');

  const toggleVendorStatus = useToggleVendorStatus();
  const toggleProductStock = useToggleProductStock();

  const handleVendorToggle = async () => {
    const newState = !isOpen;
    setIsOpen(newState);
    try {
      await toggleVendorStatus.mutateAsync({ vendorId: 'vendor-123', isOpen: newState });
    } catch (e) {
      setIsOpen(!newState); // Revert on failure
      alert('Failed to update vendor status.');
    }
  };

  const handleProductToggle = async (productId: string) => {
    try {
      await toggleProductStock.mutateAsync({ productId });
      alert(`Toggled stock for product ${productId}`);
    } catch (e) {
      alert('Failed to update product stock.');
    }
  };

  // Mock order for UI implementation
  const mockOrderNote = "Please clean the fish and cut into medium pieces. Don't forget the head!";

  return (
    <div className="p-8 max-w-4xl mx-auto space-y-8 bg-[#0A0F1D] min-h-screen text-white">
      <h1 className="text-3xl font-bold">Vendor Dashboard</h1>

      <div className="p-6 bg-[#171f33] shadow-lg rounded-xl flex items-center justify-between border border-gray-800">
        <div>
          <h2 className="text-xl font-semibold text-white">Store Status</h2>
          <p className="text-gray-400">Currently: {isOpen ? 'Accepting Orders' : 'Closed'}</p>
        </div>

        <button
          onClick={handleVendorToggle}
          className={`px-6 py-2 rounded-full font-bold text-white transition-colors ${isOpen ? 'bg-[#CC0000] hover:bg-red-700' : 'bg-green-600 hover:bg-green-700'}`}
        >
          {isOpen ? 'Close Store' : 'Open Store'}
        </button>
      </div>

      {/* FSSAI Input */}
      <div className="p-6 bg-[#171f33] shadow-lg rounded-xl border border-gray-800">
        <h2 className="text-xl font-semibold mb-4">{t('fssaiNumber')}</h2>
        <input
          type="text"
          value={fssai}
          onChange={(e) => setFssai(e.target.value)}
          placeholder="Enter 14-digit FSSAI number"
          className="w-full p-3 bg-[#0A0F1D] border border-gray-700 rounded-lg text-white focus:outline-none focus:border-[#1E6FBF]"
        />
      </div>

      {/* Incoming Order Card with Note */}
      <div className="p-6 bg-[#1E6FBF] shadow-lg rounded-xl border border-blue-800">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold text-white">New Order #8821</h2>
          <span className="bg-[#FFD400] text-black px-3 py-1 rounded-full font-bold text-sm">JUST IN</span>
        </div>

        <div className="bg-[#FFD400] p-6 rounded-lg my-6 shadow-inner transform rotate-1">
            <h3 className="text-black font-black text-xl uppercase mb-2 tracking-widest flex items-center gap-2">
              ⚠️ CUSTOMER NOTE
            </h3>
            <p className="text-black font-bold text-3xl leading-tight">
              "{mockOrderNote}"
            </p>
        </div>

        <button className="w-full bg-white text-[#1E6FBF] font-black py-4 rounded-lg text-xl hover:bg-gray-100 transition-colors">
          ACCEPT ORDER
        </button>
      </div>

      <div className="p-6 bg-[#171f33] shadow-lg rounded-xl border border-gray-800">
        <h2 className="text-xl font-semibold mb-4 text-white">Inventory Quick Toggles</h2>
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 border border-gray-700 bg-[#0A0F1D] rounded-lg">
            <span className="text-white">Premium Salmon (1kg)</span>
            <button
                onClick={() => handleProductToggle('prod-1')}
                className="text-[#FFD400] font-bold hover:underline"
            >
                Toggle Out of Stock
            </button>
          </div>
          <div className="flex items-center justify-between p-4 border border-gray-700 bg-[#0A0F1D] rounded-lg">
            <span className="text-white">Chicken Breast (500g)</span>
            <button
                onClick={() => handleProductToggle('prod-2')}
                className="text-[#FFD400] font-bold hover:underline"
            >
                Toggle Out of Stock
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
