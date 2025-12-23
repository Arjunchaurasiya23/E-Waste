/**
 * Pickup calculation utilities
 *
 * This module contains pure, side-effect-free functions for calculating
 * item amounts, pickup estimates, and basic weight validations.
 *
 * IMPORTANT:
 * - No JSX.
 * - No React imports.
 * - No network or storage calls.
 */

import {
  ScrapCategory,
  PickupEstimateItemInput,
  PickupEstimateItem,
  PickupEstimate,
  ValidationResult,
} from "@/types/pickup";

/**
 * Calculate the monetary amount for a single item.
 *
 * @param weightKg - Weight in kilograms
 * @param unitPrice - Price per kilogram in rupees
 * @returns Calculated amount (₹), rounded to 2 decimal places
 */
export function calculateItemAmount(weightKg: number, unitPrice: number): number {
  const raw = weightKg * unitPrice;
  // Round to 2 decimal places to avoid floating point artefacts
  return Math.round(raw * 100) / 100;
}

/**
 * Validate a single item's weight against minimum and maximum limits.
 *
 * Hard validation rules:
 * - weight < 1 kg => error
 * - weight > maxKg => error
 *
 * @param weightKg - Weight in kilograms to validate
 * @param minKg - Minimum allowed weight (inclusive)
 * @param maxKg - Maximum allowed weight (inclusive)
 * @returns ValidationResult (no side effects)
 */
export function validateItemWeight(
  weightKg: number,
  minKg: number,
  maxKg: number,
): ValidationResult {
  if (Number.isNaN(weightKg)) {
    return {
      valid: false,
      error: "Weight must be a valid number.",
    };
  }

  if (weightKg < 1) {
    return {
      valid: false,
      error: "Minimum weight per item is 1 kg.",
    };
  }

  if (weightKg < minKg) {
    return {
      valid: false,
      error: `Weight must be at least ${minKg} kg for this category.`,
    };
  }

  if (weightKg > maxKg) {
    return {
      valid: false,
      error: `Weight cannot exceed ${maxKg} kg for a single item.`,
    };
  }

  return { valid: true };
}

/**
 * Validate the total weight of a pickup against an upper bound.
 *
 * Hard validation rules:
 * - totalKg > maxTotalKg (default 1000 kg) => error
 * - totalKg < 1 kg => error
 *
 * @param totalKg - Sum of all item weights (kg)
 * @param maxTotalKg - Maximum allowed total weight (kg), default 1000
 * @returns ValidationResult (no side effects)
 */
export function validateTotalWeight(
  totalKg: number,
  maxTotalKg = 1000,
): ValidationResult {
  if (Number.isNaN(totalKg)) {
    return {
      valid: false,
      error: "Total weight must be a valid number.",
    };
  }

  if (totalKg < 1) {
    return {
      valid: false,
      error: "Total pickup weight must be at least 1 kg.",
    };
  }

  if (totalKg > maxTotalKg) {
    return {
      valid: false,
      error: `Total pickup weight cannot exceed ${maxTotalKg} kg.`,
    };
  }

  return { valid: true };
}

/**
 * Detect whether any item in the estimate exceeds a given threshold.
 *
 * This is a soft warning only and does not invalidate the estimate.
 *
 * @param items - Estimate items to inspect
 * @param thresholdKg - Threshold in kg, default 50
 * @returns True if any item has estimatedWeightKg > thresholdKg
 */
export function detectHighWeightWarning(
  items: PickupEstimateItem[],
  thresholdKg = 50,
): boolean {
  return items.some((item) => item.estimatedWeightKg > thresholdKg);
}

/**
 * Build a full PickupEstimate from minimal item inputs and known categories.
 *
 * Responsibilities:
 * - Resolve category name and unitPrice from ScrapCategory by categoryId
 * - Calculate per-item estimated amount
 * - Calculate total estimated weight and amount
 * - Flag hasHighWeightWarning when appropriate
 *
 * NOTE:
 * - This function assumes basic weight validation is performed separately.
 * - If a categoryId cannot be resolved, it is treated as unitPrice = 0 with a
 *   generic categoryName. Callers may choose to guard against this earlier.
 *
 * @param items - Minimal item inputs (categoryId + estimatedWeightKg)
 * @param categories - Known scrap categories (with pricing and bounds)
 * @returns A populated PickupEstimate
 */
export function calculatePickupEstimate(
  items: PickupEstimateItemInput[],
  categories: ScrapCategory[],
): PickupEstimate {
  const categoryById = new Map<string, ScrapCategory>(
    categories.map((cat) => [cat.id, cat]),
  );

  const enrichedItems: PickupEstimateItem[] = items.map((input) => {
    const category = categoryById.get(input.categoryId);

    const unitPrice = category?.unitPrice ?? 0;
    const categoryName = category?.name ?? "Unknown category";
    const estimatedAmount = calculateItemAmount(input.estimatedWeightKg, unitPrice);

    return {
      categoryId: input.categoryId,
      categoryName,
      estimatedWeightKg: input.estimatedWeightKg,
      unitPrice,
      estimatedAmount,
    };
  });

  const totalEstimatedWeightKg = enrichedItems.reduce(
    (sum, item) => sum + item.estimatedWeightKg,
    0,
  );

  const totalEstimatedAmount = enrichedItems.reduce(
    (sum, item) => sum + item.estimatedAmount,
    0,
  );

  const hasHighWeightWarning = detectHighWeightWarning(enrichedItems);

  return {
    items: enrichedItems,
    totalEstimatedWeightKg,
    totalEstimatedAmount: Math.round(totalEstimatedAmount * 100) / 100,
    hasHighWeightWarning,
  };
}


