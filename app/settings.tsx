import React, { useState } from 'react';
import { Alert, Linking, Platform, StyleSheet, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import Constants from 'expo-constants';
import { colors, layout } from '../src/theme';
import { SettingsRow } from '../src/components/SettingsRow';
import { useDeviceStore } from '../src/store/deviceStore';
import { useIAP } from '../src/hooks/useIAP';

export default function SettingsScreen() {
  const router = useRouter();
  const isPremium = useDeviceStore((s) => s.isPremium);
  const { restore } = useIAP();
  const [restoring, setRestoring] = useState(false);

  const handleRestore = async () => {
    setRestoring(true);
    const found = await restore();
    setRestoring(false);

    if (found) {
      Alert.alert('Purchase restored', 'Your premium access has been restored.');
    } else {
      Alert.alert('No purchases found', 'We could not find any previous purchases.');
    }
  };

  const handleManageSubscription = () => {
    const url = Platform.select({
      ios: 'https://apps.apple.com/account/subscriptions',
      android:
        'https://play.google.com/store/account/subscriptions?package=com.foodprocessor.app',
      default: undefined,
    });
    if (url) {
      Linking.openURL(url);
    }
  };

  const version = Constants.expoConfig?.version || '1.0.0';

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
    >
      <SettingsRow
        label="Premium Status"
        subtitle={
          isPremium
            ? 'Active subscription'
            : 'Current plan: Free — Up to 5 ingredients per recipe.'
        }
      />

      {isPremium && (
        <SettingsRow
          label="Manage Subscription"
          subtitle="Change or cancel your plan"
          onPress={handleManageSubscription}
        />
      )}

      <SettingsRow
        label="Restore Purchase"
        subtitle={restoring ? 'Restoring...' : 'Restore a previous purchase'}
        onPress={handleRestore}
      />

      <SettingsRow
        label="Terms & Conditions"
        onPress={() => router.push('/terms')}
      />

      <SettingsRow
        label="Privacy Policy"
        onPress={() => router.push('/privacy')}
      />

      <SettingsRow
        label="About"
        subtitle={`FoodProcessor v${version}\nTurns cooking videos into shopping lists.`}
      />
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
    paddingBottom: 40,
  },
});
