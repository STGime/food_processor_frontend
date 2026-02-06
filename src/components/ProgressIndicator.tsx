import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  Image,
  ActivityIndicator,
  StyleSheet,
  Dimensions,
  ImageSourcePropType,
} from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  Easing,
} from 'react-native-reanimated';
import { colors, typography, spacing } from '../theme';
import { progressMessages } from '../constants/progressMessages';
import { useExtractionStore } from '../store/extractionStore';

const MESSAGE_ROTATE_INTERVAL = 3000;
const SCREEN_WIDTH = Dimensions.get('window').width;
const ICON_SIZE = 48;
const ICON_GAP = 32;

const marqueeImages: ImageSourcePropType[] = [
  require('../../assets/images/progress/chef-hat.png'),
  require('../../assets/images/progress/cooking-pot.png'),
  require('../../assets/images/progress/whisk.png'),
  require('../../assets/images/progress/cutting-board.png'),
  require('../../assets/images/progress/timer.png'),
  require('../../assets/images/progress/spoon.png'),
];

// Duplicate the set so the strip is long enough for seamless looping
const images = [...marqueeImages, ...marqueeImages];
const STRIP_WIDTH = images.length * (ICON_SIZE + ICON_GAP);
const HALF_STRIP = STRIP_WIDTH / 2;

function Marquee() {
  const translateX = useSharedValue(0);

  useEffect(() => {
    translateX.value = withRepeat(
      withTiming(-HALF_STRIP, {
        duration: 12000,
        easing: Easing.linear,
      }),
      -1,
      false,
    );
  }, []);

  const animStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }],
  }));

  return (
    <View style={styles.marqueeContainer}>
      <Animated.View style={[styles.marqueeStrip, animStyle]}>
        {images.map((src, i) => (
          <Image key={i} source={src} style={styles.marqueeIcon} />
        ))}
      </Animated.View>
    </View>
  );
}

export function ProgressIndicator() {
  const [messageIndex, setMessageIndex] = useState(0);
  const { statusMessage, progress } = useExtractionStore();

  useEffect(() => {
    // Only rotate fallback messages if there's no backend status message
    if (statusMessage) return;

    const interval = setInterval(() => {
      setMessageIndex((prev) => (prev + 1) % progressMessages.length);
    }, MESSAGE_ROTATE_INTERVAL);

    return () => clearInterval(interval);
  }, [statusMessage]);

  const displayMessage = statusMessage || progressMessages[messageIndex];
  const progressPercent = Math.round(progress * 100);

  return (
    <View style={styles.container}>
      <Text style={styles.emoji}>🍳</Text>
      <Marquee />
      {progress > 0 && (
        <View style={styles.progressBarContainer}>
          <View style={[styles.progressBar, { width: `${progressPercent}%` }]} />
        </View>
      )}
      <ActivityIndicator
        size="large"
        color={colors.primary}
        style={styles.spinner}
      />
      <Text style={styles.message}>{displayMessage}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.xxl,
  },
  emoji: {
    fontSize: 64,
    marginBottom: spacing.xl,
  },
  marqueeContainer: {
    width: SCREEN_WIDTH,
    height: ICON_SIZE,
    overflow: 'hidden',
    marginBottom: spacing.xl,
  },
  marqueeStrip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: ICON_GAP,
  },
  marqueeIcon: {
    width: ICON_SIZE,
    height: ICON_SIZE,
    borderRadius: 12,
    opacity: 0.7,
  },
  spinner: {
    marginBottom: spacing.lg,
  },
  message: {
    ...typography.body,
    color: colors.textSecondary,
    textAlign: 'center',
  },
  progressBarContainer: {
    width: '80%',
    height: 4,
    backgroundColor: colors.divider,
    borderRadius: 2,
    marginBottom: spacing.lg,
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    backgroundColor: colors.primary,
    borderRadius: 2,
  },
});
