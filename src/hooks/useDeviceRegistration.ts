import { useEffect } from 'react';
import uuid from 'react-native-uuid';
import { useDeviceStore } from '../store/deviceStore';
import { registerDevice, getDeviceMe } from '../api/devices';
import { apiClient } from '../api/client';
import { ApiError } from '../api/types';

export function useDeviceRegistration() {
  const { deviceId, isRegistered, setDeviceId, setIsRegistered, setIsPremium } =
    useDeviceStore();

  useEffect(() => {
    async function forceReRegister(id: string) {
      await apiClient.clearApiKey();
      const response = await registerDevice(id);
      setIsPremium(response.is_premium);
      setIsRegistered(true);
    }

    async function register() {
      try {
        if (isRegistered && deviceId) {
          // Already registered, refresh premium status
          try {
            const me = await getDeviceMe();
            setIsPremium(me.is_premium);
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

        const id = deviceId || (uuid.v4() as string);
        if (!deviceId) {
          setDeviceId(id);
        }

        const response = await registerDevice(id);
        setIsPremium(response.is_premium);
        setIsRegistered(true);
      } catch (error) {
        // Silently fail on registration - will retry next launch
        console.warn('Device registration failed:', error);
      }
    }

    register();
  }, []);
}
