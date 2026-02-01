import React, { useState } from 'react';
import {
  View,
  Text,
  Image,
  ScrollView,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
} from 'react-native';
import Animated, {
  FadeIn,
  useSharedValue,
  useAnimatedStyle,
  withTiming,
} from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import { colors, typography, spacing, layout } from '../../theme';
import { GalleryCard } from '../../api/types';
import { getIngredientImage } from '../../utils/ingredientEmoji';
import { ImagePlaceholder } from './ImagePlaceholder';
import { CardActions } from './CardActions';

const SCREEN_WIDTH = Dimensions.get('window').width;
export const CARD_WIDTH = SCREEN_WIDTH - 96;
export const CARD_MARGIN = 8;

interface RecipeCardProps {
  card: GalleryCard;
  isPremium: boolean;
  onDelete: () => void;
  onUpgrade?: () => void;
}

export function RecipeCard({ card, isPremium, onDelete, onUpgrade }: RecipeCardProps) {
  const [imageLoaded, setImageLoaded] = useState(false);
  const imageOpacity = useSharedValue(0);

  const imageAnimStyle = useAnimatedStyle(() => ({
    opacity: imageOpacity.value,
  }));

  const handleImageLoad = () => {
    setImageLoaded(true);
    imageOpacity.value = withTiming(1, { duration: 400 });
  };

  const grouped = card.ingredients.reduce<Record<string, typeof card.ingredients>>(
    (acc, ing) => {
      const cat = ing.category || 'Other';
      if (!acc[cat]) acc[cat] = [];
      acc[cat].push(ing);
      return acc;
    },
    {},
  );

  const hiddenCount = card.is_truncated
    ? card.total_ingredient_count - card.shown_ingredient_count
    : 0;

  return (
    <View style={styles.card}>
      {/* Image section */}
      <View style={styles.imageSection}>
        {card.image_url ? (
          <>
            {!imageLoaded && <ImagePlaceholder />}
            <Animated.Image
              source={{ uri: card.image_url }}
              style={[styles.image, imageAnimStyle]}
              resizeMode="cover"
              onLoad={handleImageLoad}
            />
          </>
        ) : (
          <ImagePlaceholder />
        )}
        {/* Name overlay */}
        <LinearGradient
          colors={['transparent', 'rgba(0,0,0,0.6)']}
          style={styles.gradient}
        >
          <Text style={styles.recipeName} numberOfLines={2}>
            {card.recipe_name}
          </Text>
        </LinearGradient>
      </View>

      {/* Ingredients section */}
      <ScrollView
        style={styles.ingredientsSection}
        contentContainerStyle={styles.ingredientsContent}
        showsVerticalScrollIndicator={false}
      >
        {Object.entries(grouped).map(([category, items]) => (
          <View key={category} style={styles.categoryGroup}>
            <Text style={styles.categoryHeader}>{category.toUpperCase()}</Text>
            {items.map((ing, i) => (
              <View key={`${ing.name}-${i}`} style={styles.ingredientRow}>
                <Image
                  source={getIngredientImage(ing.name, ing.category)}
                  style={styles.ingredientIcon}
                />
                <Text style={styles.ingredientName} numberOfLines={1}>
                  {ing.name}
                </Text>
                {ing.quantity != null && (
                  <Text style={styles.ingredientQty}>
                    {ing.quantity}{ing.unit ? ` ${ing.unit}` : ''}
                  </Text>
                )}
              </View>
            ))}
          </View>
        ))}

        {card.is_truncated && (
          <Animated.View entering={FadeIn.duration(300)} style={styles.upsellCard}>
            <Text style={styles.upsellText}>
              Unlock all {card.total_ingredient_count} ingredients
            </Text>
            <Text style={styles.upsellSubtext}>
              {hiddenCount} more hidden in free version
            </Text>
            {onUpgrade && (
              <TouchableOpacity style={styles.upsellButton} onPress={onUpgrade} activeOpacity={0.8}>
                <Text style={styles.upsellButtonText}>Upgrade</Text>
              </TouchableOpacity>
            )}
          </Animated.View>
        )}
      </ScrollView>

      {/* Action bar */}
      <CardActions card={card} onDelete={onDelete} />

      {/* Free user upsell */}
      {!isPremium && onUpgrade && (
        <TouchableOpacity
          style={styles.bottomUpsell}
          onPress={onUpgrade}
          activeOpacity={0.8}
        >
          <Text style={styles.bottomUpsellText}>
            See full recipe card — Upgrade
          </Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    width: CARD_WIDTH,
    flex: 1,
    backgroundColor: colors.surface,
    borderRadius: layout.cardRadius,
    overflow: 'hidden',
    ...layout.cardShadow,
  },
  imageSection: {
    height: '45%',
    backgroundColor: colors.divider,
  },
  image: {
    ...StyleSheet.absoluteFillObject,
    width: '100%',
    height: '100%',
  },
  gradient: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 80,
    justifyContent: 'flex-end',
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.md,
  },
  recipeName: {
    ...typography.h2,
    color: colors.white,
    fontSize: 20,
  },
  ingredientsSection: {
    flex: 1,
  },
  ingredientsContent: {
    padding: spacing.lg,
    paddingBottom: spacing.sm,
  },
  categoryGroup: {
    marginBottom: spacing.md,
  },
  categoryHeader: {
    ...typography.small,
    color: colors.textSecondary,
    letterSpacing: 1,
    marginBottom: spacing.xs,
  },
  ingredientRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.xs + 2,
  },
  ingredientIcon: {
    width: 24,
    height: 24,
    marginRight: spacing.xs,
  },
  ingredientName: {
    ...typography.body,
    color: colors.textPrimary,
    flex: 1,
  },
  ingredientQty: {
    ...typography.small,
    color: colors.textSecondary,
    marginLeft: spacing.sm,
  },
  upsellCard: {
    backgroundColor: colors.premiumBg,
    borderRadius: spacing.sm,
    padding: spacing.md,
    alignItems: 'center',
    marginTop: spacing.sm,
  },
  upsellText: {
    ...typography.body,
    fontWeight: '600',
    color: colors.accent,
  },
  upsellSubtext: {
    ...typography.small,
    color: colors.textSecondary,
    marginTop: 2,
  },
  upsellButton: {
    backgroundColor: colors.accent,
    borderRadius: 16,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.xs + 2,
    marginTop: spacing.sm,
  },
  upsellButtonText: {
    ...typography.small,
    color: colors.white,
    fontWeight: '600',
  },
  bottomUpsell: {
    backgroundColor: colors.accent,
    paddingVertical: spacing.md,
    alignItems: 'center',
  },
  bottomUpsellText: {
    ...typography.small,
    color: colors.white,
    fontWeight: '600',
  },
});
