'use client';

import React, { useState } from 'react';
import { useToggleVendorStatus, useToggleProductStock } from 'shared';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const queryClient = new QueryClient();

export default function AppWrapper() {
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

  return (
    <div className="p-8 max-w-4xl mx-auto space-y-8">
      <h1 className="text-3xl font-bold">Vendor Dashboard</h1>

      <div className="p-6 bg-white shadow rounded-xl flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold">Store Status</h2>
          <p className="text-gray-500">Currently: {isOpen ? 'Accepting Orders' : 'Closed'}</p>
        </div>

        <button
          onClick={handleVendorToggle}
          className={`px-6 py-2 rounded-full font-bold text-white transition-colors ${isOpen ? 'bg-red-500 hover:bg-red-600' : 'bg-green-500 hover:bg-green-600'}`}
        >
          {isOpen ? 'Close Store' : 'Open Store'}
        </button>
      </div>

      <div className="p-6 bg-white shadow rounded-xl">
        <h2 className="text-xl font-semibold mb-4">Inventory Quick Toggles</h2>
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 border rounded">
            <span>Premium Salmon (1kg)</span>
            <button
                onClick={() => handleProductToggle('prod-1')}
                className="text-blue-500 font-bold hover:underline"
            >
                Toggle Out of Stock
            </button>
          </div>
          <div className="flex items-center justify-between p-4 border rounded">
            <span>Chicken Breast (500g)</span>
            <button
                onClick={() => handleProductToggle('prod-2')}
                className="text-blue-500 font-bold hover:underline"
            >
                Toggle Out of Stock
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
