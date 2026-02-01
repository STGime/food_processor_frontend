import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { colors, typography, spacing, layout } from '../theme';

interface PremiumTeaserProps {
  totalCount: number;
  shownCount: number;
  onUpgrade: () => void;
}

export function PremiumTeaser({
  totalCount,
  shownCount,
  onUpgrade,
}: PremiumTeaserProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.icon}>⭐</Text>
      <Text style={styles.title}>Unlock full ingredient list</Text>
      <Text style={styles.subtitle}>
        You're seeing {shownCount} of {totalCount} ingredients. Upgrade to see
        all ingredients for this recipe.
      </Text>
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
