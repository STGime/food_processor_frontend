import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface DeviceState {
  deviceId: string | null;
  isPremium: boolean;
  isRegistered: boolean;
  setDeviceId: (id: string) => void;
  setIsPremium: (premium: boolean) => void;
  setIsRegistered: (registered: boolean) => void;
}

export const useDeviceStore = create<DeviceState>()(
  persist(
    (set) => ({
      deviceId: null,
      isPremium: false,
      isRegistered: false,
      setDeviceId: (id) => set({ deviceId: id }),
      setIsPremium: (premium) => set({ isPremium: premium }),
      setIsRegistered: (registered) => set({ isRegistered: registered }),
    }),
    {
      name: 'device-store',
      storage: createJSONStorage(() => AsyncStorage),
    },
  ),
);
