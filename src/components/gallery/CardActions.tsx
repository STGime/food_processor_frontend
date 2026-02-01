import React from 'react';
import { View, TouchableOpacity, Text, Alert, Share, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, typography, spacing } from '../../theme';
import { GalleryCard } from '../../api/types';
import { copyToClipboard } from '../../utils/clipboard';
import * as Haptics from 'expo-haptics';

interface CardActionsProps {
  card: GalleryCard;
  onDelete: () => void;
}

function formatRecipeText(card: GalleryCard): string {
  let text = `${card.recipe_name}\n\n`;
  text += 'Ingredients:\n';
  for (const ing of card.ingredients) {
    const qty = ing.quantity && ing.unit ? `${ing.quantity} ${ing.unit} ` : '';
    text += `  - ${qty}${ing.name}\n`;
  }
  if (card.is_truncated) {
    text += `\n  ... and ${card.total_ingredient_count - card.shown_ingredient_count} more (upgrade to see all)\n`;
  }
  return text.trim();
}

export function CardActions({ card, onDelete }: CardActionsProps) {
  const handleCopy = async () => {
    await copyToClipboard(formatRecipeText(card));
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
  };

  const handleShare = async () => {
    try {
      await Share.share({ message: formatRecipeText(card) });
    } catch {
      // user cancelled
    }
  };

  const handleDelete = () => {
    Alert.alert(
      'Delete Recipe',
      `Remove "${card.recipe_name}" from your gallery?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
            onDelete();
          },
        },
      ],
    );
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.action} onPress={handleCopy} activeOpacity={0.7}>
        <Ionicons name="copy-outline" size={20} color={colors.textSecondary} />
        <Text style={styles.label}>Copy</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.action} onPress={handleShare} activeOpacity={0.7}>
        <Ionicons name="share-outline" size={20} color={colors.textSecondary} />
        <Text style={styles.label}>Share</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.action} onPress={handleDelete} activeOpacity={0.7}>
        <Ionicons name="trash-outline" size={20} color={colors.error} />
        <Text style={[styles.label, styles.deleteLabel]}>Delete</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingVertical: spacing.md,
    borderTopWidth: 1,
    borderTopColor: colors.divider,
  },
  action: {
    alignItems: 'center',
    gap: 2,
  },
  label: {
    ...typography.small,
    color: colors.textSecondary,
  },
  deleteLabel: {
    color: colors.error,
  },
});
