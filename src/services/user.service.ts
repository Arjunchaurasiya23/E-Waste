/**
 * User Service
 * 
 * Handles user profile-related API calls.
 * Matches backend API contract: /users/*
 */

import { apiClient, ApiResponse } from "@/lib/api-client";

/**
 * User profile (matches backend response)
 */
export interface UserProfile {
  id: string;
  phone: string;
  name: string;
  role: "CUSTOMER" | "COLLECTOR" | "ADMIN";
  email?: string | null;
  language: string;
  pincode?: string | null;
}

/**
 * Update profile request payload
 */
export interface UpdateProfileRequest {
  name?: string;
  email?: string;
  language?: "en" | "hi";
}

/**
 * Get current user profile
 */
export async function getProfile(): Promise<ApiResponse<UserProfile>> {
  return apiClient.get<UserProfile>("/users/me");
}

/**
 * Update current user profile
 */
export async function updateProfile(
  data: UpdateProfileRequest
): Promise<ApiResponse<UserProfile>> {
  return apiClient.put<UserProfile>("/users/me", data);
}

