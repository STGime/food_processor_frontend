import React from 'react';
import { ScrollView, Text, StyleSheet } from 'react-native';
import { colors, typography, spacing, layout } from '../src/theme';

export default function TermsScreen() {
  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
    >
      <Text style={styles.heading}>Terms & Conditions</Text>
      <Text style={styles.updated}>Last updated: January 2026</Text>

      <Text style={styles.sectionTitle}>1. Acceptance of Terms</Text>
      <Text style={styles.body}>
        By downloading, installing, or using FoodProcessor ("the App"), you
        agree to be bound by these Terms & Conditions. If you do not agree,
        please do not use the App.
      </Text>

      <Text style={styles.sectionTitle}>2. Description of Service</Text>
      <Text style={styles.body}>
        FoodProcessor extracts ingredient information from YouTube cooking
        videos. The App provides this information on a best-effort basis and
        does not guarantee accuracy or completeness of the extracted data.
      </Text>

      <Text style={styles.sectionTitle}>3. Free and Premium Tiers</Text>
      <Text style={styles.body}>
        Free users can view up to 5 ingredients per video extraction. Premium
        users, who have completed an in-app purchase, can view all detected
        ingredients without limitation.
      </Text>

      <Text style={styles.sectionTitle}>4. In-App Purchases</Text>
      <Text style={styles.body}>
        Premium access is available as a one-time in-app purchase through Apple
        App Store or Google Play Store. All purchases are final and
        non-refundable, except as required by applicable law or the respective
        store's refund policy.
      </Text>

      <Text style={styles.sectionTitle}>5. User Conduct</Text>
      <Text style={styles.body}>
        You agree not to misuse the App, including but not limited to: automated
        scraping, reverse engineering, or using the App for any unlawful
        purpose.
      </Text>

      <Text style={styles.sectionTitle}>6. Intellectual Property</Text>
      <Text style={styles.body}>
        All content and functionality of the App are owned by FoodProcessor and
        are protected by copyright and other intellectual property laws.
        Extracted recipe data originates from third-party video content and
        remains the property of the respective content creators.
      </Text>

      <Text style={styles.sectionTitle}>7. Disclaimer of Warranties</Text>
      <Text style={styles.body}>
        The App is provided "as is" without warranty of any kind. We do not
        warrant that ingredient extraction will be accurate, complete, or
        suitable for any particular purpose. Always verify ingredients,
        especially regarding allergies and dietary restrictions.
      </Text>

      <Text style={styles.sectionTitle}>8. Limitation of Liability</Text>
      <Text style={styles.body}>
        To the maximum extent permitted by law, FoodProcessor shall not be
        liable for any indirect, incidental, special, or consequential damages
        arising from the use of the App.
      </Text>

      <Text style={styles.sectionTitle}>9. Changes to Terms</Text>
      <Text style={styles.body}>
        We reserve the right to modify these terms at any time. Continued use of
        the App after changes constitutes acceptance of the modified terms.
      </Text>

      <Text style={styles.sectionTitle}>10. Contact</Text>
      <Text style={styles.body}>
        For questions about these terms, please contact us through the App's
        support channels.
      </Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  contentContainer: {
    paddingHorizontal: layout.pagePadding,
    paddingTop: spacing.lg,
    paddingBottom: 40,
  },
  heading: {
    ...typography.h1,
    color: colors.textPrimary,
    marginBottom: spacing.xs,
  },
  updated: {
    ...typography.small,
    color: colors.textSecondary,
    marginBottom: spacing.xl,
  },
  sectionTitle: {
    ...typography.h2,
    color: colors.textPrimary,
    marginTop: spacing.lg,
    marginBottom: spacing.sm,
  },
  body: {
    ...typography.body,
    color: colors.textPrimary,
    lineHeight: 24,
  },
});
