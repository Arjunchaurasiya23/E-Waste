/**
 * Transaction Service
 * 
 * Handles transaction and wallet-related API calls.
 * Matches backend API contract: /transactions/*
 */

import { apiClient, ApiResponse } from "@/lib/api-client";

/**
 * Transaction response (simplified - full type would match backend Prisma model)
 */
export interface TransactionResponse {
  id: string;
  userId: string;
  pickupId?: string;
  type: "CREDIT" | "DEBIT" | "PAYOUT";
  amount: number;
  description: string;
  status: "PENDING" | "COMPLETED" | "FAILED";
  upiId?: string;
  createdAt: string;
  updatedAt: string;
}

/**
 * Get transactions query parameters
 */
export interface GetTransactionsParams {
  type?: "CREDIT" | "DEBIT" | "PAYOUT";
  page?: number;
  limit?: number;
}

/**
 * Get transactions response with pagination
 */
export interface GetTransactionsResponse {
  transactions: TransactionResponse[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

/**
 * Wallet balance response
 */
export interface WalletBalanceResponse {
  balance: number;
}

/**
 * Request payout payload
 */
export interface RequestPayoutRequest {
  amount: number;
  upiId: string;
}

/**
 * Get transactions with optional filters
 */
export async function getTransactions(
  params?: GetTransactionsParams
): Promise<ApiResponse<GetTransactionsResponse>> {
  const queryParams = new URLSearchParams();
  if (params?.type) queryParams.append("type", params.type);
  if (params?.page) queryParams.append("page", params.page.toString());
  if (params?.limit) queryParams.append("limit", params.limit.toString());

  const endpoint = queryParams.toString()
    ? `/transactions?${queryParams.toString()}`
    : "/transactions";

  return apiClient.get<GetTransactionsResponse>(endpoint);
}

/**
 * Get wallet balance
 */
export async function getWalletBalance(): Promise<ApiResponse<WalletBalanceResponse>> {
  return apiClient.get<WalletBalanceResponse>("/transactions/wallet/balance");
}

/**
 * Request payout to UPI
 */
export async function requestPayout(
  data: RequestPayoutRequest
): Promise<ApiResponse<TransactionResponse>> {
  return apiClient.post<TransactionResponse>(
    "/transactions/wallet/payout",
    data
  );
}

