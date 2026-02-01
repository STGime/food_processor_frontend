import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { colors, typography, spacing } from '../../theme';

export function EmptyGallery() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <Ionicons name="book-outline" size={64} color={colors.divider} />
      <Text style={styles.title}>No saved recipes yet</Text>
      <Text style={styles.subtitle}>
        Process a cooking video and save the recipe here for easy access later.
      </Text>
      <TouchableOpacity
        style={styles.button}
        onPress={() => router.push('/')}
        activeOpacity={0.8}
      >
        <Text style={styles.buttonText}>Process a Video</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: spacing.xxl,
  },
  title: {
    ...typography.h2,
    color: colors.textPrimary,
    marginTop: spacing.lg,
    marginBottom: spacing.sm,
  },
  subtitle: {
    ...typography.body,
    color: colors.textSecondary,
    textAlign: 'center',
    marginBottom: spacing.xl,
  },
  button: {
    backgroundColor: colors.primary,
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.md,
    borderRadius: 24,
  },
  buttonText: {
    ...typography.button,
    color: colors.white,
  },
});
