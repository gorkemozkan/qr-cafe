interface SupabaseConfig {
  supabaseUrl: string;
  supabaseAnonKey: string;
  environment: string;
}

function getSupabaseConfig(): SupabaseConfig {
  // Determine environment based on available variables
  const branch =
    process.env.GITHUB_REF_NAME || // GitHub Actions
    process.env.VERCEL_GIT_COMMIT_REF || // Vercel
    (process.env.NODE_ENV === "production" ? "main" : "development"); // Fallback

  console.log("BRANCH =>", branch);

  // Simple environment mapping
  let environment: string;
  let supabaseUrl: string | undefined;
  let supabaseAnonKey: string | undefined;

  if (branch === "main") {
    environment = "production";
    supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL_PROD;
    supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY_PROD;
  } else if (branch === "staging") {
    environment = "staging";
    supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL_STAGING;
    supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY_STAGING;
  } else {
    environment = "development";
    supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  }

  console.log("ENVIRONMENT =>", environment);

  // Validate required environment variables
  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error(
      `${environment} Supabase configuration is missing. Please check your environment variables.`,
    );
  }

  const config: SupabaseConfig = {
    supabaseUrl,
    supabaseAnonKey,
    environment,
  };

  console.log("FINAL CONFIG =>", config);
  return config;
}

export const supabaseConfig = getSupabaseConfig();
