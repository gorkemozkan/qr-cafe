import { createBrowserClient } from "@supabase/ssr";
import { supabaseConfig } from "@/lib/env";
import { Database } from "@/types/db";

export const createClient = () => createBrowserClient<Database>(supabaseConfig.supabaseUrl, supabaseConfig.supabaseAnonKey);
