import React, { useEffect, useState, useCallback, useMemo } from 'react';
import { View, Text, TouchableOpacity, ActivityIndicator, StyleSheet } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, typography } from '../src/theme';
import { useGalleryStore } from '../src/store/galleryStore';
import { useDeviceStore } from '../src/store/deviceStore';
import { useFavoritesStore } from '../src/store/favoritesStore';
import { listCards, deleteCard as deleteCardApi, getCard } from '../src/api/gallery';
import { CardCarousel } from '../src/components/gallery/CardCarousel';
import { EmptyGallery } from '../src/components/gallery/EmptyGallery';
import { PaywallModal } from '../src/components/PaywallModal';

type TabType = 'all' | 'favorites';

export default function GalleryScreen() {
  const {
    cards,
    activeIndex,
    isLoading,
    hasMore,
    setCards,
    appendCards,
    removeCard,
    updateCardImage,
    setActiveIndex,
    setIsLoading,
    setError,
  } = useGalleryStore();

  const isPremium = useDeviceStore((s) => s.isPremium);
  const { favoriteIds, removeFavorite } = useFavoritesStore();
  const [paywallVisible, setPaywallVisible] = useState(false);
  const [initialLoad, setInitialLoad] = useState(true);
  const [activeTab, setActiveTab] = useState<TabType>('all');
  const [favoritesIndex, setFavoritesIndex] = useState(0);

  const handleTabChange = (tab: TabType) => {
    if (tab === 'favorites') {
      setFavoritesIndex(0);
    }
    setActiveTab(tab);
  };

  const favoriteCards = useMemo(
    () => cards.filter((c) => favoriteIds.includes(c.card_id)),
    [cards, favoriteIds],
  );

  const displayedCards = activeTab === 'favorites' ? favoriteCards : cards;

  // Clamp the index to valid range for current displayed cards
  const rawIndex = activeTab === 'favorites' ? favoritesIndex : activeIndex;
  const currentIndex = displayedCards.length > 0
    ? Math.min(rawIndex, displayedCards.length - 1)
    : 0;
  const setCurrentIndex = activeTab === 'favorites' ? setFavoritesIndex : setActiveIndex;

  // Sync the stored index if it was clamped
  useEffect(() => {
    if (activeTab === 'favorites' && favoritesIndex !== currentIndex) {
      setFavoritesIndex(currentIndex);
    }
  }, [activeTab, favoritesIndex, currentIndex]);

  // Fetch cards on mount (refreshes image URLs too)
  useEffect(() => {
    async function fetchCards() {
      setIsLoading(true);
      try {
        const data = await listCards(20, 0);
        setCards(data.cards);

        // Check for any cards without images and poll them
        for (const card of data.cards) {
          if (!card.image_url) {
            pollForImage(card.card_id);
          }
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load recipes');
      } finally {
        setIsLoading(false);
        setInitialLoad(false);
      }
    }

    fetchCards();
  }, []);

  const pollForImage = useCallback(
    (cardId: string) => {
      let attempts = 0;
      const maxAttempts = 30;
      const interval = setInterval(async () => {
        attempts++;
        if (attempts >= maxAttempts) {
          clearInterval(interval);
          return;
        }
        try {
          const card = await getCard(cardId);
          if (card.image_url) {
            updateCardImage(cardId, card.image_url);
            clearInterval(interval);
          }
        } catch {
          // silently retry
        }
      }, 3000);
    },
    [updateCardImage],
  );

  const handleDelete = useCallback(
    async (cardId: string) => {
      try {
        await deleteCardApi(cardId);
        removeCard(cardId);
        removeFavorite(cardId);
      } catch {
        // stay silent, card remains
      }
    },
    [removeCard, removeFavorite],
  );

  if (initialLoad && isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  if (cards.length === 0) {
    return <EmptyGallery />;
  }

  const showEmptyFavorites = activeTab === 'favorites' && favoriteCards.length === 0;

  return (
    <GestureHandlerRootView style={styles.container}>
      {/* Tab bar */}
      <View style={styles.tabBar}>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'all' && styles.tabActive]}
          onPress={() => handleTabChange('all')}
          activeOpacity={0.7}
        >
          <Text style={[styles.tabText, activeTab === 'all' && styles.tabTextActive]}>
            All Recipes
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'favorites' && styles.tabActive]}
          onPress={() => handleTabChange('favorites')}
          activeOpacity={0.7}
        >
          <Ionicons
            name="heart"
            size={16}
            color={activeTab === 'favorites' ? colors.error : colors.textSecondary}
            style={styles.tabIcon}
          />
          <Text style={[styles.tabText, activeTab === 'favorites' && styles.tabTextFavorites]}>
            Favorites{favoriteCards.length > 0 ? ` (${favoriteCards.length})` : ''}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Content */}
      {showEmptyFavorites ? (
        <View style={styles.emptyFavorites}>
          <Ionicons name="heart-outline" size={64} color={colors.divider} />
          <Text style={styles.emptyTitle}>No favorites yet</Text>
          <Text style={styles.emptySubtitle}>
            Tap the heart icon on any recipe card to save it here
          </Text>
        </View>
      ) : (
        <CardCarousel
          key={`${activeTab}-${activeTab === 'favorites' ? favoriteCards.length : ''}`}
          cards={displayedCards}
          activeIndex={currentIndex}
          isPremium={isPremium}
          onIndexChange={setCurrentIndex}
          onDeleteCard={handleDelete}
          onUpgrade={() => setPaywallVisible(true)}
        />
      )}

      <PaywallModal
        visible={paywallVisible}
        onClose={() => setPaywallVisible(false)}
      />
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.background,
  },
  tabBar: {
    flexDirection: 'row',
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.sm,
    paddingBottom: spacing.md,
    gap: spacing.md,
  },
  tab: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.xs,
    paddingHorizontal: spacing.md,
    borderRadius: 20,
    backgroundColor: colors.surface,
  },
  tabActive: {
    backgroundColor: colors.primary + '15',
  },
  tabIcon: {
    marginRight: spacing.xs,
  },
  tabText: {
    ...typography.body,
    color: colors.textSecondary,
    fontWeight: '500',
  },
  tabTextActive: {
    color: colors.primary,
  },
  tabTextFavorites: {
    color: colors.error,
  },
  emptyFavorites: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: spacing.xl,
  },
  emptyTitle: {
    ...typography.h2,
    color: colors.textPrimary,
    marginTop: spacing.lg,
    marginBottom: spacing.xs,
  },
  emptySubtitle: {
    ...typography.body,
    color: colors.textSecondary,
    textAlign: 'center',
  },
});
