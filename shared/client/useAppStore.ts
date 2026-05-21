import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

type AppMode = 'bazaar' | 'studio';

interface AppState {
  mode: AppMode;
  setMode: (mode: AppMode) => void;
  toggleMode: () => void;
}

// Fallback for cross-platform storage
const storageAdapter = {
  getItem: (name: string) => {
    if (typeof window !== 'undefined' && window.localStorage) {
      return window.localStorage.getItem(name);
    }
    return null;
  },
  setItem: (name: string, value: string) => {
    if (typeof window !== 'undefined' && window.localStorage) {
      window.localStorage.setItem(name, value);
    }
  },
  removeItem: (name: string) => {
    if (typeof window !== 'undefined' && window.localStorage) {
      window.localStorage.removeItem(name);
    }
  },
};

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      mode: 'bazaar',
      setMode: (mode) => set({ mode }),
      toggleMode: () => set((state) => ({ mode: state.mode === 'bazaar' ? 'studio' : 'bazaar' })),
    }),
    {
      name: 'meat-n-sea-app-storage',
      storage: createJSONStorage(() => storageAdapter),
    }
  )
);
