import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors, typography, spacing, layout } from '../src/theme';
import { getJobResults } from '../src/api/extract';
import { useExtractionStore } from '../src/store/extractionStore';
import { useDeviceStore } from '../src/store/deviceStore';
import { IngredientCard, PlaceholderIngredientCard } from '../src/components/IngredientCard';
import { ShoppingListSection } from '../src/components/ShoppingListSection';
import { PremiumTeaser } from '../src/components/PremiumTeaser';
import { PaywallModal } from '../src/components/PaywallModal';
import { ErrorBanner } from '../src/components/ErrorBanner';
import { SaveRecipeButton } from '../src/components/gallery/SaveRecipeButton';
import { Ingredient } from '../src/api/types';

export default function ResultsScreen() {
  const { jobId } = useLocalSearchParams<{ jobId: string }>();
  const { results, setResults, isItemChecked, toggleCheckedItem } =
    useExtractionStore();
  const isPremium = useDeviceStore((s) => s.isPremium);
  const [loading, setLoading] = useState(!results);
  const [error, setError] = useState<string | null>(null);
  const [paywallVisible, setPaywallVisible] = useState(false);
  const insets = useSafeAreaInsets();

  useEffect(() => {
    if (results || !jobId) return;

    async function fetchResults() {
      try {
        const data = await getJobResults(jobId!);
        setResults(data);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : 'Failed to load results',
        );
      } finally {
        setLoading(false);
      }
    }

    fetchResults();
  }, [jobId]);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  if (error || !results) {
    return (
      <View style={styles.errorContainer}>
        <ErrorBanner
          message={error || "We couldn't detect any ingredients in this video."}
        />
        <Text style={styles.errorHint}>
          Try another video, preferably a cooking or recipe video.
        </Text>
      </View>
    );
  }

  const { ingredients, shopping_list, is_truncated, total_ingredient_count, shown_ingredient_count } =
    results;

  // Group visible ingredients by category
  const grouped = ingredients.reduce<Record<string, Ingredient[]>>(
    (acc, ingredient) => {
      const cat = ingredient.category || 'Other';
      if (!acc[cat]) acc[cat] = [];
      acc[cat].push(ingredient);
      return acc;
    },
    {},
  );

  const hiddenCount = is_truncated
    ? total_ingredient_count - shown_ingredient_count
    : 0;

  return (
    <>
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        {/* Summary header */}
        <View style={styles.summaryHeader}>
          {results.recipe_name ? (
            <Text style={styles.recipeName}>{results.recipe_name}</Text>
          ) : null}
          <Text style={styles.summaryText}>
            {is_truncated
              ? `Showing ${shown_ingredient_count} of ${total_ingredient_count} ingredients`
              : `${ingredients.length} ingredient${ingredients.length !== 1 ? 's' : ''} found`}
          </Text>
          {is_truncated && results.upgrade_message && (
            <Text style={styles.upgradeHint}>{results.upgrade_message}</Text>
          )}
        </View>

        {/* Ingredient cards grouped by category */}
        {Object.entries(grouped).map(([category, items]) => (
          <View key={category} style={styles.categoryGroup}>
            <Text style={styles.categoryHeader}>{category.toUpperCase()}</Text>
            {items.map((ingredient) => (
              <IngredientCard
                key={ingredient.name}
                ingredient={ingredient}
                isChecked={isItemChecked(ingredient.name)}
                onToggle={() => toggleCheckedItem(ingredient.name)}
              />
            ))}
          </View>
        ))}

        {/* Placeholder cards for hidden ingredients */}
        {is_truncated &&
          Array.from({ length: Math.min(hiddenCount, 3) }).map((_, i) => (
            <PlaceholderIngredientCard
              key={`placeholder-${i}`}
              index={shown_ingredient_count + i + 1}
            />
          ))}

        {/* Premium teaser */}
        {is_truncated && (
          <PremiumTeaser
            totalCount={total_ingredient_count}
            shownCount={shown_ingredient_count}
            onUpgrade={() => setPaywallVisible(true)}
          />
        )}

        {/* Shopping list section */}
        <ShoppingListSection
          shoppingList={shopping_list}
          isTruncated={is_truncated}
          recipeName={results.recipe_name}
        />
      </ScrollView>

      {/* Fixed save button at bottom */}
      <View style={[styles.saveButtonContainer, { paddingBottom: Math.max(insets.bottom, spacing.md) + spacing.md }]}>
        <SaveRecipeButton results={results} />
      </View>

      <PaywallModal
        visible={paywallVisible}
        onClose={() => setPaywallVisible(false)}
      />
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  contentContainer: {
    padding: layout.pagePadding,
    paddingBottom: spacing.xl,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.background,
  },
  errorContainer: {
    flex: 1,
    padding: layout.pagePadding,
    paddingTop: spacing.xxl,
    backgroundColor: colors.background,
  },
  errorHint: {
    ...typography.body,
    color: colors.textSecondary,
    textAlign: 'center',
    marginTop: spacing.md,
  },
  summaryHeader: {
    marginBottom: spacing.lg,
  },
  recipeName: {
    ...typography.h2,
    color: colors.textPrimary,
    marginBottom: spacing.xs,
  },
  summaryText: {
    ...typography.body,
    color: colors.textSecondary,
  },
  upgradeHint: {
    ...typography.small,
    color: colors.accent,
    marginTop: spacing.xs,
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
  saveButtonContainer: {
    paddingHorizontal: layout.pagePadding,
    paddingTop: spacing.md,
    backgroundColor: colors.background,
    borderTopWidth: 1,
    borderTopColor: colors.divider,
  },
});
