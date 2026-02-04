import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  Platform,
} from 'react-native';
import { useRouter } from 'expo-router';
import { colors, typography, spacing, layout } from '../theme';
import { useIAP, type PlanType } from '../hooks/useIAP';

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
  const { monthlyPackage, yearlyPackage, purchasing, error, purchase, restore } =
    useIAP();
  const router = useRouter();
  const [selectedPlan, setSelectedPlan] = useState<PlanType>('yearly');

  const monthlyPrice = monthlyPackage?.product.priceString ?? null;
  const yearlyPrice = yearlyPackage?.product.priceString ?? null;

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

          {/* Plan cards */}
          <View style={styles.planCards}>
            {yearlyPackage && (
              <TouchableOpacity
                style={[
                  styles.planCard,
                  selectedPlan === 'yearly' && styles.planCardSelected,
                ]}
                onPress={() => setSelectedPlan('yearly')}
                activeOpacity={0.7}
              >
                <View style={styles.planCardHeader}>
                  <Text
                    style={[
                      styles.planName,
                      selectedPlan === 'yearly' && styles.planNameSelected,
                    ]}
                  >
                    Yearly
                  </Text>
                  <View style={styles.badge}>
                    <Text style={styles.badgeText}>2 months free</Text>
                  </View>
                </View>
                <Text
                  style={[
                    styles.planPrice,
                    selectedPlan === 'yearly' && styles.planPriceSelected,
                  ]}
                >
                  {yearlyPrice}/year
                </Text>
              </TouchableOpacity>
            )}

            {monthlyPackage && (
              <TouchableOpacity
                style={[
                  styles.planCard,
                  selectedPlan === 'monthly' && styles.planCardSelected,
                ]}
                onPress={() => setSelectedPlan('monthly')}
                activeOpacity={0.7}
              >
                <Text
                  style={[
                    styles.planName,
                    selectedPlan === 'monthly' && styles.planNameSelected,
                  ]}
                >
                  Monthly
                </Text>
                <Text
                  style={[
                    styles.planPrice,
                    selectedPlan === 'monthly' && styles.planPriceSelected,
                  ]}
                >
                  {monthlyPrice}/month
                </Text>
              </TouchableOpacity>
            )}
          </View>

          {error && <Text style={styles.error}>{error}</Text>}

          <TouchableOpacity
            style={[
              styles.purchaseButton,
              purchasing && styles.purchaseButtonDisabled,
            ]}
            onPress={() => purchase(selectedPlan)}
            disabled={purchasing}
          >
            {purchasing ? (
              <ActivityIndicator color={colors.white} />
            ) : (
              <Text style={styles.purchaseButtonText}>Subscribe now</Text>
            )}
          </TouchableOpacity>

          <TouchableOpacity style={styles.restoreButton} onPress={restore}>
            <Text style={styles.restoreText}>Restore purchase</Text>
          </TouchableOpacity>

          <Text style={styles.disclosureText}>
            Payment will be charged to your{' '}
            {Platform.OS === 'ios' ? 'App Store' : 'Google Play'} account at
            confirmation of purchase. Subscription automatically renews unless
            cancelled at least 24 hours before the end of the current period.
            Manage or cancel anytime in your device's subscription settings.
          </Text>

          <Text style={styles.legalText}>
            By subscribing you agree to our{' '}
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
  planCards: {
    alignSelf: 'stretch',
    gap: spacing.md,
    marginBottom: spacing.xl,
  },
  planCard: {
    borderWidth: 2,
    borderColor: colors.divider,
    borderRadius: layout.cardRadius,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.lg,
  },
  planCardSelected: {
    borderColor: colors.primary,
    backgroundColor: '#F0FDF4',
  },
  planCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  planName: {
    ...typography.h2,
    color: colors.textPrimary,
  },
  planNameSelected: {
    color: colors.primaryDark,
  },
  planPrice: {
    ...typography.body,
    color: colors.textSecondary,
    marginTop: spacing.xs,
  },
  planPriceSelected: {
    color: colors.textPrimary,
  },
  badge: {
    backgroundColor: colors.accent,
    borderRadius: 8,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
  },
  badgeText: {
    ...typography.small,
    color: colors.white,
    fontWeight: '700',
    fontSize: 11,
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
  purchaseButtonDisabled: {
    opacity: 0.7,
  },
  purchaseButtonText: {
    ...typography.button,
    color: colors.white,
  },
  restoreButton: {
    paddingVertical: spacing.sm,
    marginBottom: spacing.lg,
  },
  restoreText: {
    ...typography.small,
    color: colors.textSecondary,
    textDecorationLine: 'underline',
  },
  disclosureText: {
    ...typography.small,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 18,
    marginBottom: spacing.md,
    fontSize: 11,
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
