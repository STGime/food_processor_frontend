import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors, typography, spacing, layout } from '../theme';
import { Instruction } from '../api/types';

interface InstructionCardProps {
  instruction: Instruction;
}

export function InstructionCard({ instruction }: InstructionCardProps) {
  const { step_number, text, duration, temperature, technique } = instruction;
  const hasBadges = duration || temperature || technique;

  return (
    <View style={styles.container}>
      <View style={styles.stepNumber}>
        <Text style={styles.stepNumberText}>{step_number}</Text>
      </View>
      <View style={styles.content}>
        <Text style={styles.instructionText}>{text}</Text>
        {hasBadges && (
          <View style={styles.badges}>
            {duration && (
              <View style={[styles.badge, styles.durationBadge]}>
                <Text style={styles.badgeText}>{duration}</Text>
              </View>
            )}
            {temperature && (
              <View style={[styles.badge, styles.temperatureBadge]}>
                <Text style={styles.badgeText}>{temperature}</Text>
              </View>
            )}
            {technique && (
              <View style={[styles.badge, styles.techniqueBadge]}>
                <Text style={styles.badgeText}>{technique}</Text>
              </View>
            )}
          </View>
        )}
      </View>
    </View>
  );
}

interface PlaceholderInstructionCardProps {
  index: number;
}

export function PlaceholderInstructionCard({ index }: PlaceholderInstructionCardProps) {
  return (
    <View style={[styles.container, styles.placeholderContainer]}>
      <View style={[styles.stepNumber, styles.placeholderStep]}>
        <Text style={[styles.stepNumberText, styles.placeholderStepText]}>{index}</Text>
      </View>
      <View style={styles.content}>
        <Text style={styles.placeholderText}>Step {index} (Premium)</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: colors.surface,
    borderRadius: layout.cardRadius,
    padding: spacing.md,
    marginBottom: spacing.sm,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  placeholderContainer: {
    backgroundColor: colors.disabledBg,
    opacity: 0.6,
  },
  stepNumber: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.md,
    flexShrink: 0,
  },
  placeholderStep: {
    backgroundColor: colors.disabled,
  },
  stepNumberText: {
    ...typography.button,
    color: colors.white,
    fontSize: 14,
  },
  placeholderStepText: {
    color: colors.white,
  },
  content: {
    flex: 1,
  },
  instructionText: {
    ...typography.body,
    color: colors.textPrimary,
    lineHeight: 22,
  },
  placeholderText: {
    ...typography.body,
    color: colors.textSecondary,
    fontStyle: 'italic',
  },
  badges: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: spacing.sm,
    gap: spacing.xs,
  },
  badge: {
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: 12,
  },
  durationBadge: {
    backgroundColor: '#DBEAFE', // blue-100
  },
  temperatureBadge: {
    backgroundColor: '#FEE2E2', // red-100
  },
  techniqueBadge: {
    backgroundColor: '#E0E7FF', // indigo-100
  },
  badgeText: {
    ...typography.small,
    color: colors.textSecondary,
    fontSize: 12,
  },
});
