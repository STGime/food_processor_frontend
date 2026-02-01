import React, { useEffect, useState, useCallback } from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { colors, spacing } from '../src/theme';
import { useGalleryStore } from '../src/store/galleryStore';
import { useDeviceStore } from '../src/store/deviceStore';
import { listCards, deleteCard as deleteCardApi, getCard } from '../src/api/gallery';
import { CardCarousel } from '../src/components/gallery/CardCarousel';
import { EmptyGallery } from '../src/components/gallery/EmptyGallery';
import { PaywallModal } from '../src/components/PaywallModal';

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
  const [paywallVisible, setPaywallVisible] = useState(false);
  const [initialLoad, setInitialLoad] = useState(true);

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
      } catch {
        // stay silent, card remains
      }
    },
    [removeCard],
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

  return (
    <GestureHandlerRootView style={styles.container}>
      <CardCarousel
        cards={cards}
        activeIndex={activeIndex}
        isPremium={isPremium}
        onIndexChange={setActiveIndex}
        onDeleteCard={handleDelete}
        onUpgrade={() => setPaywallVisible(true)}
      />
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
    paddingTop: spacing.sm,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.background,
  },
});
