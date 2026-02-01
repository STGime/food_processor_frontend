import React, { useEffect, useState } from 'react';
import { View, Text, Alert, StyleSheet, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import Constants from 'expo-constants';
import { colors, typography, spacing, layout } from '../src/theme';
import { SettingsRow } from '../src/components/SettingsRow';
import { useDeviceStore } from '../src/store/deviceStore';
import { useIAP } from '../src/hooks/useIAP';
import { getDeviceMe } from '../src/api/devices';

export default function SettingsScreen() {
  const router = useRouter();
  const { isPremium, setIsPremium } = useDeviceStore();
  const { restore } = useIAP();
  const [restoring, setRestoring] = useState(false);

  // Refresh premium status from backend
  useEffect(() => {
    async function refresh() {
      try {
        const me = await getDeviceMe();
        setIsPremium(me.is_premium);
      } catch {
        // silently fail
      }
    }
    refresh();
  }, []);

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
            ? 'Current plan: Premium — Unlimited ingredients.'
            : 'Current plan: Free — Up to 5 ingredients per recipe.'
        }
      />

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
