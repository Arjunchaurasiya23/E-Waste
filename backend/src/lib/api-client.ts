/**
 * Frontend API Client Helper
 * 
 * This file provides TypeScript types and examples for frontend integration.
 * Copy this structure to your frontend project.
 */

export const API_BASE_URL = process.env.VITE_API_URL || "http://localhost:3000/api";

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
  errors?: Record<string, string[]>;
}

/**
 * API Client with authentication
 */
class ApiClient {
  private baseURL: string;
  private token: string | null = null;

  constructor(baseURL: string) {
    this.baseURL = baseURL;
  }

  setToken(token: string | null) {
    this.token = token;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    const url = `${this.baseURL}${endpoint}`;
    const headers: HeadersInit = {
      "Content-Type": "application/json",
      ...options.headers,
    };

    if (this.token) {
      headers["Authorization"] = `Bearer ${this.token}`;
    }

    const response = await fetch(url, {
      ...options,
      headers,
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || "Request failed");
    }

    return data;
  }

  // Auth
  async sendOTP(phone: string) {
    return this.request("/auth/send-otp", {
      method: "POST",
      body: JSON.stringify({ phone }),
    });
  }

  async verifyOTP(phone: string, code: string, role?: string) {
    return this.request("/auth/verify-otp", {
      method: "POST",
      body: JSON.stringify({ phone, code, role }),
    });
  }

  // Users
  async getProfile() {
    return this.request("/users/me");
  }

  async updateProfile(data: { name?: string; email?: string; language?: string }) {
    return this.request("/users/me", {
      method: "PUT",
      body: JSON.stringify(data),
    });
  }

  // Pickups
  async createPickup(data: any) {
    return this.request("/pickups", {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  async getPickups(params?: { status?: string; page?: number; limit?: number }) {
    const query = new URLSearchParams();
    if (params?.status) query.append("status", params.status);
    if (params?.page) query.append("page", params.page.toString());
    if (params?.limit) query.append("limit", params.limit.toString());
    
    return this.request(`/pickups?${query.toString()}`);
  }

  async getPickupById(id: string) {
    return this.request(`/pickups/${id}`);
  }

  // Transactions
  async getTransactions(params?: { type?: string; page?: number; limit?: number }) {
    const query = new URLSearchParams();
    if (params?.type) query.append("type", params.type);
    if (params?.page) query.append("page", params.page.toString());
    if (params?.limit) query.append("limit", params.limit.toString());
    
    return this.request(`/transactions?${query.toString()}`);
  }

  async getWalletBalance() {
    return this.request("/transactions/wallet/balance");
  }

  // Pricing
  async getPricing() {
    return this.request("/pricing");
  }

  // Collector
  async getAvailablePickups() {
    return this.request("/pickups/collector/available");
  }

  async acceptPickup(id: string) {
    return this.request(`/pickups/collector/${id}/accept`, {
      method: "POST",
    });
  }

  // Admin
  async getDashboardStats() {
    return this.request("/admin/dashboard");
  }
}

export const apiClient = new ApiClient(API_BASE_URL);

