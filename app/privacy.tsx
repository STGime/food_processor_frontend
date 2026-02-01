import React from 'react';
import { ScrollView, Text, StyleSheet } from 'react-native';
import { colors, typography, spacing, layout } from '../src/theme';

export default function PrivacyScreen() {
  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
    >
      <Text style={styles.heading}>Privacy Policy</Text>
      <Text style={styles.updated}>Last updated: January 2026</Text>

      <Text style={styles.sectionTitle}>1. Information We Collect</Text>
      <Text style={styles.body}>
        FoodProcessor collects minimal data to provide its services:{'\n\n'}
        • Device identifier: A randomly generated unique ID used to associate
        your device with your account and premium status.{'\n\n'}
        • YouTube URLs: The video URLs you submit for ingredient extraction.
        These are processed by our servers and not stored permanently.{'\n\n'}
        We do not collect personal information such as your name, email address,
        or location.
      </Text>

      <Text style={styles.sectionTitle}>2. How We Use Your Information</Text>
      <Text style={styles.body}>
        • To process YouTube videos and extract ingredient lists.{'\n'}
        • To manage your free or premium account status.{'\n'}
        • To improve the accuracy and performance of our extraction service.
      </Text>

      <Text style={styles.sectionTitle}>3. Data Storage and Security</Text>
      <Text style={styles.body}>
        Your API key is stored securely on your device using encrypted storage
        (Keychain on iOS, EncryptedSharedPreferences on Android). We use
        industry-standard security measures to protect data transmitted to and
        from our servers.
      </Text>

      <Text style={styles.sectionTitle}>4. Third-Party Services</Text>
      <Text style={styles.body}>
        • Apple App Store / Google Play Store: For in-app purchase processing.
        {'\n'}
        • YouTube Data: We access publicly available video metadata and
        transcripts to extract ingredient information.{'\n\n'}
        We do not sell or share your data with advertisers or data brokers.
      </Text>

      <Text style={styles.sectionTitle}>5. Data Retention</Text>
      <Text style={styles.body}>
        Extraction job data is temporary and automatically deleted from our
        servers after processing. Device registration data is retained to
        maintain your premium status.
      </Text>

      <Text style={styles.sectionTitle}>6. Your Rights</Text>
      <Text style={styles.body}>
        You can delete your device registration by uninstalling the App. If you
        need assistance with data deletion, please contact us through the App's
        support channels.
      </Text>

      <Text style={styles.sectionTitle}>7. Children's Privacy</Text>
      <Text style={styles.body}>
        FoodProcessor is not directed at children under 13. We do not knowingly
        collect information from children.
      </Text>

      <Text style={styles.sectionTitle}>8. Changes to This Policy</Text>
      <Text style={styles.body}>
        We may update this Privacy Policy from time to time. Changes will be
        reflected in the App with an updated date.
      </Text>

      <Text style={styles.sectionTitle}>9. Contact</Text>
      <Text style={styles.body}>
        For questions about this privacy policy, please contact us through the
        App's support channels.
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
