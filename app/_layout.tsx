import { useEffect } from 'react';
import { Platform } from 'react-native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { ShareIntentProvider } from 'expo-share-intent';
import Purchases from 'react-native-purchases';
import { useDeviceRegistration } from '../src/hooks/useDeviceRegistration';
import { ConsentModal } from '../src/components/ConsentModal';
import { useDeviceStore } from '../src/store/deviceStore';
import { REVENUECAT_API_KEY, ENTITLEMENT_ID } from '../src/constants/iap';
import { colors } from '../src/theme';

function AppContent() {
  const setIsPremium = useDeviceStore((s) => s.setIsPremium);

  useEffect(() => {
    async function initRevenueCat() {
      if (__DEV__) {
        Purchases.setLogLevel(Purchases.LOG_LEVEL.DEBUG);
      }

      Purchases.configure({
        apiKey: REVENUECAT_API_KEY!,
        appUserID: null,
      });

      try {
        const customerInfo = await Purchases.getCustomerInfo();
        const hasEntitlement =
          customerInfo.entitlements.active[ENTITLEMENT_ID] !== undefined;
        if (hasEntitlement) {
          setIsPremium(true);
        }
      } catch (err) {
        console.warn('RevenueCat initial sync failed:', err);
      }
    }

    if (Platform.OS !== 'web') {
      initRevenueCat();
    }
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
