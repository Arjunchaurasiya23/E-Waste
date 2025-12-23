/**
 * Pickup Service
 * 
 * Handles pickup request-related API calls.
 * Matches backend API contract: /pickups/*
 */

import { apiClient, ApiResponse } from "@/lib/api-client";

/**
 * Waste bag item (matches backend)
 */
export interface WasteBagItemRequest {
  type: "PAPER" | "PLASTIC" | "METAL" | "EWASTE" | "GLASS" | "MIXED";
  estimatedWeight?: number;
  pricePerKg: number;
  estimatedAmount?: number;
}

/**
 * Create pickup request payload (matches backend)
 */
export interface CreatePickupRequest {
  address: {
    line1: string;
    line2?: string;
    city: string;
    state: string;
    pincode: string;
    landmark?: string;
  };
  scheduledDate: string; // ISO date string
  scheduledSlotId: string; // "morning" | "afternoon" | "evening"
  items: WasteBagItemRequest[];
  assistedMode?: boolean;
  notes?: string;
}

/**
 * Pickup response (simplified - full type would match backend Prisma model)
 */
export interface PickupResponse {
  id: string;
  customerId: string;
  status: "REQUESTED" | "ASSIGNED" | "ON_THE_WAY" | "WEIGHING" | "PICKED" | "PAID" | "CANCELLED";
  scheduledDate: string;
  scheduledSlotId: string;
  collectorId?: string;
  totalEstimatedWeight?: number;
  totalActualWeight?: number;
  totalEstimatedAmount?: number;
  totalActualAmount?: number;
  convenienceFee?: number;
  priceLockExpiresAt?: string;
  items?: unknown; // JSON field
  address?: unknown; // JSON field
  createdAt: string;
  updatedAt: string;
}

/**
 * Get pickups query parameters
 */
export interface GetPickupsParams {
  status?: "REQUESTED" | "ASSIGNED" | "ON_THE_WAY" | "WEIGHING" | "PICKED" | "PAID" | "CANCELLED";
  page?: number;
  limit?: number;
}

/**
 * Get pickups response with pagination
 */
export interface GetPickupsResponse {
  pickups: PickupResponse[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

/**
 * Create a new pickup request
 */
export async function createPickup(
  data: CreatePickupRequest
): Promise<ApiResponse<PickupResponse>> {
  return apiClient.post<PickupResponse>("/pickups", data);
}

/**
 * Get pickups with optional filters
 */
export async function getPickups(
  params?: GetPickupsParams
): Promise<ApiResponse<GetPickupsResponse>> {
  const queryParams = new URLSearchParams();
  if (params?.status) queryParams.append("status", params.status);
  if (params?.page) queryParams.append("page", params.page.toString());
  if (params?.limit) queryParams.append("limit", params.limit.toString());

  const endpoint = queryParams.toString()
    ? `/pickups?${queryParams.toString()}`
    : "/pickups";

  return apiClient.get<GetPickupsResponse>(endpoint);
}

/**
 * Get pickup by ID
 */
export async function getPickupById(
  id: string
): Promise<ApiResponse<PickupResponse>> {
  return apiClient.get<PickupResponse>(`/pickups/${id}`);
}

/**
 * Collector: Get available pickups
 */
export async function getAvailablePickups(
  params?: { page?: number; limit?: number }
): Promise<ApiResponse<GetPickupsResponse>> {
  const queryParams = new URLSearchParams();
  if (params?.page) queryParams.append("page", params.page.toString());
  if (params?.limit) queryParams.append("limit", params.limit.toString());

  const endpoint = queryParams.toString()
    ? `/pickups/collector/available?${queryParams.toString()}`
    : "/pickups/collector/available";

  return apiClient.get<GetPickupsResponse>(endpoint);
}

/**
 * Collector: Accept a pickup
 */
export async function acceptPickup(
  id: string
): Promise<ApiResponse<PickupResponse>> {
  return apiClient.post<PickupResponse>(`/pickups/collector/${id}/accept`);
}

/**
 * Collector: Start pickup (on the way)
 */
export async function startPickup(
  id: string
): Promise<ApiResponse<PickupResponse>> {
  return apiClient.post<PickupResponse>(`/pickups/collector/${id}/start`);
}

/**
 * Collector: Submit weight
 */
export interface SubmitWeightRequest {
  items: Array<{
    type: "PAPER" | "PLASTIC" | "METAL" | "EWASTE" | "GLASS" | "MIXED";
    actualWeight: number;
    pricePerKg: number;
  }>;
}

export async function submitWeight(
  id: string,
  data: SubmitWeightRequest
): Promise<ApiResponse<PickupResponse>> {
  return apiClient.post<PickupResponse>(`/pickups/collector/${id}/weigh`, data);
}

/**
 * Collector: Complete pickup
 */
export async function completePickup(
  id: string
): Promise<ApiResponse<PickupResponse>> {
  return apiClient.post<PickupResponse>(`/pickups/collector/${id}/complete`);
}

