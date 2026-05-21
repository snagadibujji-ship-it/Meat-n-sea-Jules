'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useToggleVendorStatus, useToggleProductStock, t, useSocket } from 'shared';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const queryClient = new QueryClient();

export default function AppWrapper() {
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
  const vendorId = 'vendor-123'; // Mock vendor ID
  const socket = useSocket('vendor', vendorId);
  const [liveOrders, setLiveOrders] = useState<any[]>([]);

  const [isOpen, setIsOpen] = useState(true);
  const [fssai, setFssai] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [bannerUrl, setBannerUrl] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const toggleVendorStatus = useToggleVendorStatus();
  const toggleProductStock = useToggleProductStock();

  useEffect(() => {
    if (!socket) return;

    socket.on('new_order', (data: any) => {
      // Play a browser ding sound (requires user interaction first in modern browsers, but good for ops)
      try {
        const audio = new Audio('/ding.mp3'); // Assuming ding.mp3 is in public dir
        audio.play().catch(e => console.log('Audio autoplay blocked by browser', e));
      } catch (e) {}

      // Prepend the new order to the list
      setLiveOrders(prev => [data, ...prev]);
    });

    return () => {
      socket.off('new_order');
    };
  }, [socket]);

  const handleVendorToggle = async () => {
    const newState = !isOpen;
    setIsOpen(newState);
    try {
      await toggleVendorStatus.mutateAsync({ vendorId, isOpen: newState });
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

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    // Simulate upload delay for demo
    setTimeout(() => {
      setBannerUrl(URL.createObjectURL(file));
      setIsUploading(false);
    }, 1000);
  };

  const mockOrderNote = "Please clean the fish and cut into medium pieces. Don't forget the head!";

  return (
    <div className="p-8 max-w-4xl mx-auto space-y-8 bg-[#0A0F1D] min-h-screen text-white">
      <h1 className="text-3xl font-bold">Vendor Dashboard</h1>

      {/* Banner Upload Zone */}
      <div className="p-6 bg-[#171f33] shadow-lg rounded-xl border border-gray-800">
        <h2 className="text-xl font-semibold mb-4 text-white">Store Banner Image</h2>
        <div
          onClick={() => fileInputRef.current?.click()}
          className="border-2 border-dashed border-gray-600 rounded-xl h-48 flex flex-col items-center justify-center cursor-pointer hover:border-[#1E6FBF] hover:bg-[#1E6FBF]/10 transition-colors relative overflow-hidden"
        >
          {bannerUrl ? (
             <img src={bannerUrl} alt="Store Banner" className="absolute inset-0 w-full h-full object-cover" />
          ) : (
            <>
              <span className="text-4xl mb-2">📸</span>
              <p className="text-gray-400 font-bold">{isUploading ? 'Uploading...' : 'Click or drag image to upload banner'}</p>
              <p className="text-gray-500 text-sm mt-2">JPEG, PNG, WEBP up to 5MB</p>
            </>
          )}
        </div>
        <input
          type="file"
          ref={fileInputRef}
          className="hidden"
          accept="image/jpeg, image/png, image/webp"
          onChange={handleFileChange}
        />
      </div>

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

      {/* Live Orders Container */}
      <div className="space-y-6">
          <h2 className="text-2xl font-bold text-white mb-2">Live Orders ({liveOrders.length + 1})</h2>

          {/* Dynamic incoming orders */}
          {liveOrders.map((order, idx) => (
            <div key={idx} className="p-6 bg-[#1E6FBF] shadow-lg rounded-xl border border-blue-800 animate-pulse">
                <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold text-white">New Order #{order.orderId.substring(order.orderId.length - 4)}</h2>
                <span className="bg-[#FFD400] text-black px-3 py-1 rounded-full font-bold text-sm">JUST IN</span>
                </div>
                <p className="text-white font-bold text-lg mb-4">Amount: ₹{(order.totalAmountPaise / 100).toFixed(2)}</p>
                <button className="w-full bg-white text-[#1E6FBF] font-black py-4 rounded-lg text-xl hover:bg-gray-100 transition-colors">
                ACCEPT ORDER
                </button>
            </div>
          ))}

          {/* Static Mock Order */}
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
      </div>
    </div>
  );
}
