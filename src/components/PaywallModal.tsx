import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import { useRouter } from 'expo-router';
import { colors, typography, spacing, layout } from '../theme';
import { useIAP } from '../hooks/useIAP';

interface PaywallModalProps {
  visible: boolean;
  onClose: () => void;
}

const features = [
  'See all detected ingredients for every video',
  'Never miss a hidden spice or garnish',
  'Support future improvements to FoodProcessor',
];

export function PaywallModal({ visible, onClose }: PaywallModalProps) {
  const { localizedPrice, purchasing, error, purchase, restore } = useIAP();
  const router = useRouter();

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      <View style={styles.container}>
        <TouchableOpacity style={styles.closeButton} onPress={onClose}>
          <Text style={styles.closeText}>✕</Text>
        </TouchableOpacity>

        <ScrollView
          contentContainerStyle={styles.content}
          showsVerticalScrollIndicator={false}
        >
          <Text style={styles.emoji}>🍽️</Text>
          <Text style={styles.title}>Get the full ingredient list</Text>
          <Text style={styles.description}>
            Free version shows up to 5 ingredients per recipe. Premium unlocks
            all ingredients for every video.
          </Text>

          <View style={styles.featureList}>
            {features.map((feature) => (
              <View key={feature} style={styles.featureRow}>
                <Text style={styles.featureCheck}>✓</Text>
                <Text style={styles.featureText}>{feature}</Text>
              </View>
            ))}
          </View>

          {localizedPrice && (
            <Text style={styles.price}>
              Premium: {localizedPrice} (one-time)
            </Text>
          )}

          {error && <Text style={styles.error}>{error}</Text>}

          <TouchableOpacity
            style={styles.purchaseButton}
            onPress={purchase}
            disabled={purchasing}
          >
            {purchasing ? (
              <ActivityIndicator color={colors.white} />
            ) : (
              <Text style={styles.purchaseButtonText}>Upgrade now</Text>
            )}
          </TouchableOpacity>

          <TouchableOpacity style={styles.restoreButton} onPress={restore}>
            <Text style={styles.restoreText}>Restore purchase</Text>
          </TouchableOpacity>

          <Text style={styles.legalText}>
            By upgrading you agree to our{' '}
            <Text
              style={styles.legalLink}
              onPress={() => {
                onClose();
                router.push('/terms');
              }}
            >
              Terms & Conditions
            </Text>{' '}
            and{' '}
            <Text
              style={styles.legalLink}
              onPress={() => {
                onClose();
                router.push('/privacy');
              }}
            >
              Privacy Policy
            </Text>
            .
          </Text>
        </ScrollView>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.surface,
  },
  closeButton: {
    position: 'absolute',
    top: spacing.lg,
    right: spacing.lg,
    zIndex: 10,
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.background,
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeText: {
    fontSize: 18,
    color: colors.textSecondary,
  },
  content: {
    paddingHorizontal: layout.pagePadding,
    paddingTop: 80,
    paddingBottom: 40,
    alignItems: 'center',
  },
  emoji: {
    fontSize: 64,
    marginBottom: spacing.xl,
  },
  title: {
    ...typography.h1,
    color: colors.textPrimary,
    textAlign: 'center',
    marginBottom: spacing.md,
  },
  description: {
    ...typography.body,
    color: colors.textSecondary,
    textAlign: 'center',
    marginBottom: spacing.xl,
    paddingHorizontal: spacing.lg,
  },
  featureList: {
    alignSelf: 'stretch',
    marginBottom: spacing.xl,
  },
  featureRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: spacing.md,
  },
  featureCheck: {
    color: colors.primary,
    fontSize: 18,
    fontWeight: '700',
    marginRight: spacing.md,
    lineHeight: 22,
  },
  featureText: {
    ...typography.body,
    color: colors.textPrimary,
    flex: 1,
  },
  price: {
    ...typography.h2,
    color: colors.textPrimary,
    textAlign: 'center',
    marginBottom: spacing.xl,
  },
  error: {
    ...typography.small,
    color: colors.error,
    textAlign: 'center',
    marginBottom: spacing.md,
  },
  purchaseButton: {
    backgroundColor: colors.primary,
    height: layout.buttonHeight,
    borderRadius: layout.buttonRadius,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'stretch',
    marginBottom: spacing.lg,
  },
  purchaseButtonText: {
    ...typography.button,
    color: colors.white,
  },
  restoreButton: {
    paddingVertical: spacing.sm,
    marginBottom: spacing.xl,
  },
  restoreText: {
    ...typography.small,
    color: colors.textSecondary,
    textDecorationLine: 'underline',
  },
  legalText: {
    ...typography.small,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 20,
  },
  legalLink: {
    color: colors.primary,
    textDecorationLine: 'underline',
  },
});
