import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { GalleryCard } from '../api/types';

interface GalleryState {
  cards: GalleryCard[];
  activeIndex: number;
  isLoading: boolean;
  isSaving: boolean;
  isGeneratingImage: Record<string, boolean>;
  hasMore: boolean;
  offset: number;
  error: string | null;

  setCards: (cards: GalleryCard[]) => void;
  appendCards: (cards: GalleryCard[], hasMore: boolean) => void;
  prependCard: (card: GalleryCard) => void;
  removeCard: (cardId: string) => void;
  updateCardImage: (cardId: string, imageUrl: string) => void;
  setActiveIndex: (index: number) => void;
  setIsLoading: (loading: boolean) => void;
  setIsSaving: (saving: boolean) => void;
  setIsGeneratingImage: (cardId: string, generating: boolean) => void;
  setError: (error: string | null) => void;
  reset: () => void;
}

export const useGalleryStore = create<GalleryState>()(
  persist(
    (set, get) => ({
      cards: [],
      activeIndex: 0,
      isLoading: false,
      isSaving: false,
      isGeneratingImage: {},
      hasMore: true,
      offset: 0,
      error: null,

      setCards: (cards) => set({ cards, offset: cards.length, hasMore: cards.length >= 20 }),

      appendCards: (newCards, hasMore) => {
        const existing = get().cards;
        const existingIds = new Set(existing.map((c) => c.card_id));
        const unique = newCards.filter((c) => !existingIds.has(c.card_id));
        set({
          cards: [...existing, ...unique],
          offset: existing.length + unique.length,
          hasMore,
        });
      },

      prependCard: (card) => {
        const existing = get().cards;
        if (existing.some((c) => c.card_id === card.card_id)) return;
        set({
          cards: [card, ...existing],
          activeIndex: 0,
          offset: existing.length + 1,
        });
      },

      removeCard: (cardId) => {
        const { cards, activeIndex } = get();
        const idx = cards.findIndex((c) => c.card_id === cardId);
        if (idx === -1) return;
        const next = cards.filter((c) => c.card_id !== cardId);
        let newIndex = activeIndex;
        if (activeIndex >= next.length) {
          newIndex = Math.max(0, next.length - 1);
        } else if (idx < activeIndex) {
          newIndex = activeIndex - 1;
        }
        set({ cards: next, activeIndex: newIndex });
      },

      updateCardImage: (cardId, imageUrl) => {
        const cards = get().cards.map((c) =>
          c.card_id === cardId ? { ...c, image_url: imageUrl } : c,
        );
        set({ cards });
      },

      setActiveIndex: (index) => set({ activeIndex: index }),
      setIsLoading: (isLoading) => set({ isLoading }),
      setIsSaving: (isSaving) => set({ isSaving }),
      setIsGeneratingImage: (cardId, generating) => {
        const current = get().isGeneratingImage;
        set({ isGeneratingImage: { ...current, [cardId]: generating } });
      },
      setError: (error) => set({ error }),
      reset: () =>
        set({
          cards: [],
          activeIndex: 0,
          isLoading: false,
          isSaving: false,
          isGeneratingImage: {},
          hasMore: true,
          offset: 0,
          error: null,
        }),
    }),
    {
      name: 'gallery-store',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({ cards: state.cards }),
    },
  ),
);
