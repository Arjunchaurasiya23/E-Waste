/**
 * Admin Service
 * 
 * Handles admin-specific API calls.
 * Matches backend API contract: /admin/*
 */

import { apiClient, ApiResponse } from "@/lib/api-client";

/**
 * Dashboard stats response
 */
export interface DashboardStatsResponse {
  totalPickups: number;
  totalCustomers: number;
  totalCollectors: number;
  activeCollectors: number;
  pendingPickups: number;
  completedPickupsToday: number;
}

/**
 * Analytics response (simplified)
 */
export interface AnalyticsResponse {
  date: string;
  totalPickups: number;
  totalWeight: number;
  totalRevenue: number;
  totalPayouts: number;
  byWasteType: Array<{
    type: "PAPER" | "PLASTIC" | "METAL" | "EWASTE" | "GLASS" | "MIXED";
    weight: number;
    revenue: number;
  }>;
  topCollectors: Array<{
    id: string;
    name: string;
    pickups: number;
    weight: number;
  }>;
}

/**
 * Get analytics query parameters
 */
export interface GetAnalyticsParams {
  startDate?: string; // ISO date string
  endDate?: string; // ISO date string
}

/**
 * Get dashboard statistics
 */
export async function getDashboardStats(): Promise<
  ApiResponse<DashboardStatsResponse>
> {
  return apiClient.get<DashboardStatsResponse>("/admin/dashboard");
}

/**
 * Get analytics data
 */
export async function getAnalytics(
  params?: GetAnalyticsParams
): Promise<ApiResponse<AnalyticsResponse>> {
  const queryParams = new URLSearchParams();
  if (params?.startDate) queryParams.append("startDate", params.startDate);
  if (params?.endDate) queryParams.append("endDate", params.endDate);

  const endpoint = queryParams.toString()
    ? `/admin/analytics?${queryParams.toString()}`
    : "/admin/analytics";

  return apiClient.get<AnalyticsResponse>(endpoint);
}

