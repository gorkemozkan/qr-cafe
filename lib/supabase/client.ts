import { Database } from "@/types/db";
import { createBrowserClient } from "@supabase/ssr";
import { supabaseConfig } from "@/lib/env";

export const createClient = () =>
  createBrowserClient<Database>(supabaseConfig.supabaseUrl, supabaseConfig.supabaseAnonKey);
