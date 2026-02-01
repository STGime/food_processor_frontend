import React, { useState, useCallback } from 'react';
import { TouchableOpacity, Text, StyleSheet, ActivityIndicator } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSequence,
  withTiming,
  withSpring,
} from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { colors, typography, spacing, layout } from '../../theme';
import { ResultsResponse, GalleryIngredient } from '../../api/types';
import { saveCard as saveCardApi, getCard, generateImage } from '../../api/gallery';
import { useGalleryStore } from '../../store/galleryStore';

interface SaveRecipeButtonProps {
  results: ResultsResponse;
}

export function SaveRecipeButton({ results }: SaveRecipeButtonProps) {
  const [saved, setSaved] = useState(false);
  const [saving, setSaving] = useState(false);
  const { cards, prependCard, setIsSaving, updateCardImage } = useGalleryStore();
  const scale = useSharedValue(1);

  // Check if already saved by video_id
  const alreadySaved = results.video_id
    ? cards.some((c) => c.video_id === results.video_id)
    : false;

  const pollForImage = useCallback(
    async (cardId: string) => {
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

  const handleSave = async () => {
    if (saving || saved || alreadySaved) return;

    setSaving(true);
    setIsSaving(true);

    // Animate press
    scale.value = withSequence(
      withTiming(0.95, { duration: 100 }),
      withSpring(1, { damping: 15, stiffness: 200 }),
    );

    try {
      const galleryIngredients: GalleryIngredient[] = results.ingredients.map(
        (ing) => ({
          name: ing.name,
          canonical_name: ing.name.toLowerCase().replace(/\s+/g, '_'),
          quantity: ing.quantity ? parseFloat(ing.quantity) || null : null,
          unit: ing.unit || null,
          raw_text: [ing.quantity, ing.unit, ing.name].filter(Boolean).join(' '),
          category: ing.category,
          optional: false,
          preparation: null,
        }),
      );

      const card = await saveCardApi({
        recipe_name: results.recipe_name || 'Untitled Recipe',
        video_id: results.video_id,
        ingredients: galleryIngredients,
        shopping_list: results.shopping_list,
        generate_image: true,
      });

      prependCard(card);
      setSaved(true);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);

      // Trigger image generation and poll for result
      if (!card.image_url) {
        generateImage(card.card_id).catch(() => {});
        pollForImage(card.card_id);
      }
    } catch {
      // allow retry on failure
    } finally {
      setSaving(false);
      setIsSaving(false);
    }
  };

  const animStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const isDisabled = saved || alreadySaved;
  const label = alreadySaved
    ? 'Saved'
    : saved
      ? 'Saved'
      : saving
        ? 'Saving...'
        : 'Save to Gallery';
  const iconName = isDisabled ? 'checkmark-circle' : 'bookmark-outline';

  return (
    <Animated.View style={animStyle}>
      <TouchableOpacity
        style={[styles.button, isDisabled && styles.buttonDisabled]}
        onPress={handleSave}
        disabled={isDisabled || saving}
        activeOpacity={0.8}
      >
        {saving ? (
          <ActivityIndicator size="small" color={colors.white} />
        ) : (
          <Ionicons
            name={iconName}
            size={20}
            color={isDisabled ? colors.primary : colors.white}
          />
        )}
        <Text style={[styles.label, isDisabled && styles.labelDisabled]}>
          {label}
        </Text>
      </TouchableOpacity>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
    backgroundColor: colors.primary,
    height: layout.buttonHeight,
    borderRadius: layout.buttonRadius,
    paddingHorizontal: spacing.xl,
  },
  buttonDisabled: {
    backgroundColor: colors.background,
    borderWidth: 1,
    borderColor: colors.primary,
  },
  label: {
    ...typography.button,
    color: colors.white,
  },
  labelDisabled: {
    color: colors.primary,
  },
});
