import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  Image,
  SafeAreaView,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { colors, typography, spacing, layout } from '../src/theme';
import { URLInput } from '../src/components/URLInput';
import { ProcessButton } from '../src/components/ProcessButton';
import { ErrorBanner } from '../src/components/ErrorBanner';
import { isValidYoutubeUrl } from '../src/utils/youtubeValidation';
import { submitExtraction } from '../src/api/extract';
import { useExtractionStore } from '../src/store/extractionStore';
import { useShareIntent } from '../src/hooks/useShareIntent';

export default function HomeScreen() {
  const [url, setUrl] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { setJob } = useExtractionStore();
  const { sharedUrl, clearSharedUrl } = useShareIntent();

  // Auto-populate from share intent
  useEffect(() => {
    if (sharedUrl) {
      setUrl(sharedUrl);
      clearSharedUrl();
    }
  }, [sharedUrl]);

  const isValid = url.trim().length > 0 && isValidYoutubeUrl(url);

  const handleProcess = async () => {
    setError(null);

    if (!url.trim()) {
      setError("Please paste a YouTube link.");
      return;
    }

    if (!isValidYoutubeUrl(url)) {
      setError(
        "This doesn't look like a YouTube link. Please check and try again.",
      );
      return;
    }

    setLoading(true);
    console.log('[DEBUG] handleProcess called, URL:', url.trim());
    console.log('[DEBUG] API_BASE_URL:', process.env.EXPO_PUBLIC_BACKEND_URL);
    try {
      const result = await submitExtraction(url.trim());
      console.log('[DEBUG] submitExtraction result:', result);
      setJob(result.job_id, url.trim());
      router.push({
        pathname: '/progress',
        params: { jobId: result.job_id, url: url.trim() },
      });
    } catch (err) {
      console.error('[DEBUG] submitExtraction failed:', err);
      setError(
        "We couldn't start processing this video. Please check the link and try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.safe}>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        {/* App bar */}
        <View style={styles.appBar}>
          <Text style={styles.appTitle}>FoodProcessor</Text>
          <View style={styles.appBarActions}>
            <TouchableOpacity
              onPress={() => router.push('/gallery')}
              style={styles.appBarButton}
            >
              <Ionicons name="book-outline" size={24} color={colors.textPrimary} />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => router.push('/settings')}>
              <Text style={styles.gearIcon}>⚙️</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Content */}
        <View style={styles.content}>
          {error && <ErrorBanner message={error} />}

          <Image
            source={require('../assets/images/hero.png')}
            style={styles.heroImage}
            resizeMode="contain"
          />

          <Text style={styles.title}>
            Turn any cooking video into a shopping list
          </Text>
          <Text style={styles.subtitle}>
            Paste a YouTube link or share directly from the YouTube app.
          </Text>

          <View style={styles.inputContainer}>
            <URLInput value={url} onChangeText={setUrl} />
          </View>

          <ProcessButton
            onPress={handleProcess}
            disabled={!isValid}
            loading={loading}
          />

          <Text style={styles.hint}>
            Tip: In YouTube, tap Share → FoodProcessor to send a video directly.
          </Text>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: colors.background,
  },
  flex: {
    flex: 1,
  },
  appBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: layout.pagePadding,
    paddingVertical: spacing.md,
    backgroundColor: colors.surface,
  },
  appTitle: {
    ...typography.h2,
    color: colors.textPrimary,
  },
  appBarActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.lg,
  },
  appBarButton: {
    padding: spacing.xs,
  },
  gearIcon: {
    fontSize: 24,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: layout.pagePadding,
  },
  heroImage: {
    width: 180,
    height: 180,
    alignSelf: 'center',
    marginBottom: spacing.lg,
  },
  title: {
    ...typography.h1,
    color: colors.textPrimary,
    textAlign: 'center',
    marginBottom: spacing.sm,
  },
  subtitle: {
    ...typography.body,
    color: colors.textSecondary,
    textAlign: 'center',
    marginBottom: spacing.xl,
  },
  inputContainer: {
    marginBottom: spacing.lg,
  },
  hint: {
    ...typography.small,
    color: colors.textSecondary,
    textAlign: 'center',
    marginTop: spacing.xl,
  },
});
