import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useAppStore } from './useAppStore';

export interface CartItem {
  productId: string;
  quantity: number;
  pricePaise: number;
  name: string;
}

interface CartState {
  bazaarCart: CartItem[];
  studioCart: CartItem[];
  addItem: (item: CartItem, mode: 'bazaar' | 'studio') => void;
  removeItem: (productId: string, mode: 'bazaar' | 'studio') => void;
  clearCart: (mode: 'bazaar' | 'studio') => void;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      bazaarCart: [],
      studioCart: [],

      addItem: (item, mode) => {
        set((state) => {
          const cartKey = mode === 'bazaar' ? 'bazaarCart' : 'studioCart';
          const cart = state[cartKey];
          const existingItemIndex = cart.findIndex((i) => i.productId === item.productId);

          if (existingItemIndex >= 0) {
            const updatedCart = [...cart];
            updatedCart[existingItemIndex].quantity += item.quantity;
            return { [cartKey]: updatedCart };
          }
          return { [cartKey]: [...cart, item] };
        });
      },

      removeItem: (productId, mode) => {
        set((state) => {
          const cartKey = mode === 'bazaar' ? 'bazaarCart' : 'studioCart';
          return { [cartKey]: state[cartKey].filter((i) => i.productId !== productId) };
        });
      },

      clearCart: (mode) => {
        set({ [mode === 'bazaar' ? 'bazaarCart' : 'studioCart']: [] });
      },
    }),
    {
      name: 'meat-n-sea-cart-storage',
      // strictly use AsyncStorage to fix native crash
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);

export const useActiveCart = () => {
  const mode = useAppStore((state) => state.mode);
  const cartStore = useCartStore();

  return {
    items: mode === 'bazaar' ? cartStore.bazaarCart : cartStore.studioCart,
    addItem: (item: CartItem) => cartStore.addItem(item, mode),
    removeItem: (productId: string) => cartStore.removeItem(productId, mode),
    clearCart: () => cartStore.clearCart(mode),
    subtotalPaise: (mode === 'bazaar' ? cartStore.bazaarCart : cartStore.studioCart).reduce(
        (total, item) => total + (item.pricePaise * item.quantity), 0
    )
  };
};
