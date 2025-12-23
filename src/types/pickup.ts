/**
 * Pickup-related type models
 *
 * These types model how scrap pickup items and estimates are represented
 * on the frontend. They are designed to align with the backend data model
 * while keeping estimation and final confirmation concerns clearly separated.
 */

/**
 * A scrap category that can be picked up.
 *
 * This is usually derived from pricing APIs (e.g. /pricing).
 */
export interface ScrapCategory {
  /** Stable identifier used to correlate with backend pricing (e.g. "PAPER") */
  id: string;
  /** Human friendly name (e.g. "Paper / Cardboard") */
  name: string;
  /** Price per kilogram in rupees */
  unitPrice: number;
  /** Minimum allowed weight for a single item (kg) */
  minWeightKg: number;
  /** Maximum allowed weight for a single item (kg) */
  maxWeightKg: number;
}

/**
 * Minimal input required from the customer to describe an item
 * before enrichment with pricing details.
 */
export interface PickupEstimateItemInput {
  /** ID of the scrap category (must match a ScrapCategory.id) */
  categoryId: string;
  /** Approximate weight in kilograms entered by the customer */
  estimatedWeightKg: number;
}

/**
 * A single pickup item as used in an estimation context.
 *
 * All pricing fields are resolved and the estimated amount is calculated.
 */
export interface PickupEstimateItem {
  /** ID of the scrap category */
  categoryId: string;
  /** Display name for the category at the time of estimation */
  categoryName: string;
  /** Approximate weight in kilograms entered by the customer */
  estimatedWeightKg: number;
  /** Price per kilogram in rupees at estimation time */
  unitPrice: number;
  /** Derived estimated amount for this item (weight * unitPrice) */
  estimatedAmount: number;
}

/**
 * Aggregate estimate for an entire pickup request.
 */
export interface PickupEstimate {
  /** All items included in this estimate */
  items: PickupEstimateItem[];
  /** Sum of all item estimated weights (kg) */
  totalEstimatedWeightKg: number;
  /** Sum of all item estimated amounts (₹) */
  totalEstimatedAmount: number;
  /** True if any single item has estimatedWeightKg above a threshold (e.g. 50 kg) */
  hasHighWeightWarning: boolean;
}

/**
 * A single pickup item with collector-confirmed (final) values.
 *
 * This is intentionally smaller than PickupEstimateItem and focuses
 * on the values that must be auditable post-pickup.
 */
export interface PickupItemWithFinal {
  /** ID of the scrap category */
  categoryId: string;
  /** Final weight measured by the collector (kg) */
  finalWeightKg: number;
  /** Final amount paid for this item (₹) */
  finalAmount: number;
}

/**
 * Final summary of a pickup after collector confirmation.
 */
export interface PickupFinalSummary {
  /** Final items with collector-confirmed weights and amounts */
  finalItems: PickupItemWithFinal[];
  /** Total of final weights (kg) */
  totalFinalWeightKg: number;
  /** Total of final amounts (₹) */
  totalFinalAmount: number;
  /**
   * Difference in total amount between final and estimated values.
   * Positive value means final payout > estimated payout,
   * negative value means final payout < estimated payout.
   */
  differenceFromEstimate: number;
}

/**
 * Generic validation result used by weight validation helpers.
 */
export interface ValidationResult {
  /** True if the value passed all validation rules */
  valid: boolean;
  /** Optional human-readable error message when valid === false */
  error?: string;
}


