import React from 'react';
import {
  View,
  TextInput,
  TouchableOpacity,
  Text,
  StyleSheet,
} from 'react-native';
import { colors, typography, spacing, layout } from '../theme';
import { readFromClipboard } from '../utils/clipboard';

interface URLInputProps {
  value: string;
  onChangeText: (text: string) => void;
}

export function URLInput({ value, onChangeText }: URLInputProps) {
  const handlePaste = async () => {
    const text = await readFromClipboard();
    if (text) {
      onChangeText(text.trim());
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.linkIcon}>🔗</Text>
      <TextInput
        style={styles.input}
        placeholder="Paste YouTube link here..."
        placeholderTextColor={colors.textSecondary}
        value={value}
        onChangeText={onChangeText}
        onEndEditing={(e) => onChangeText(e.nativeEvent.text)}
        autoCapitalize="none"
        autoCorrect={false}
        keyboardType="url"
        returnKeyType="done"
      />
      <TouchableOpacity style={styles.pasteButton} onPress={handlePaste}>
        <Text style={styles.pasteText}>Paste</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: layout.cardRadius,
    borderWidth: 1,
    borderColor: colors.divider,
    paddingHorizontal: spacing.md,
    height: layout.buttonHeight,
    ...layout.cardShadow,
  },
  linkIcon: {
    fontSize: 18,
    marginRight: spacing.sm,
  },
  input: {
    flex: 1,
    ...typography.body,
    color: colors.textPrimary,
    paddingVertical: 0,
  },
  pasteButton: {
    backgroundColor: colors.background,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs + 2,
    borderRadius: spacing.sm,
    marginLeft: spacing.sm,
  },
  pasteText: {
    ...typography.small,
    color: colors.primary,
    fontWeight: '600',
  },
});
