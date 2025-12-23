/**
 * Pricing Service
 * 
 * Handles waste pricing-related API calls.
 * Matches backend API contract: /pricing/*
 */

import { apiClient, ApiResponse } from "@/lib/api-client";

/**
 * Waste pricing response (matches backend)
 */
export interface WastePricingResponse {
  id: string;
  type: "PAPER" | "PLASTIC" | "METAL" | "EWASTE" | "GLASS" | "MIXED";
  pricePerKg: number;
  minQuantity: number;
  icon: string;
  labelEn: string;
  labelHi: string;
  isActive: boolean;
}

/**
 * Update pricing request payload
 */
export interface UpdatePricingRequest {
  pricePerKg?: number;
  minQuantity?: number;
}

/**
 * Get all waste pricing (public endpoint)
 */
export async function getPricing(): Promise<ApiResponse<WastePricingResponse[]>> {
  return apiClient.get<WastePricingResponse[]>("/pricing", {
    requireAuth: false,
  });
}

/**
 * Update pricing for a waste type (admin only)
 */
export async function updatePricing(
  type: "PAPER" | "PLASTIC" | "METAL" | "EWASTE" | "GLASS" | "MIXED",
  data: UpdatePricingRequest
): Promise<ApiResponse<WastePricingResponse>> {
  return apiClient.put<WastePricingResponse>(`/pricing/${type}`, data);
}

