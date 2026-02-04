import { useEffect, useState, useCallback, useRef } from 'react';
import Purchases, {
  PACKAGE_TYPE,
  type PurchasesPackage,
  type CustomerInfo,
} from 'react-native-purchases';
import { ENTITLEMENT_ID } from '../constants/iap';
import { useDeviceStore } from '../store/deviceStore';

export type PlanType = 'monthly' | 'yearly';

export function useIAP() {
  const [monthlyPackage, setMonthlyPackage] = useState<PurchasesPackage | null>(null);
  const [yearlyPackage, setYearlyPackage] = useState<PurchasesPackage | null>(null);
  const [purchasing, setPurchasing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const setIsPremium = useDeviceStore((s) => s.setIsPremium);

  const syncPremiumStatus = useCallback(
    (info: CustomerInfo) => {
      const hasEntitlement =
        info.entitlements.active[ENTITLEMENT_ID] !== undefined;
      setIsPremium(hasEntitlement);
    },
    [setIsPremium],
  );

  const listenerRef = useRef(syncPremiumStatus);
  listenerRef.current = syncPremiumStatus;

  useEffect(() => {
    async function fetchOfferings() {
      try {
        const offerings = await Purchases.getOfferings();
        const current = offerings.current;
        if (current) {
          const monthly = current.availablePackages.find(
            (p) => p.packageType === PACKAGE_TYPE.MONTHLY,
          );
          const annual = current.availablePackages.find(
            (p) => p.packageType === PACKAGE_TYPE.ANNUAL,
          );
          if (monthly) setMonthlyPackage(monthly);
          if (annual) setYearlyPackage(annual);
        }
      } catch (err) {
        console.warn('Failed to fetch offerings:', err);
      }
    }

    fetchOfferings();

    const handler = (info: CustomerInfo) => listenerRef.current(info);
    Purchases.addCustomerInfoUpdateListener(handler);
    return () => {
      Purchases.removeCustomerInfoUpdateListener(handler);
    };
  }, []);

  const purchase = useCallback(
    async (plan: PlanType) => {
      const pkg = plan === 'monthly' ? monthlyPackage : yearlyPackage;
      if (!pkg) return;

      setPurchasing(true);
      setError(null);

      try {
        const { customerInfo } = await Purchases.purchasePackage(pkg);
        syncPremiumStatus(customerInfo);
      } catch (err: any) {
        if (!err.userCancelled) {
          setError(err.message || 'Purchase failed');
        }
      } finally {
        setPurchasing(false);
      }
    },
    [monthlyPackage, yearlyPackage, syncPremiumStatus],
  );

  const restore = useCallback(async () => {
    try {
      const customerInfo = await Purchases.restorePurchases();
      const hasEntitlement =
        customerInfo.entitlements.active[ENTITLEMENT_ID] !== undefined;
      setIsPremium(hasEntitlement);
      return hasEntitlement;
    } catch (err) {
      console.warn('Restore failed:', err);
      return false;
    }
  }, [setIsPremium]);

  return {
    monthlyPackage,
    yearlyPackage,
    purchasing,
    error,
    purchase,
    restore,
  };
}
