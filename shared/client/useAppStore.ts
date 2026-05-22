import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

type AppMode = 'bazaar' | 'studio';

interface AppState {
  mode: AppMode;
  setMode: (mode: AppMode) => void;
  toggleMode: () => void;

  hasSeenOnboarding: boolean;
  setHasSeenOnboarding: (val: boolean) => void;

  bazaarOrderCount: number;
  incrementBazaarOrderCount: () => void;

  inStudioGeofence: boolean;
  setInStudioGeofence: (val: boolean) => void;
}

// Safely bridge storage for cross-platform support
const storageAdapter = {
  getItem: async (name: string) => {
    if (typeof window !== 'undefined' && window.localStorage) {
      return window.localStorage.getItem(name);
    }
    return await AsyncStorage.getItem(name);
  },
  setItem: async (name: string, value: string) => {
    if (typeof window !== 'undefined' && window.localStorage) {
      window.localStorage.setItem(name, value);
    } else {
      await AsyncStorage.setItem(name, value);
    }
  },
  removeItem: async (name: string) => {
    if (typeof window !== 'undefined' && window.localStorage) {
      window.localStorage.removeItem(name);
    } else {
      await AsyncStorage.removeItem(name);
    }
  },
};

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      mode: 'bazaar',
      setMode: (mode) => set({ mode }),
      toggleMode: () => set((state) => ({ mode: state.mode === 'bazaar' ? 'studio' : 'bazaar' })),

      hasSeenOnboarding: false,
      setHasSeenOnboarding: (val) => set({ hasSeenOnboarding: val }),

      bazaarOrderCount: 0,
      incrementBazaarOrderCount: () => set((state) => ({ bazaarOrderCount: state.bazaarOrderCount + 1 })),

      inStudioGeofence: true, // Default to true for demo
      setInStudioGeofence: (val) => set({ inStudioGeofence: val })
    }),
    {
      name: 'meat-n-sea-app-storage',
      storage: createJSONStorage(() => storageAdapter),
    }
  )
);
