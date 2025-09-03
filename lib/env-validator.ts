/**
 * Environment variable validation to ensure all required variables are present
 */

interface EnvConfig {
  // Supabase
  NEXT_PUBLIC_SUPABASE_URL?: string;
  NEXT_PUBLIC_SUPABASE_ANON_KEY?: string;
  NEXT_PUBLIC_SUPABASE_URL_PROD?: string;
  NEXT_PUBLIC_SUPABASE_ANON_KEY_PROD?: string;
  NEXT_PUBLIC_SUPABASE_URL_STAGING?: string;
  NEXT_PUBLIC_SUPABASE_ANON_KEY_STAGING?: string;

  // Turnstile
  NEXT_PUBLIC_TURNSTILE_SITE_KEY?: string;
  TURNSTILE_SECRET_KEY?: string;

  // Environment
  NEXT_PUBLIC_ENV?: string;
  NODE_ENV?: string;

  // Optional
  ALLOWED_ORIGINS?: string;
}

/**
 * Validate required environment variables based on the current environment
 */
export function validateEnvironmentVariables(): void {
  const env = process.env.NEXT_PUBLIC_ENV || "development";
  const errors: string[] = [];

  // Common required variables
  if (!process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY) {
    errors.push("NEXT_PUBLIC_TURNSTILE_SITE_KEY is required");
  }

  if (!process.env.TURNSTILE_SECRET_KEY) {
    errors.push("TURNSTILE_SECRET_KEY is required");
  }

  // Environment-specific Supabase variables
  switch (env) {
    case "production":
      if (!process.env.NEXT_PUBLIC_SUPABASE_URL_PROD) {
        errors.push("NEXT_PUBLIC_SUPABASE_URL_PROD is required for production");
      }
      if (!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY_PROD) {
        errors.push("NEXT_PUBLIC_SUPABASE_ANON_KEY_PROD is required for production");
      }
      break;

    case "staging":
      if (!process.env.NEXT_PUBLIC_SUPABASE_URL_STAGING) {
        errors.push("NEXT_PUBLIC_SUPABASE_URL_STAGING is required for staging");
      }
      if (!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY_STAGING) {
        errors.push("NEXT_PUBLIC_SUPABASE_ANON_KEY_STAGING is required for staging");
      }
      break;

    default: // development
      if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
        errors.push("NEXT_PUBLIC_SUPABASE_URL is required for development");
      }
      if (!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
        errors.push("NEXT_PUBLIC_SUPABASE_ANON_KEY is required for development");
      }
      break;
  }

  if (errors.length > 0) {
    throw new Error(`Environment validation failed:\n${errors.join("\n")}`);
  }
}

/**
 * Get validated environment configuration
 */
export function getEnvConfig(): Required<Pick<EnvConfig, "NODE_ENV" | "NEXT_PUBLIC_ENV">> {
  validateEnvironmentVariables();

  return {
    NODE_ENV: process.env.NODE_ENV || "development",
    NEXT_PUBLIC_ENV: process.env.NEXT_PUBLIC_ENV || "development",
  };
}
