interface SupabaseConfig {
  supabaseUrl: string;
  supabaseAnonKey: string;
  environment: string;
}

function getSupabaseConfig(): SupabaseConfig {
  const branch = process.env.GITHUB_REF_NAME;

  const envMap = {
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

  const config =
    branch === "main"
      ? envMap.main
      : branch === "staging"
        ? envMap.staging
        : envMap.development;

  // Check for missing environment variables before creating the config
  if (!config.supabaseUrl || !config.supabaseAnonKey) {
    throw new Error(
      `${config.environment} Supabase configuration is missing. Please check your environment variables.`,
    );
  }

  const finalConfig: SupabaseConfig = {
    supabaseUrl: config.supabaseUrl,
    environment: config.environment,
    supabaseAnonKey: config.supabaseAnonKey,
  };

  return finalConfig;
}

export const supabaseConfig = getSupabaseConfig();
