export const isDevelopment = process.env.NODE_ENV === "development";
export const isProduction = process.env.NODE_ENV === "production";

export const nextEnvironment = process.env.NEXT_PUBLIC_ENV as string;

if (!nextEnvironment) {
  throw new Error("NEXT_PUBLIC_ENV is not set, please check your environment variables.");
}

export const isNextStaging = process.env.NEXT_PUBLIC_ENV === "staging";
export const isNextProduction = process.env.NEXT_PUBLIC_ENV === "production";
export const isNextDevelopment = process.env.NEXT_PUBLIC_ENV === "development";

export const getNextPublicBaseUrl = () => {
  console.log("Environment detection:", {
    NODE_ENV: process.env.NODE_ENV,
    NEXT_PUBLIC_ENV: process.env.NEXT_PUBLIC_ENV,
    isNextProduction,
    isNextStaging,
    isNextDevelopment,
    rawChecks: {
      prod: process.env.NEXT_PUBLIC_ENV === "production",
      staging: process.env.NEXT_PUBLIC_ENV === "staging",
      dev: process.env.NEXT_PUBLIC_ENV === "development",
    },
  });

  if (isNextProduction) {
    console.log("DETECTED: Production environment detected");
    const url = process.env.NEXT_PUBLIC_BASE_URL_PROD;
    console.log("Using production URL:", url);
    if (!url) {
      throw new Error("NEXT_PUBLIC_BASE_URL_PROD environment variable is not set");
    }
    return url;
  }

  if (isNextStaging) {
    console.log("DETECTED: Staging environment detected");
    const url = process.env.NEXT_PUBLIC_BASE_URL_STAGING;
    console.log("Using staging URL:", url);
    if (!url) {
      throw new Error("NEXT_PUBLIC_BASE_URL_STAGING environment variable is not set");
    }
    return url;
  }

  if (isNextDevelopment) {
    console.log("DETECTED: Development environment detected");
    const url = process.env.NEXT_PUBLIC_APP_URL;
    console.log("Using development URL:", url);
    if (!url) {
      throw new Error("NEXT_PUBLIC_APP_URL environment variable is not set");
    }
    return url;
  }

  console.log("WARNING: No environment detected, falling back to development");
  const fallbackUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
  console.log("Using fallback URL:", fallbackUrl);
  return fallbackUrl;
};

export const getSupabaseEnvironment = () => {
  const environments = {
    main: {
      environment: "production" as const,
      supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL_PROD,
      supabaseAnonKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY_PROD,
    },
    staging: {
      environment: "staging" as const,
      supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL_STAGING,
      supabaseAnonKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY_STAGING,
    },
    development: {
      environment: "development" as const,
      supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL,
      supabaseAnonKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    },
  };

  const environmentConfig = isNextProduction
    ? environments.main
    : isNextStaging
      ? environments.staging
      : isNextDevelopment
        ? environments.development
        : environments.development;

  if (!environmentConfig.supabaseUrl || !environmentConfig.supabaseAnonKey) {
    throw new Error(`
      Supabase configuration is missing. Please check your environment variables.
      - Environment: ${environmentConfig.environment}
      - Supabase URL: ${environmentConfig.supabaseUrl}
      - Supabase Anon Key: ${environmentConfig.supabaseAnonKey}
    `);
  }

  return {
    supabaseUrl: environmentConfig.supabaseUrl,
    environment: environmentConfig.environment,
    supabaseAnonKey: environmentConfig.supabaseAnonKey,
  };
};

export const nextPublicBaseUrl = getNextPublicBaseUrl();

export const supabaseConfig = getSupabaseEnvironment();
