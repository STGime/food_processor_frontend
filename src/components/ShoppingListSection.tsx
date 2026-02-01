import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Share } from 'react-native';
import { colors, typography, spacing, layout } from '../theme';
import { ShoppingListGroup } from '../api/types';
import { copyToClipboard } from '../utils/clipboard';
import { useExtractionStore } from '../store/extractionStore';

/** Convert snake_case or slug IDs into readable names: "vegetable_oil" -> "Vegetable Oil" */
function formatName(raw: string): string {
  return raw
    .replace(/[_-]/g, ' ')
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

interface ShoppingListSectionProps {
  shoppingList: ShoppingListGroup;
  isTruncated: boolean;
  recipeName?: string;
}

export function ShoppingListSection({
  shoppingList,
  isTruncated,
  recipeName,
}: ShoppingListSectionProps) {
  const { isItemChecked, toggleCheckedItem } = useExtractionStore();
  const categories = Object.keys(shoppingList);
  const title = recipeName || 'Shopping List';

  const buildTextList = (): string => {
    let text = `${title}\n\n`;
    for (const category of categories) {
      const selected = shoppingList[category].filter((item) => isItemChecked(item));
      if (selected.length === 0) continue;
      text += `${formatName(category)}:\n`;
      for (const item of selected) {
        text += `  • ${formatName(item)}\n`;
      }
      text += '\n';
    }
    return text.trim();
  };

  const handleCopy = async () => {
    await copyToClipboard(buildTextList());
  };

  const handleShare = async () => {
    try {
      await Share.share({ message: buildTextList() });
    } catch {
      // user cancelled
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.sectionHeadline}>Shopping List</Text>
      <View style={styles.header}>
        {recipeName ? <Text style={styles.title}>{recipeName}</Text> : null}
        <View style={styles.actions}>
          <TouchableOpacity style={styles.actionButton} onPress={handleCopy}>
            <Text style={styles.actionText}>Copy</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionButton} onPress={handleShare}>
            <Text style={styles.actionText}>Share</Text>
          </TouchableOpacity>
        </View>
      </View>

      {categories.map((category) => (
        <View key={category} style={styles.categoryGroup}>
          <Text style={styles.categoryHeader}>{formatName(category).toUpperCase()}</Text>
          {shoppingList[category].map((item) => {
            const isChecked = isItemChecked(item);
            return (
              <TouchableOpacity
                key={item}
                style={styles.listItem}
                onPress={() => toggleCheckedItem(item)}
              >
                <View
                  style={[
                    styles.checkCircle,
                    isChecked && styles.checkCircleChecked,
                  ]}
                >
                  {isChecked && <Text style={styles.checkMark}>✓</Text>}
                </View>
                <Text
                  style={[styles.itemText, isChecked && styles.itemTextChecked]}
                >
                  {formatName(item)}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      ))}

      {isTruncated && (
        <Text style={styles.truncatedNote}>
          Some ingredients are hidden in the free version. Upgrade to ensure you
          don't miss anything.
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: spacing.xl,
    paddingHorizontal: spacing.lg,
  },
  sectionHeadline: {
    ...typography.h2,
    color: colors.textPrimary,
    marginBottom: spacing.md,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  title: {
    ...typography.h2,
    color: colors.textPrimary,
    flex: 1,
    marginRight: spacing.sm,
  },
  actions: {
    flexDirection: 'row',
    flexShrink: 0,
    gap: spacing.sm,
  },
  actionButton: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs + 2,
    borderRadius: spacing.sm,
    backgroundColor: colors.background,
    borderWidth: 1,
    borderColor: colors.divider,
  },
  actionText: {
    ...typography.small,
    color: colors.primary,
    fontWeight: '600',
  },
  categoryGroup: {
    marginBottom: spacing.lg,
  },
  categoryHeader: {
    ...typography.small,
    color: colors.textSecondary,
    letterSpacing: 1,
    marginBottom: spacing.sm,
  },
  listItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: colors.divider,
  },
  checkCircle: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2,
    borderColor: colors.divider,
    marginRight: spacing.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkCircleChecked: {
    borderColor: colors.primary,
    backgroundColor: colors.primary,
  },
  checkMark: {
    color: colors.white,
    fontSize: 12,
    fontWeight: '700',
  },
  itemText: {
    ...typography.body,
    color: colors.textPrimary,
  },
  itemTextChecked: {
    textDecorationLine: 'line-through',
    color: colors.textSecondary,
  },
  truncatedNote: {
    ...typography.small,
    color: colors.textSecondary,
    fontStyle: 'italic',
    textAlign: 'center',
    marginTop: spacing.lg,
    paddingHorizontal: spacing.lg,
  },
});
