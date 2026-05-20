export interface User {
  id: string;
  email: string;
  role: 'customer' | 'vendor' | 'partner' | 'admin';
}

export interface IStatusTimeline {
  status: 'pending' | 'accepted' | 'preparing' | 'ready' | 'out_for_delivery' | 'delivered' | 'cancelled';
  timestamp: string; // Serialized Date from API
}

export interface Order {
  id: string;
  customerId: string;
  vendorId: string;
  partnerId?: string;
  offeredRiderId?: string;
  totalAmountPaise: number;
  paymentMethod: 'cod' | 'online';
  currentStatus: string;
  statusTimeline: IStatusTimeline[];
}

export interface Ledger {
  id: string;
  orderId: string;
  totalAmountPaise: number;
  paymentMethod: 'cod' | 'online';
  cashCollectedBy: 'platform' | 'rider';
}

export interface Vendor {
  id: string;
  name: string;
  isOpen: boolean;
  status: 'open' | 'busy' | 'closed';
  serviceRadiusKm: number;
}
