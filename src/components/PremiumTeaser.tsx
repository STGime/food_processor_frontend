import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { colors, typography, spacing, layout } from '../theme';

interface PremiumTeaserProps {
  totalIngredientCount: number;
  shownIngredientCount: number;
  totalInstructionCount?: number;
  shownInstructionCount?: number;
  onUpgrade: () => void;
}

export function PremiumTeaser({
  totalIngredientCount,
  shownIngredientCount,
  totalInstructionCount = 0,
  shownInstructionCount = 0,
  onUpgrade,
}: PremiumTeaserProps) {
  const hasHiddenIngredients = totalIngredientCount > shownIngredientCount;
  const hasHiddenInstructions = totalInstructionCount > shownInstructionCount;
  const hasInstructions = totalInstructionCount > 0;

  let subtitle = '';
  if (hasHiddenIngredients && hasHiddenInstructions) {
    subtitle = `You're seeing ${shownIngredientCount} of ${totalIngredientCount} ingredients and ${shownInstructionCount} of ${totalInstructionCount} steps. Upgrade to see the full recipe.`;
  } else if (hasHiddenIngredients) {
    subtitle = `You're seeing ${shownIngredientCount} of ${totalIngredientCount} ingredients. Upgrade to see all ingredients for this recipe.`;
  } else if (hasHiddenInstructions) {
    subtitle = `You're seeing ${shownInstructionCount} of ${totalInstructionCount} steps. Upgrade to see the full cooking instructions.`;
  }

  const title = hasInstructions ? 'Unlock full recipe' : 'Unlock full ingredient list';

  return (
    <View style={styles.container}>
      <Text style={styles.icon}>⭐</Text>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.subtitle}>{subtitle}</Text>
      <TouchableOpacity style={styles.button} onPress={onUpgrade}>
        <Text style={styles.buttonText}>Upgrade to Premium</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.premiumBg,
    borderRadius: layout.cardRadius,
    padding: spacing.lg,
    alignItems: 'center',
    marginVertical: spacing.lg,
    borderWidth: 1,
    borderColor: '#FFEDD5',
  },
  icon: {
    fontSize: 32,
    marginBottom: spacing.sm,
  },
  title: {
    ...typography.h2,
    color: colors.textPrimary,
    textAlign: 'center',
    marginBottom: spacing.xs,
  },
  subtitle: {
    ...typography.body,
    color: colors.textSecondary,
    textAlign: 'center',
    marginBottom: spacing.lg,
  },
  button: {
    backgroundColor: colors.accent,
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.md,
    borderRadius: layout.buttonRadius,
  },
  buttonText: {
    ...typography.button,
    color: colors.white,
  },
});
