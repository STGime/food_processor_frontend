import React, { useCallback } from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  interpolate,
  runOnJS,
} from 'react-native-reanimated';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import * as Haptics from 'expo-haptics';
import { GalleryCard } from '../../api/types';
import { RecipeCard, CARD_WIDTH, CARD_MARGIN } from './RecipeCard';
import { PaginationDots } from './PaginationDots';
import { spacing } from '../../theme';

const SCREEN_WIDTH = Dimensions.get('window').width;
const SNAP_WIDTH = CARD_WIDTH + CARD_MARGIN * 2;
const SIDE_PADDING = (SCREEN_WIDTH - CARD_WIDTH) / 2;
const SWIPE_THRESHOLD = SCREEN_WIDTH * 0.2;

const SPRING_CONFIG = { damping: 20, stiffness: 150, mass: 0.5 };

interface CardCarouselProps {
  cards: GalleryCard[];
  activeIndex: number;
  isPremium: boolean;
  onIndexChange: (index: number) => void;
  onDeleteCard: (cardId: string) => void;
  onUpgrade?: () => void;
}

export function CardCarousel({
  cards,
  activeIndex,
  isPremium,
  onIndexChange,
  onDeleteCard,
  onUpgrade,
}: CardCarouselProps) {
  const translateX = useSharedValue(-activeIndex * SNAP_WIDTH);
  const startX = useSharedValue(0);

  const triggerHaptic = useCallback(() => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  }, []);

  const snapTo = useCallback(
    (index: number) => {
      'worklet';
      const clamped = Math.max(0, Math.min(index, cards.length - 1));
      translateX.value = withSpring(-clamped * SNAP_WIDTH, SPRING_CONFIG);
      runOnJS(triggerHaptic)();
      runOnJS(onIndexChange)(clamped);
    },
    [cards.length, onIndexChange, triggerHaptic],
  );

  const gesture = Gesture.Pan()
    .onStart(() => {
      startX.value = translateX.value;
    })
    .onUpdate((e) => {
      translateX.value = startX.value + e.translationX;
    })
    .onEnd((e) => {
      const currentOffset = -translateX.value;
      const velocity = e.velocityX;

      let targetIndex = Math.round(currentOffset / SNAP_WIDTH);

      // Flick gesture detection
      if (Math.abs(e.translationX) > SWIPE_THRESHOLD || Math.abs(velocity) > 500) {
        if (e.translationX > 0 || velocity > 500) {
          targetIndex = Math.floor(currentOffset / SNAP_WIDTH);
        } else {
          targetIndex = Math.ceil(currentOffset / SNAP_WIDTH);
        }
      }

      snapTo(targetIndex);
    });

  const carouselStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }],
  }));

  return (
    <View style={styles.container}>
      <GestureDetector gesture={gesture}>
        <Animated.View style={[styles.carousel, carouselStyle]}>
          {cards.map((card, index) => {
            const cardStyle = useAnimatedStyle(() => {
              const inputRange = [
                -(index + 1) * SNAP_WIDTH,
                -index * SNAP_WIDTH,
                -(index - 1) * SNAP_WIDTH,
              ];
              const scale = interpolate(
                translateX.value,
                inputRange,
                [0.92, 1, 0.92],
                'clamp',
              );
              const opacity = interpolate(
                translateX.value,
                inputRange,
                [0.6, 1, 0.6],
                'clamp',
              );
              return { transform: [{ scale }], opacity };
            });

            return (
              <Animated.View
                key={card.card_id}
                style={[styles.cardWrapper, cardStyle]}
              >
                <RecipeCard
                  card={card}
                  isPremium={isPremium}
                  onDelete={() => onDeleteCard(card.card_id)}
                  onUpgrade={onUpgrade}
                />
              </Animated.View>
            );
          })}
        </Animated.View>
      </GestureDetector>

      <PaginationDots total={cards.length} activeIndex={activeIndex} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  carousel: {
    flexDirection: 'row',
    flex: 1,
    paddingLeft: SIDE_PADDING - CARD_MARGIN,
  },
  cardWrapper: {
    width: CARD_WIDTH,
    marginHorizontal: CARD_MARGIN,
    paddingVertical: spacing.sm,
  },
});
