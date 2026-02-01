import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { ShareIntentProvider } from 'expo-share-intent';
import { useDeviceRegistration } from '../src/hooks/useDeviceRegistration';
import { ConsentModal } from '../src/components/ConsentModal';
import { colors } from '../src/theme';

function AppContent() {
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
