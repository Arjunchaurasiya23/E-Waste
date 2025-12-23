/**
 * Collector Service
 * 
 * Handles collector-specific API calls.
 * Note: Most collector endpoints are in pickup.service.ts
 * This service is for collector profile/earnings data.
 */

import { apiClient, ApiResponse } from "@/lib/api-client";

/**
 * Collector profile response (simplified)
 */
export interface CollectorProfileResponse {
  id: string;
  userId: string;
  status: "PENDING" | "APPROVED" | "SUSPENDED";
  pincodes: string[];
  rating: number;
  totalPickups: number;
  totalEarnings: number;
  commissionRate: number;
  joinedAt: string;
}

/**
 * Get collector profile/earnings
 * Note: This endpoint may not exist in backend yet - placeholder for future
 */
export async function getCollectorProfile(): Promise<
  ApiResponse<CollectorProfileResponse>
> {
  // This endpoint may need to be added to backend
  // For now, this is a placeholder
  return apiClient.get<CollectorProfileResponse>("/collectors/me");
}

