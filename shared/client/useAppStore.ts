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

      inStudioGeofence: true,
      setInStudioGeofence: (val) => set({ inStudioGeofence: val })
    }),
    {
      name: 'meat-n-sea-app-storage',
      // BUG 4 FIX: Use strictly AsyncStorage to prevent crash on React Native
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
