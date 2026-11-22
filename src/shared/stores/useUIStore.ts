import { create } from 'zustand';

interface UIState {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  clearSearchQuery: () => void;
}

export const useUIStore = create<UIState>((set) => ({
  searchQuery: '',
  setSearchQuery: (searchQuery: string) => set({ searchQuery }),
  clearSearchQuery: () => set({ searchQuery: '' }),
}));
