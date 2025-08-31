import { createBrowserClient } from "@supabase/ssr";
import { supabaseConfig } from "./config";
import { Database } from "@/types/db";

export const createClient = () =>
  createBrowserClient<Database>(
    supabaseConfig.supabaseUrl,
    supabaseConfig.supabaseAnonKey,
  );
