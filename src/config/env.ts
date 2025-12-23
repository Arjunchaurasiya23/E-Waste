/**
 * Environment Configuration
 * 
 * Centralized access to environment variables with validation and defaults.
 * All environment variables must be prefixed with VITE_ to be accessible in the frontend.
 */

interface EnvConfig {
  apiBaseUrl: string;
  env: "development" | "production";
}

/**
 * Validates and returns environment configuration
 */
function getEnvConfig(): EnvConfig {
  const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || "http://localhost:3000/api";
  const env = (import.meta.env.VITE_ENV || "development") as "development" | "production";

  // Validate API URL format in production
  if (env === "production" && !apiBaseUrl.startsWith("https://")) {
    console.warn(
      "⚠️  Production API URL should use HTTPS. Current:",
      apiBaseUrl
    );
  }

  return {
    apiBaseUrl,
    env,
  };
}

export const env = getEnvConfig();

/**
 * Check if running in development mode
 */
export const isDevelopment = env.env === "development";

/**
 * Check if running in production mode
 */
export const isProduction = env.env === "production";

