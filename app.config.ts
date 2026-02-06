import { ExpoConfig, ConfigContext } from 'expo/config';

export default ({ config }: ConfigContext): ExpoConfig => ({
  ...config,
  name: 'FoodProcessor',
  slug: 'food-processor',
  version: '1.1.1',
  orientation: 'portrait',
  icon: './assets/images/icon.png',
  scheme: 'foodprocessor',
  userInterfaceStyle: 'light',
  newArchEnabled: true,
  ios: {
    supportsTablet: false,
    bundleIdentifier: 'com.foodprocessor.app',
  },
  android: {
    adaptiveIcon: {
      backgroundColor: '#FFFFFF',
      foregroundImage: './assets/images/icon.png',
      monochromeImage: './assets/images/android-icon-monochrome.png',
    },
    package: 'com.foodprocessor.app',
    edgeToEdgeEnabled: true,
  },
  web: {
    output: 'static' as const,
    favicon: './assets/images/favicon.png',
  },
  plugins: [
    'expo-router',
    [
      'expo-splash-screen',
      {
        image: './assets/images/splash-icon.png',
        imageWidth: 200,
        resizeMode: 'contain',
        backgroundColor: '#F9FAFB',
      },
    ],
    'expo-secure-store',
    'expo-web-browser',
    [
      'expo-build-properties',
      {
        android: {
          kotlinVersion: '2.2.0',
        },
      },
    ],
    [
      'expo-share-intent',
      {
        iosActivationRules: {
          NSExtensionActivationSupportsWebURLWithMaxCount: 1,
          NSExtensionActivationSupportsText: true,
        },
        androidIntentFilters: ['text/*'],
      },
    ],
  ],
  experiments: {
    typedRoutes: true,
  },
  extra: {
    eas: {
      projectId: '78234b64-dea8-402c-9f1d-d5679e9bbea5',
    },
  },
});
