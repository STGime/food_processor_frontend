import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { colors, typography, spacing, layout } from '../theme';

interface ExtractionFailedScreenProps {
  onTryAgain: () => void;
}

export function ExtractionFailedScreen({ onTryAgain }: ExtractionFailedScreenProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.emoji}>🤔</Text>
      <Text style={styles.title}>No Recipe Found</Text>
      <Text style={styles.subtitle}>
        We couldn't extract any ingredients from this video. This might happen if:
      </Text>
      <View style={styles.reasonsList}>
        <Text style={styles.reason}>• The video doesn't contain a recipe</Text>
        <Text style={styles.reason}>• The recipe isn't clearly visible or spoken</Text>
        <Text style={styles.reason}>• The video is too short or unclear</Text>
        <Text style={styles.reason}>• There was a processing error</Text>
      </View>
      <Text style={styles.hint}>
        Try a different video, preferably one that shows cooking or clearly lists ingredients.
      </Text>
      <TouchableOpacity style={styles.button} onPress={onTryAgain}>
        <Text style={styles.buttonText}>Try Another Video</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: layout.pagePadding,
  },
  emoji: {
    fontSize: 72,
    marginBottom: spacing.xl,
  },
  title: {
    ...typography.h1,
    color: colors.textPrimary,
    textAlign: 'center',
    marginBottom: spacing.md,
  },
  subtitle: {
    ...typography.body,
    color: colors.textSecondary,
    textAlign: 'center',
    marginBottom: spacing.lg,
  },
  reasonsList: {
    alignSelf: 'stretch',
    marginBottom: spacing.lg,
    paddingHorizontal: spacing.lg,
  },
  reason: {
    ...typography.body,
    color: colors.textSecondary,
    marginBottom: spacing.sm,
  },
  hint: {
    ...typography.body,
    color: colors.textPrimary,
    textAlign: 'center',
    marginBottom: spacing.xl,
    fontWeight: '500',
  },
  button: {
    backgroundColor: colors.primary,
    paddingHorizontal: spacing.xxl,
    paddingVertical: spacing.md,
    borderRadius: layout.buttonRadius,
  },
  buttonText: {
    ...typography.button,
    color: colors.white,
  },
});
