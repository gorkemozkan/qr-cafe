import { createClient } from "@/lib/supabase/server";

export interface DashboardStats {
  totalCafes: number;
  totalProducts: number;
  activeProducts: number;
  totalCategories: number;
}

export class StatsRepository {
  protected readonly baseUrl = "/api/stats";

  async getDashboardStats(): Promise<DashboardStats> {
    const supabase = await createClient();

    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      throw new Error("Unauthorized");
    }

    const [{ count: totalCafes }, { count: totalCategories }, { count: totalProducts }, { count: activeProducts }] = await Promise.all([
      supabase.from("cafes").select("*", { count: "exact", head: true }).eq("user_id", user.id),
      supabase.from("categories").select("*", { count: "exact", head: true }).eq("user_id", user.id),
      supabase.from("products").select("*", { count: "exact", head: true }).eq("user_id", user.id),
      supabase.from("products").select("*", { count: "exact", head: true }).eq("user_id", user.id).eq("is_available", true),
    ]);

    return {
      totalCafes: totalCafes || 0,
      totalCategories: totalCategories || 0,
      totalProducts: totalProducts || 0,
      activeProducts: activeProducts || 0,
    };
  }
}

export const statsRepository = new StatsRepository();
