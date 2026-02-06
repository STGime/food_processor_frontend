import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors, typography, spacing, layout } from '../src/theme';
import { getJobResults } from '../src/api/extract';
import { useExtractionStore } from '../src/store/extractionStore';
import { useDeviceStore } from '../src/store/deviceStore';
import { IngredientCard, PlaceholderIngredientCard } from '../src/components/IngredientCard';
import { InstructionCard, PlaceholderInstructionCard } from '../src/components/InstructionCard';
import { ShoppingListSection } from '../src/components/ShoppingListSection';
import { PremiumTeaser } from '../src/components/PremiumTeaser';
import { PaywallModal } from '../src/components/PaywallModal';
import { ErrorBanner } from '../src/components/ErrorBanner';
import { ExtractionFailedScreen } from '../src/components/ExtractionFailedScreen';
import { SaveRecipeButton } from '../src/components/gallery/SaveRecipeButton';
import { IngredientSwapModal } from '../src/components/IngredientSwapModal';
import { Ingredient } from '../src/api/types';

export default function ResultsScreen() {
  const router = useRouter();
  const { jobId } = useLocalSearchParams<{ jobId: string }>();
  const { results, setResults, isItemChecked, toggleCheckedItem, reset } =
    useExtractionStore();
  const isPremium = useDeviceStore((s) => s.isPremium);
  const [loading, setLoading] = useState(!results);
  const [error, setError] = useState<string | null>(null);
  const [paywallVisible, setPaywallVisible] = useState(false);
  const [swapModalVisible, setSwapModalVisible] = useState(false);
  const [selectedIngredient, setSelectedIngredient] = useState<Ingredient | null>(null);
  const insets = useSafeAreaInsets();

  const handleSwapPress = (ingredient: Ingredient) => {
    setSelectedIngredient(ingredient);
    setSwapModalVisible(true);
  };

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

  const {
    ingredients,
    instructions = [],
    shopping_list,
    is_truncated,
    total_ingredient_count,
    shown_ingredient_count,
    total_instruction_count = 0,
    shown_instruction_count = 0,
  } = results;

  // Show extraction failed screen if no ingredients were found
  if (ingredients.length === 0) {
    return (
      <ExtractionFailedScreen
        onTryAgain={() => {
          reset();
          router.replace('/');
        }}
      />
    );
  }

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

  const hiddenIngredientCount = is_truncated
    ? total_ingredient_count - shown_ingredient_count
    : 0;
  const hiddenInstructionCount = is_truncated
    ? total_instruction_count - shown_instruction_count
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
              ? `Showing ${shown_ingredient_count} of ${total_ingredient_count} ingredients${total_instruction_count > 0 ? `, ${shown_instruction_count} of ${total_instruction_count} steps` : ''}`
              : `${ingredients.length} ingredient${ingredients.length !== 1 ? 's' : ''}${instructions.length > 0 ? `, ${instructions.length} step${instructions.length !== 1 ? 's' : ''}` : ''}`}
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
                onSwapPress={() => handleSwapPress(ingredient)}
              />
            ))}
          </View>
        ))}

        {/* Placeholder cards for hidden ingredients */}
        {is_truncated && hiddenIngredientCount > 0 &&
          Array.from({ length: Math.min(hiddenIngredientCount, 3) }).map((_, i) => (
            <PlaceholderIngredientCard
              key={`placeholder-ingredient-${i}`}
              index={shown_ingredient_count + i + 1}
            />
          ))}

        {/* Instructions section */}
        {instructions.length > 0 && (
          <View style={styles.instructionsSection}>
            <Text style={styles.sectionHeader}>COOKING INSTRUCTIONS</Text>
            {instructions.map((instruction) => (
              <InstructionCard
                key={`instruction-${instruction.step_number}`}
                instruction={instruction}
              />
            ))}
            {/* Placeholder cards for hidden instructions */}
            {is_truncated && hiddenInstructionCount > 0 &&
              Array.from({ length: Math.min(hiddenInstructionCount, 3) }).map((_, i) => (
                <PlaceholderInstructionCard
                  key={`placeholder-instruction-${i}`}
                  index={shown_instruction_count + i + 1}
                />
              ))}
          </View>
        )}

        {/* Premium teaser */}
        {is_truncated && (
          <PremiumTeaser
            totalIngredientCount={total_ingredient_count}
            shownIngredientCount={shown_ingredient_count}
            totalInstructionCount={total_instruction_count}
            shownInstructionCount={shown_instruction_count}
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

      <IngredientSwapModal
        visible={swapModalVisible}
        onClose={() => setSwapModalVisible(false)}
        ingredientName={selectedIngredient?.name ?? ''}
        quantity={selectedIngredient?.quantity ?? undefined}
        unit={selectedIngredient?.unit ?? undefined}
        recipeName={results.recipe_name}
        isPremium={isPremium}
        onUpgrade={() => {
          setSwapModalVisible(false);
          setPaywallVisible(true);
        }}
      />

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
  instructionsSection: {
    marginTop: spacing.lg,
    marginBottom: spacing.lg,
  },
  sectionHeader: {
    ...typography.small,
    color: colors.textSecondary,
    letterSpacing: 1,
    marginBottom: spacing.md,
  },
  saveButtonContainer: {
    paddingHorizontal: layout.pagePadding,
    paddingTop: spacing.md,
    backgroundColor: colors.background,
    borderTopWidth: 1,
    borderTopColor: colors.divider,
  },
});
