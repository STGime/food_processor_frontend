import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface FavoritesState {
  favoriteIds: string[];
  isFavorite: (cardId: string) => boolean;
  toggleFavorite: (cardId: string) => void;
  removeFavorite: (cardId: string) => void;
}

export const useFavoritesStore = create<FavoritesState>()(
  persist(
    (set, get) => ({
      favoriteIds: [],

      isFavorite: (cardId) => get().favoriteIds.includes(cardId),

      toggleFavorite: (cardId) => {
        const current = get().favoriteIds;
        if (current.includes(cardId)) {
          set({ favoriteIds: current.filter((id) => id !== cardId) });
        } else {
          set({ favoriteIds: [...current, cardId] });
        }
      },

      removeFavorite: (cardId) => {
        const current = get().favoriteIds;
        set({ favoriteIds: current.filter((id) => id !== cardId) });
      },
    }),
    {
      name: 'favorites-store',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({
        favoriteIds: state.favoriteIds,
      }),
    },
  ),
);
