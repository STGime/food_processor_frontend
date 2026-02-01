import { useEffect, useState, useCallback } from 'react';
import { Platform } from 'react-native';
import {
  initConnection,
  endConnection,
  fetchProducts,
  requestPurchase,
  getAvailablePurchases,
  purchaseUpdatedListener,
  purchaseErrorListener,
  finishTransaction,
  ErrorCode,
  type Product,
  type PurchaseError,
  type Purchase,
} from 'react-native-iap';
import { IAP_PRODUCT_IDS } from '../constants/iap';
import { useDeviceStore } from '../store/deviceStore';

export function useIAP() {
  const [products, setProducts] = useState<Product[]>([]);
  const [purchasing, setPurchasing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const setIsPremium = useDeviceStore((s) => s.setIsPremium);

  useEffect(() => {
    let purchaseUpdateSubscription: { remove: () => void } | null = null;
    let purchaseErrorSubscription: { remove: () => void } | null = null;

    async function init() {
      try {
        await initConnection();

        const availableProducts = await fetchProducts({
          skus: IAP_PRODUCT_IDS,
        });
        if (availableProducts) {
          setProducts(availableProducts as Product[]);
        }

        purchaseUpdateSubscription = purchaseUpdatedListener(
          async (purchase: Purchase) => {
            await finishTransaction({ purchase });
            setIsPremium(true);
            setPurchasing(false);
            setError(null);
          },
        );

        purchaseErrorSubscription = purchaseErrorListener(
          (err: PurchaseError) => {
            if (err.code !== ErrorCode.UserCancelled) {
              setError(err.message || 'Purchase failed');
            }
            setPurchasing(false);
          },
        );
      } catch (err) {
        console.warn('IAP init failed:', err);
      }
    }

    init();

    return () => {
      purchaseUpdateSubscription?.remove();
      purchaseErrorSubscription?.remove();
      endConnection();
    };
  }, []);

  const purchase = useCallback(async () => {
    if (!IAP_PRODUCT_IDS[0]) return;

    setPurchasing(true);
    setError(null);

    try {
      await requestPurchase({
        request:
          Platform.OS === 'ios'
            ? { apple: { sku: IAP_PRODUCT_IDS[0] } }
            : { google: { skus: [IAP_PRODUCT_IDS[0]] } },
        type: 'in-app',
      });
    } catch (err) {
      setPurchasing(false);
      if (err instanceof Error && err.message !== 'user-cancelled') {
        setError(err.message);
      }
    }
  }, []);

  const restore = useCallback(async () => {
    try {
      const purchases = await getAvailablePurchases();
      if (purchases.length > 0) {
        setIsPremium(true);
        return true;
      }
      return false;
    } catch (err) {
      console.warn('Restore failed:', err);
      return false;
    }
  }, []);

  const displayPrice = products[0]?.displayPrice || null;

  return {
    products,
    localizedPrice: displayPrice,
    purchasing,
    error,
    purchase,
    restore,
  };
}
