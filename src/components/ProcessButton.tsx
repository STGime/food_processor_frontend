import React from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import { colors, typography, layout } from '../theme';

interface ProcessButtonProps {
  onPress: () => void;
  disabled?: boolean;
  loading?: boolean;
}

export function ProcessButton({
  onPress,
  disabled = false,
  loading = false,
}: ProcessButtonProps) {
  return (
    <TouchableOpacity
      style={[styles.button, disabled && styles.disabled]}
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.8}
    >
      {loading ? (
        <ActivityIndicator color={colors.white} />
      ) : (
        <Text style={[styles.text, disabled && styles.disabledText]}>
          Process Video
        </Text>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    backgroundColor: colors.primary,
    height: layout.buttonHeight,
    borderRadius: layout.buttonRadius,
    alignItems: 'center',
    justifyContent: 'center',
  },
  disabled: {
    backgroundColor: colors.disabledBg,
    opacity: 0.6,
  },
  text: {
    ...typography.button,
    color: colors.white,
  },
  disabledText: {
    color: colors.disabled,
  },
});
