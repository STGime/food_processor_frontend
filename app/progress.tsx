import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { colors, typography, spacing, layout } from '../src/theme';
import { ProgressIndicator } from '../src/components/ProgressIndicator';
import { usePollJobStatus } from '../src/hooks/usePollJobStatus';
import { useExtractionStore } from '../src/store/extractionStore';

export default function ProgressScreen() {
  const router = useRouter();
  const { jobId } = useLocalSearchParams<{ jobId: string; url: string }>();
  const { error } = useExtractionStore();

  const { stopPolling } = usePollJobStatus({
    jobId: jobId || null,
    onCompleted: () => {
      router.replace({
        pathname: '/results',
        params: { jobId },
      });
    },
  });

  const handleBack = () => {
    Alert.alert(
      'Stop processing?',
      'If you go back, the current extraction will be abandoned.',
      [
        { text: 'Keep waiting', style: 'cancel' },
        {
          text: 'Go back',
          style: 'destructive',
          onPress: () => {
            stopPolling();
            router.back();
          },
        },
      ],
    );
  };

  if (error) {
    return (
      <View style={styles.container}>
        <View style={styles.errorContainer}>
          <Text style={styles.errorEmoji}>😕</Text>
          <Text style={styles.errorTitle}>Something went wrong</Text>
          <Text style={styles.errorBody}>
            We couldn't finish processing this video. Please try again or choose
            another video.
          </Text>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => {
              stopPolling();
              router.back();
            }}
          >
            <Text style={styles.backButtonText}>Back to Home</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ProgressIndicator />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.background,
    paddingHorizontal: layout.pagePadding,
  },
  errorContainer: {
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
  },
  errorEmoji: {
    fontSize: 64,
    marginBottom: spacing.xl,
  },
  errorTitle: {
    ...typography.h1,
    color: colors.textPrimary,
    textAlign: 'center',
    marginBottom: spacing.md,
  },
  errorBody: {
    ...typography.body,
    color: colors.textSecondary,
    textAlign: 'center',
    marginBottom: spacing.xl,
    lineHeight: 22,
  },
  backButton: {
    backgroundColor: colors.primary,
    height: layout.buttonHeight,
    borderRadius: layout.buttonRadius,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.xxl,
  },
  backButtonText: {
    ...typography.button,
    color: colors.white,
  },
});
