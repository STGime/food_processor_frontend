import { useEffect } from 'react';
import { Platform } from 'react-native';
import Purchases from 'react-native-purchases';
import { useDeviceStore } from '../store/deviceStore';
import { registerDevice, getDeviceMe } from '../api/devices';
import { apiClient } from '../api/client';
import { ApiError } from '../api/types';
import { ENTITLEMENT_ID } from '../constants/iap';

async function checkRevenueCatEntitlement(): Promise<boolean> {
  if (Platform.OS === 'web') return false;
  try {
    const customerInfo = await Purchases.getCustomerInfo();
    return customerInfo.entitlements.active[ENTITLEMENT_ID] !== undefined;
  } catch {
    return false;
  }
}

export function useDeviceRegistration() {
  const { deviceId, isRegistered, setIsRegistered, setIsPremium } =
    useDeviceStore();

  useEffect(() => {
    /**
     * Resolve premium status from backend + RevenueCat.
     * Premium if EITHER source says so.
     */
    function resolvePremium(backendPremium: boolean, rcEntitled: boolean) {
      setIsPremium(backendPremium || rcEntitled);
    }

    async function forceReRegister(id: string) {
      await apiClient.clearApiKey();
      const response = await registerDevice(id);
      const rcEntitled = await checkRevenueCatEntitlement();
      resolvePremium(response.is_premium, rcEntitled);
      setIsRegistered(true);
    }

    async function register() {
      // Wait for device_id to be set (generated in _layout.tsx)
      if (!deviceId) return;

      try {
        if (isRegistered) {
          // Already registered, refresh premium status
          try {
            const me = await getDeviceMe();
            const rcEntitled = await checkRevenueCatEntitlement();
            resolvePremium(me.is_premium, rcEntitled);
            return;
          } catch (error) {
            if (error instanceof ApiError && error.statusCode === 401) {
              // Stale API key — clear and re-register
              await forceReRegister(deviceId);
              return;
            }
            throw error;
          }
        }

        const response = await registerDevice(deviceId);
        const rcEntitled = await checkRevenueCatEntitlement();
        resolvePremium(response.is_premium, rcEntitled);
        setIsRegistered(true);
      } catch (error) {
        // Silently fail on registration - will retry next launch
        console.warn('Device registration failed:', error);
      }
    }

    register();
  }, [deviceId]);
}
