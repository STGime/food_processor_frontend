import React, { useEffect, useState, useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import { colors, typography, spacing, layout } from '../theme';
import { getSwapSuggestions } from '../api/swaps';
import { SwapSuggestion } from '../api/types';

const DIETARY_FILTERS = [
  'Vegan',
  'Vegetarian',
  'Gluten-Free',
  'Dairy-Free',
  'Nut-Free',
  'Keto',
] as const;

interface IngredientSwapModalProps {
  visible: boolean;
  onClose: () => void;
  ingredientName: string;
  quantity?: string;
  unit?: string;
  recipeName?: string;
  isPremium: boolean;
  onUpgrade: () => void;
}

export function IngredientSwapModal({
  visible,
  onClose,
  ingredientName,
  quantity,
  unit,
  recipeName,
  isPremium,
  onUpgrade,
}: IngredientSwapModalProps) {
  const [suggestions, setSuggestions] = useState<SwapSuggestion[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedFilters, setSelectedFilters] = useState<string[]>([]);
  const requestId = useRef(0);

  // Reset state when modal closes
  useEffect(() => {
    if (!visible) {
      setSuggestions([]);
      setError(null);
      setSelectedFilters([]);
      setLoading(false);
      requestId.current++;
    }
  }, [visible]);

  // Fetch suggestions when modal is open and filters change
  useEffect(() => {
    if (!visible) return;

    const currentRequest = ++requestId.current;
    setLoading(true);
    setError(null);

    async function fetchSuggestions() {
      try {
        const data = await getSwapSuggestions(ingredientName, {
          quantity: quantity ? parseFloat(quantity) : undefined,
          unit: unit || undefined,
          recipe_context: recipeName || undefined,
          dietary_filters: selectedFilters.length > 0 ? selectedFilters : undefined,
        });

        if (currentRequest !== requestId.current) return;
        setSuggestions(data.suggestions);
      } catch (err) {
        if (currentRequest !== requestId.current) return;
        const message =
          err instanceof Error ? err.message : 'Failed to load suggestions';
        const isNetworkError =
          message.toLowerCase().includes('network request failed') ||
          message.toLowerCase().includes('failed to fetch');
        setError(
          isNetworkError
            ? 'Could not reach the server. Check your connection and try again.'
            : message,
        );
      } finally {
        if (currentRequest === requestId.current) {
          setLoading(false);
        }
      }
    }

    fetchSuggestions();
  }, [visible, ingredientName, quantity, unit, recipeName, selectedFilters]);

  const toggleFilter = (filter: string) => {
    setSelectedFilters((prev) =>
      prev.includes(filter)
        ? prev.filter((f) => f !== filter)
        : [...prev, filter],
    );
  };

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 0.8) return colors.primary;
    if (confidence >= 0.6) return colors.accent;
    return colors.disabled;
  };

  const getConfidenceLabel = (confidence: number) => {
    if (confidence >= 0.8) return 'Great match';
    if (confidence >= 0.6) return 'Good match';
    return 'Fair match';
  };

  const formatRatio = (ratio: number, note: string | null) => {
    if (note) return note;
    if (ratio === 1) return 'Same amount';
    return `Use ${ratio}x the amount`;
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      <View style={styles.container}>
        <TouchableOpacity style={styles.closeButton} onPress={onClose}>
          <Text style={styles.closeText}>✕</Text>
        </TouchableOpacity>

        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Swap {ingredientName}</Text>
          {quantity && (
            <Text style={styles.subtitle}>
              {quantity}{unit ? ` ${unit}` : ''}
            </Text>
          )}
          {recipeName && (
            <Text style={styles.recipeContext}>in {recipeName}</Text>
          )}
        </View>

        {/* Dietary filter chips */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.filtersContainer}
          contentContainerStyle={styles.filtersContent}
        >
          {DIETARY_FILTERS.map((filter) => {
            const isSelected = selectedFilters.includes(filter);
            return (
              <TouchableOpacity
                key={filter}
                style={[styles.filterChip, isSelected && styles.filterChipSelected]}
                onPress={() => toggleFilter(filter)}
                activeOpacity={0.7}
              >
                <Text
                  style={[
                    styles.filterChipText,
                    isSelected && styles.filterChipTextSelected,
                  ]}
                >
                  {filter}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>

        {/* Content area */}
        <ScrollView
          style={styles.suggestionsContainer}
          contentContainerStyle={styles.suggestionsContent}
          showsVerticalScrollIndicator={false}
        >
          {loading && (
            <View style={styles.centerState}>
              <ActivityIndicator size="large" color={colors.primary} />
            </View>
          )}

          {!loading && error && (
            <View style={styles.centerState}>
              <Text style={styles.errorText}>{error}</Text>
              <TouchableOpacity
                style={styles.retryButton}
                onPress={() => setSelectedFilters([...selectedFilters])}
              >
                <Text style={styles.retryButtonText}>Try Again</Text>
              </TouchableOpacity>
            </View>
          )}

          {!loading && !error && suggestions.length === 0 && (
            <View style={styles.centerState}>
              <Text style={styles.emptyText}>No substitutes found</Text>
              <Text style={styles.emptySubtext}>
                Try removing dietary filters or try a different ingredient.
              </Text>
            </View>
          )}

          {!loading &&
            !error &&
            suggestions.map((suggestion, index) => (
              <View key={`${suggestion.substitute_name}-${index}`} style={styles.suggestionCard}>
                <View style={styles.suggestionHeader}>
                  <Text style={styles.substituteName}>
                    {suggestion.substitute_name}
                  </Text>
                  <View
                    style={[
                      styles.confidenceBadge,
                      { backgroundColor: getConfidenceColor(suggestion.confidence) + '20' },
                    ]}
                  >
                    <Text
                      style={[
                        styles.confidenceText,
                        { color: getConfidenceColor(suggestion.confidence) },
                      ]}
                    >
                      {getConfidenceLabel(suggestion.confidence)}
                    </Text>
                  </View>
                </View>

                <Text style={styles.ratioText}>
                  {formatRatio(suggestion.quantity_ratio, suggestion.quantity_note)}
                </Text>

                {suggestion.dietary_tags.length > 0 && (
                  <View style={styles.dietaryTags}>
                    {suggestion.dietary_tags.map((tag) => (
                      <View key={tag} style={styles.dietaryTag}>
                        <Text style={styles.dietaryTagText}>{tag}</Text>
                      </View>
                    ))}
                  </View>
                )}

                {suggestion.notes ? (
                  <Text style={styles.notesText} numberOfLines={3}>
                    {suggestion.notes}
                  </Text>
                ) : null}
              </View>
            ))}

          {/* Premium upsell for free users */}
          {!isPremium && !loading && (
            <View style={styles.upsellCard}>
              <Text style={styles.upsellText}>
                Get more swap suggestions
              </Text>
              <Text style={styles.upsellSubtext}>
                Premium users get expanded suggestions with detailed conversion ratios.
              </Text>
              <TouchableOpacity
                style={styles.upsellButton}
                onPress={onUpgrade}
                activeOpacity={0.8}
              >
                <Text style={styles.upsellButtonText}>Upgrade</Text>
              </TouchableOpacity>
            </View>
          )}
        </ScrollView>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.surface,
  },
  closeButton: {
    position: 'absolute',
    top: spacing.lg,
    right: spacing.lg,
    zIndex: 10,
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.background,
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeText: {
    fontSize: 18,
    color: colors.textSecondary,
  },
  header: {
    paddingHorizontal: layout.pagePadding,
    paddingTop: spacing.xxl + spacing.lg,
    paddingBottom: spacing.md,
  },
  title: {
    ...typography.h1,
    color: colors.textPrimary,
  },
  subtitle: {
    ...typography.body,
    color: colors.textSecondary,
    marginTop: spacing.xs,
  },
  recipeContext: {
    ...typography.small,
    color: colors.textSecondary,
    marginTop: spacing.xs,
    fontStyle: 'italic',
  },
  filtersContainer: {
    maxHeight: 44,
  },
  filtersContent: {
    paddingHorizontal: layout.pagePadding,
    gap: spacing.sm,
  },
  filterChip: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs + 2,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.divider,
    backgroundColor: colors.background,
  },
  filterChipSelected: {
    borderColor: colors.primary,
    backgroundColor: '#F0FDF4',
  },
  filterChipText: {
    ...typography.small,
    color: colors.textSecondary,
    fontWeight: '500',
  },
  filterChipTextSelected: {
    color: colors.primaryDark,
  },
  suggestionsContainer: {
    flex: 1,
    marginTop: spacing.md,
  },
  suggestionsContent: {
    paddingHorizontal: layout.pagePadding,
    paddingBottom: spacing.xxl,
  },
  centerState: {
    alignItems: 'center',
    paddingTop: spacing.xxl * 2,
  },
  errorText: {
    ...typography.body,
    color: colors.error,
    textAlign: 'center',
    marginBottom: spacing.md,
  },
  retryButton: {
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.sm,
    borderRadius: layout.buttonRadius,
    backgroundColor: colors.primary,
  },
  retryButtonText: {
    ...typography.button,
    color: colors.white,
  },
  emptyText: {
    ...typography.body,
    color: colors.textSecondary,
    fontWeight: '600',
  },
  emptySubtext: {
    ...typography.small,
    color: colors.textSecondary,
    textAlign: 'center',
    marginTop: spacing.xs,
    paddingHorizontal: spacing.xl,
  },
  suggestionCard: {
    backgroundColor: colors.background,
    borderRadius: layout.cardRadius,
    padding: spacing.lg,
    marginBottom: spacing.sm,
  },
  suggestionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.xs,
  },
  substituteName: {
    ...typography.body,
    fontWeight: '600',
    color: colors.textPrimary,
    flex: 1,
  },
  confidenceBadge: {
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: 8,
    marginLeft: spacing.sm,
  },
  confidenceText: {
    ...typography.small,
    fontWeight: '600',
    fontSize: 11,
  },
  ratioText: {
    ...typography.small,
    color: colors.textSecondary,
    marginBottom: spacing.xs,
  },
  dietaryTags: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.xs,
    marginBottom: spacing.xs,
  },
  dietaryTag: {
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
    borderRadius: 6,
    backgroundColor: '#F0FDF4',
  },
  dietaryTagText: {
    ...typography.small,
    color: colors.primaryDark,
    fontSize: 11,
  },
  notesText: {
    ...typography.small,
    color: colors.textSecondary,
    lineHeight: 18,
  },
  upsellCard: {
    backgroundColor: colors.premiumBg,
    borderRadius: layout.cardRadius,
    padding: spacing.lg,
    alignItems: 'center',
    marginTop: spacing.sm,
  },
  upsellText: {
    ...typography.body,
    fontWeight: '600',
    color: colors.accent,
  },
  upsellSubtext: {
    ...typography.small,
    color: colors.textSecondary,
    textAlign: 'center',
    marginTop: spacing.xs,
  },
  upsellButton: {
    backgroundColor: colors.accent,
    borderRadius: 16,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.xs + 2,
    marginTop: spacing.md,
  },
  upsellButtonText: {
    ...typography.small,
    color: colors.white,
    fontWeight: '600',
  },
});
