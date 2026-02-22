import { useEffect, useRef } from 'react';
import { AppState, Platform } from 'react-native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { ShareIntentProvider } from 'expo-share-intent';
import uuid from 'react-native-uuid';
import Purchases from 'react-native-purchases';
import { useDeviceRegistration } from '../src/hooks/useDeviceRegistration';
import { ConsentModal } from '../src/components/ConsentModal';
import { useDeviceStore } from '../src/store/deviceStore';
import { REVENUECAT_API_KEY, ENTITLEMENT_ID } from '../src/constants/iap';
import { getDeviceMe } from '../src/api/devices';
import { colors } from '../src/theme';

function AppContent() {
  const setIsPremium = useDeviceStore((s) => s.setIsPremium);
  const deviceId = useDeviceStore((s) => s.deviceId);
  const setDeviceId = useDeviceStore((s) => s.setDeviceId);
  const rcConfigured = useRef(false);

  // Ensure device_id exists before anything else runs
  useEffect(() => {
    if (!deviceId) {
      setDeviceId(uuid.v4() as string);
    }
  }, [deviceId, setDeviceId]);

  useEffect(() => {
    if (!deviceId || rcConfigured.current) return;

    async function initRevenueCat() {
      if (__DEV__) {
        Purchases.setLogLevel(Purchases.LOG_LEVEL.DEBUG);
      }

      // Configure with device_id so RevenueCat webhooks include it as
      // app_user_id, allowing the backend to match it to a device record.
      Purchases.configure({
        apiKey: REVENUECAT_API_KEY!,
        appUserID: deviceId,
      });
      rcConfigured.current = true;

      try {
        const customerInfo = await Purchases.getCustomerInfo();
        const hasEntitlement =
          customerInfo.entitlements.active[ENTITLEMENT_ID] !== undefined;
        setIsPremium(hasEntitlement);
      } catch (err) {
        console.warn('RevenueCat initial sync failed:', err);
      }
    }

    if (Platform.OS !== 'web') {
      initRevenueCat();
    }
  }, [setIsPremium, deviceId]);

  // Re-check premium status when app comes to foreground
  const appState = useRef(AppState.currentState);
  useEffect(() => {
    if (Platform.OS === 'web') return;

    const subscription = AppState.addEventListener('change', async (nextState) => {
      if (appState.current.match(/inactive|background/) && nextState === 'active') {
        try {
          const [customerInfo, me] = await Promise.all([
            Purchases.getCustomerInfo(),
            getDeviceMe().catch(() => null),
          ]);
          const rcEntitled =
            customerInfo.entitlements.active[ENTITLEMENT_ID] !== undefined;
          setIsPremium(rcEntitled || (me?.is_premium ?? false));
        } catch {
          // silent — will retry next foreground
        }
      }
      appState.current = nextState;
    });

    return () => subscription.remove();
  }, [setIsPremium]);

  useDeviceRegistration();

  return (
    <>
      <StatusBar style="dark" />
      <Stack
        screenOptions={{
          headerStyle: { backgroundColor: colors.surface },
          headerTintColor: colors.textPrimary,
          headerShadowVisible: false,
          contentStyle: { backgroundColor: colors.background },
        }}
      >
        <Stack.Screen
          name="index"
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="progress"
          options={{
            title: 'Processing video...',
            presentation: 'modal',
            headerBackVisible: true,
          }}
        />
        <Stack.Screen
          name="results"
          options={{
            title: 'Ingredients',
          }}
        />
        <Stack.Screen
          name="gallery"
          options={{
            title: 'My Recipes',
          }}
        />
        <Stack.Screen
          name="settings"
          options={{
            title: 'Settings & Legal',
          }}
        />
        <Stack.Screen
          name="terms"
          options={{
            title: 'Terms & Conditions',
          }}
        />
        <Stack.Screen
          name="privacy"
          options={{
            title: 'Privacy Policy',
          }}
        />
        <Stack.Screen
          name="+not-found"
          options={{
            headerShown: false,
          }}
        />
      </Stack>
      <ConsentModal />
    </>
  );
}

export default function RootLayout() {
  return (
    <ShareIntentProvider>
      <AppContent />
    </ShareIntentProvider>
  );
}
