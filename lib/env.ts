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
  /*  if (!process.env.NEXT_PUBLIC_BASE_URL_PROD || !process.env.NEXT_PUBLIC_BASE_URL_STAGING) {
    throw new Error("NEXT_PUBLIC_BASE_URL_PROD or NEXT_PUBLIC_BASE_URL_STAGING are not set, please check your environment variables.");
  } */

  if (isNextProduction) {
    return process.env.NEXT_PUBLIC_BASE_URL_PROD;
  }

  if (isNextStaging) {
    return process.env.NEXT_PUBLIC_BASE_URL_STAGING;
  }
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

console.log(nextPublicBaseUrl);

console.log(supabaseConfig);
