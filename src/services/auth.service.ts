/**
 * Authentication Service
 * 
 * Handles authentication-related API calls.
 * Matches backend API contract: /auth/*
 */

import { apiClient, ApiResponse } from "@/lib/api-client";

/**
 * Send OTP request payload
 */
export interface SendOTPRequest {
  phone: string;
}

/**
 * Send OTP response
 */
export interface SendOTPResponse {
  message: string;
}

/**
 * Verify OTP request payload
 */
export interface VerifyOTPRequest {
  phone: string;
  code: string;
  role?: "CUSTOMER" | "COLLECTOR" | "ADMIN";
}

/**
 * Verify OTP response (matches backend)
 */
export interface VerifyOTPResponse {
  accessToken: string;
  refreshToken: string;
  user: {
    id: string;
    phone: string;
    name: string;
    role: "CUSTOMER" | "COLLECTOR" | "ADMIN";
    email?: string | null;
    language: string;
  };
}

/**
 * Send OTP to phone number
 */
export async function sendOTP(
  phone: string
): Promise<ApiResponse<SendOTPResponse>> {
  return apiClient.post<SendOTPResponse>(
    "/auth/send-otp",
    { phone } as SendOTPRequest,
    { requireAuth: false }
  );
}

/**
 * Verify OTP and get authentication tokens
 */
export async function verifyOTP(
  request: VerifyOTPRequest
): Promise<ApiResponse<VerifyOTPResponse>> {
  return apiClient.post<VerifyOTPResponse>(
    "/auth/verify-otp",
    request,
    { requireAuth: false }
  );
}

