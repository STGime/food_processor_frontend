import { useShareIntentContext } from 'expo-share-intent';
import { useEffect, useState } from 'react';
import { isValidYoutubeUrl } from '../utils/youtubeValidation';

export function useShareIntent() {
  const { hasShareIntent, shareIntent, resetShareIntent } =
    useShareIntentContext();
  const [sharedUrl, setSharedUrl] = useState<string | null>(null);

  useEffect(() => {
    if (hasShareIntent && shareIntent) {
      // expo-share-intent provides text or webUrl
      const url = shareIntent.webUrl || shareIntent.text || '';
      if (url && isValidYoutubeUrl(url)) {
        setSharedUrl(url);
      }
      resetShareIntent();
    }
  }, [hasShareIntent, shareIntent]);

  const clearSharedUrl = () => setSharedUrl(null);

  return { sharedUrl, clearSharedUrl };
}
