import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  StyleSheet,
} from 'react-native';
import { useRouter } from 'expo-router';
import { colors, typography, spacing, layout } from '../theme';
import { useSettingsStore } from '../store/settingsStore';

export function ConsentModal() {
  const { hasAcceptedTerms, _hasHydrated, setHasAcceptedTerms } =
    useSettingsStore();
  const router = useRouter();

  // Don't render until store is hydrated
  if (!_hasHydrated || hasAcceptedTerms) {
    return null;
  }

  return (
    <Modal
      visible={!hasAcceptedTerms}
      animationType="fade"
      transparent
      statusBarTranslucent
    >
      <View style={styles.overlay}>
        <View style={styles.card}>
          <Text style={styles.emoji}>🍳</Text>
          <Text style={styles.title}>Welcome to FoodProcessor</Text>
          <Text style={styles.body}>
            By using FoodProcessor you agree to our Terms & Conditions and
            Privacy Policy.
          </Text>

          <TouchableOpacity
            style={styles.detailsButton}
            onPress={() => {
              setHasAcceptedTerms(true);
              router.push('/terms');
            }}
          >
            <Text style={styles.detailsText}>View details</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.acceptButton}
            onPress={() => setHasAcceptedTerms(true)}
          >
            <Text style={styles.acceptText}>Accept & continue</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: colors.overlay,
    justifyContent: 'center',
    alignItems: 'center',
    padding: layout.pagePadding,
  },
  card: {
    backgroundColor: colors.surface,
    borderRadius: layout.cardRadius,
    padding: spacing.xl,
    alignItems: 'center',
    width: '100%',
    maxWidth: 340,
    ...layout.cardShadow,
  },
  emoji: {
    fontSize: 48,
    marginBottom: spacing.lg,
  },
  title: {
    ...typography.h2,
    color: colors.textPrimary,
    textAlign: 'center',
    marginBottom: spacing.sm,
  },
  body: {
    ...typography.body,
    color: colors.textSecondary,
    textAlign: 'center',
    marginBottom: spacing.xl,
    lineHeight: 22,
  },
  detailsButton: {
    paddingVertical: spacing.sm,
    marginBottom: spacing.md,
  },
  detailsText: {
    ...typography.body,
    color: colors.primary,
    textDecorationLine: 'underline',
  },
  acceptButton: {
    backgroundColor: colors.primary,
    height: layout.buttonHeight,
    borderRadius: layout.buttonRadius,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'stretch',
  },
  acceptText: {
    ...typography.button,
    color: colors.white,
  },
});
