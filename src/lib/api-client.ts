/**
 * API Client
 * 
 * Centralized HTTP client for backend API communication.
 * Handles authentication, error normalization, and request/response typing.
 */

import { env } from "@/config/env";
import { tokenStorage } from "./token-storage";

/**
 * Standard API response format from backend
 */
export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
  errors?: Record<string, string[]>;
}

/**
 * API error with normalized structure
 */
export class ApiError extends Error {
  constructor(
    message: string,
    public status: number,
    public errors?: Record<string, string[]>
  ) {
    super(message);
    this.name = "ApiError";
  }
}

/**
 * Request options extending native Fetch API options
 */
interface RequestOptions extends Omit<RequestInit, "body"> {
  body?: unknown;
  requireAuth?: boolean;
}

/**
 * API Client class
 */
class ApiClient {
  private baseURL: string;

  constructor(baseURL: string) {
    this.baseURL = baseURL;
  }

  /**
   * Normalize error response to user-friendly message
   */
  private normalizeError(
    status: number,
    errorData: ApiResponse
  ): string {
    // Validation errors (400)
    if (status === 400 && errorData.errors) {
      const firstError = Object.values(errorData.errors)[0]?.[0];
      return firstError || errorData.error || "Validation failed";
    }

    // Standard error message
    if (errorData.error) {
      return errorData.error;
    }

    // Fallback to status-based messages
    switch (status) {
      case 401:
        return "Authentication required. Please login again.";
      case 403:
        return "You don't have permission to perform this action.";
      case 404:
        return "Resource not found.";
      case 409:
        return "This resource already exists.";
      case 500:
        return "Server error. Please try again later.";
      default:
        return "An error occurred. Please try again.";
    }
  }

  /**
   * Handle 401 Unauthorized - clear tokens and trigger logout
   */
  private handleUnauthorized(): void {
    tokenStorage.clearTokens();
    // Dispatch custom event for components to listen to
    window.dispatchEvent(new CustomEvent("auth:logout"));
  }

  /**
   * Core request method
   */
  private async request<T>(
    endpoint: string,
    options: RequestOptions = {}
  ): Promise<ApiResponse<T>> {
    const {
      body,
      requireAuth = true,
      headers = {},
      ...fetchOptions
    } = options;

    // Build URL
    const url = `${this.baseURL}${endpoint}`;

    // Build headers
    const requestHeaders: HeadersInit = {
      "Content-Type": "application/json",
      ...headers,
    };

    // Add authentication token if required
    if (requireAuth) {
      const token = tokenStorage.getAccessToken();
      if (token) {
        requestHeaders["Authorization"] = `Bearer ${token}`;
      }
    }

    // Prepare request body
    const requestBody = body ? JSON.stringify(body) : undefined;

    try {
      const response = await fetch(url, {
        ...fetchOptions,
        headers: requestHeaders,
        body: requestBody,
      });

      // Parse response
      let data: ApiResponse<T>;
      try {
        data = await response.json();
      } catch {
        // If response is not JSON, create error response
        data = {
          success: false,
          error: `Invalid response format (${response.status})`,
        };
      }

      // Handle 401 Unauthorized
      if (response.status === 401) {
        this.handleUnauthorized();
        throw new ApiError(
          this.normalizeError(response.status, data),
          response.status
        );
      }

      // Handle non-OK responses
      if (!response.ok) {
        throw new ApiError(
          this.normalizeError(response.status, data),
          response.status,
          data.errors
        );
      }

      // Return successful response
      return data;
    } catch (error) {
      // Re-throw ApiError as-is
      if (error instanceof ApiError) {
        throw error;
      }

      // Handle network errors
      if (error instanceof TypeError && error.message.includes("fetch")) {
        throw new ApiError(
          "Network error. Please check your connection.",
          0
        );
      }

      // Unknown error
      throw new ApiError(
        error instanceof Error ? error.message : "Unknown error occurred",
        0
      );
    }
  }

  /**
   * GET request
   */
  async get<T>(endpoint: string, options?: Omit<RequestOptions, "method" | "body">): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      ...options,
      method: "GET",
    });
  }

  /**
   * POST request
   */
  async post<T>(
    endpoint: string,
    body?: unknown,
    options?: Omit<RequestOptions, "method" | "body">
  ): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      ...options,
      method: "POST",
      body,
    });
  }

  /**
   * PUT request
   */
  async put<T>(
    endpoint: string,
    body?: unknown,
    options?: Omit<RequestOptions, "method" | "body">
  ): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      ...options,
      method: "PUT",
      body,
    });
  }

  /**
   * PATCH request
   */
  async patch<T>(
    endpoint: string,
    body?: unknown,
    options?: Omit<RequestOptions, "method" | "body">
  ): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      ...options,
      method: "PATCH",
      body,
    });
  }

  /**
   * DELETE request
   */
  async delete<T>(
    endpoint: string,
    options?: Omit<RequestOptions, "method" | "body">
  ): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      ...options,
      method: "DELETE",
    });
  }
}

/**
 * Export singleton API client instance
 */
export const apiClient = new ApiClient(env.apiBaseUrl);

