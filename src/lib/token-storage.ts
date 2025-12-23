/**
 * Token Storage Utility
 * 
 * Manages JWT token storage in localStorage with type safety.
 * Handles both access and refresh tokens.
 */

const ACCESS_TOKEN_KEY = "scrap_smart_access_token";
const REFRESH_TOKEN_KEY = "scrap_smart_refresh_token";

/**
 * Token storage interface
 */
interface TokenStorage {
  getAccessToken(): string | null;
  getRefreshToken(): string | null;
  setTokens(accessToken: string, refreshToken?: string): void;
  clearTokens(): void;
  hasTokens(): boolean;
}

/**
 * Get access token from storage
 */
function getAccessToken(): string | null {
  try {
    return localStorage.getItem(ACCESS_TOKEN_KEY);
  } catch (error) {
    console.error("Failed to get access token from storage:", error);
    return null;
  }
}

/**
 * Get refresh token from storage
 */
function getRefreshToken(): string | null {
  try {
    return localStorage.getItem(REFRESH_TOKEN_KEY);
  } catch (error) {
    console.error("Failed to get refresh token from storage:", error);
    return null;
  }
}

/**
 * Store access and refresh tokens
 */
function setTokens(accessToken: string, refreshToken?: string): void {
  try {
    localStorage.setItem(ACCESS_TOKEN_KEY, accessToken);
    if (refreshToken) {
      localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
    }
  } catch (error) {
    console.error("Failed to store tokens:", error);
    throw new Error("Failed to store authentication tokens");
  }
}

/**
 * Clear all tokens from storage
 */
function clearTokens(): void {
  try {
    localStorage.removeItem(ACCESS_TOKEN_KEY);
    localStorage.removeItem(REFRESH_TOKEN_KEY);
  } catch (error) {
    console.error("Failed to clear tokens from storage:", error);
  }
}

/**
 * Check if tokens exist
 */
function hasTokens(): boolean {
  return getAccessToken() !== null;
}

/**
 * Token storage API
 */
export const tokenStorage: TokenStorage = {
  getAccessToken,
  getRefreshToken,
  setTokens,
  clearTokens,
  hasTokens,
};

