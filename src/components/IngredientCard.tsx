import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { colors, typography, spacing, layout } from '../theme';
import { getIngredientImage } from '../utils/ingredientEmoji';
import { Ingredient } from '../api/types';

interface IngredientCardProps {
  ingredient: Ingredient;
  isChecked: boolean;
  onToggle: () => void;
}

export function IngredientCard({
  ingredient,
  isChecked,
  onToggle,
}: IngredientCardProps) {
  const imageSource = getIngredientImage(ingredient.name, ingredient.category);

  return (
    <View style={styles.card}>
      <Image source={imageSource} style={styles.image} />
      <View style={styles.info}>
        <Text style={styles.name}>{ingredient.name}</Text>
        <Text style={styles.category}>{ingredient.category}</Text>
        {ingredient.quantity && (
          <Text style={styles.quantity}>
            {ingredient.quantity}
            {ingredient.unit ? ` ${ingredient.unit}` : ''}
          </Text>
        )}
      </View>
      <TouchableOpacity
        style={[styles.checkbox, isChecked && styles.checkboxChecked]}
        onPress={onToggle}
      >
        <Text style={[styles.checkboxText, isChecked && styles.checkboxTextChecked]}>
          {isChecked ? 'Have' : 'Need'}
        </Text>
      </TouchableOpacity>
    </View>
  );
}

interface PlaceholderCardProps {
  index: number;
}

export function PlaceholderIngredientCard({ index }: PlaceholderCardProps) {
  return (
    <View style={[styles.card, styles.placeholderCard]}>
      <View style={[styles.image, styles.placeholderImage]} />
      <View style={styles.info}>
        <Text style={styles.placeholderName}>
          Hidden ingredient #{index} (Premium)
        </Text>
        <View style={styles.placeholderBar} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: layout.cardRadius,
    padding: spacing.md,
    marginBottom: spacing.sm,
    ...layout.cardShadow,
  },
  placeholderCard: {
    opacity: 0.5,
  },
  image: {
    width: 40,
    height: 40,
    borderRadius: 8,
    marginRight: spacing.md,
  },
  placeholderImage: {
    backgroundColor: colors.divider,
    opacity: 0.4,
  },
  info: {
    flex: 1,
  },
  name: {
    ...typography.body,
    fontWeight: '600',
    color: colors.textPrimary,
  },
  category: {
    ...typography.small,
    color: colors.textSecondary,
    marginTop: 2,
  },
  quantity: {
    ...typography.small,
    color: colors.textSecondary,
    marginTop: 2,
  },
  placeholderName: {
    ...typography.body,
    color: colors.textSecondary,
    fontStyle: 'italic',
  },
  placeholderBar: {
    height: 10,
    width: 80,
    backgroundColor: colors.divider,
    borderRadius: 5,
    marginTop: 4,
  },
  checkbox: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs + 2,
    borderRadius: spacing.sm,
    borderWidth: 1,
    borderColor: colors.primary,
    minWidth: 60,
    alignItems: 'center',
  },
  checkboxChecked: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  checkboxText: {
    ...typography.small,
    color: colors.primary,
    fontWeight: '600',
  },
  checkboxTextChecked: {
    color: colors.white,
  },
});
