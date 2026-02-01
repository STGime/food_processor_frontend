import { Platform } from 'react-native';

export const PREMIUM_PRODUCT_ID = Platform.select({
  ios: 'com.foodprocessor.premium',
  android: 'premium_unlock',
  default: 'premium_unlock',
});

export const IAP_PRODUCT_IDS = PREMIUM_PRODUCT_ID ? [PREMIUM_PRODUCT_ID] : [];
