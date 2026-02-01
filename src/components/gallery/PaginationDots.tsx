import React from 'react';
import { View, StyleSheet } from 'react-native';
import Animated, {
  useAnimatedStyle,
  withSpring,
} from 'react-native-reanimated';
import { colors, spacing } from '../../theme';

const MAX_VISIBLE = 7;
const DOT_SIZE = 8;
const DOT_SPACING = 8;

interface PaginationDotsProps {
  total: number;
  activeIndex: number;
}

function Dot({ isActive }: { isActive: boolean }) {
  const animStyle = useAnimatedStyle(() => ({
    transform: [{ scale: withSpring(isActive ? 1.3 : 1, { damping: 15, stiffness: 150 }) }],
    backgroundColor: withSpring(isActive ? colors.primary : colors.divider, { damping: 15 }),
    opacity: withSpring(isActive ? 1 : 0.5, { damping: 15 }),
  }));

  return <Animated.View style={[styles.dot, animStyle]} />;
}

export function PaginationDots({ total, activeIndex }: PaginationDotsProps) {
  if (total <= 1) return null;

  // Sliding window to show max MAX_VISIBLE dots
  let startIdx = 0;
  const visibleCount = Math.min(total, MAX_VISIBLE);
  if (total > MAX_VISIBLE) {
    const half = Math.floor(MAX_VISIBLE / 2);
    startIdx = Math.min(
      Math.max(activeIndex - half, 0),
      total - MAX_VISIBLE,
    );
  }

  const dots = Array.from({ length: visibleCount }, (_, i) => startIdx + i);

  return (
    <View style={styles.container}>
      {dots.map((idx) => (
        <Dot key={idx} isActive={idx === activeIndex} />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: DOT_SPACING,
    paddingVertical: spacing.md,
  },
  dot: {
    width: DOT_SIZE,
    height: DOT_SIZE,
    borderRadius: DOT_SIZE / 2,
    backgroundColor: colors.divider,
  },
});
