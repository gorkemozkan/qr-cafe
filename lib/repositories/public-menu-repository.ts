import { createClient } from "@/lib/supabase/server";
import { Tables } from "@/types/db";

interface PublicCategory extends Tables<"categories"> {
  products: Tables<"products">[];
}

interface PublicMenuData {
  cafe: Tables<"cafes">;
  categories: PublicCategory[];
}

export class PublicMenuRepository {
  async getMenuBySlug(slug: string): Promise<PublicMenuData | null> {
    try {
      const supabase = await createClient();

      // Get cafe by slug
      const { data: cafe, error: cafeError } = await supabase.from("cafes").select("*").eq("slug", slug).eq("is_active", true).single();

      if (cafeError || !cafe) {
        return null;
      }

      // Get categories for the cafe
      const { data: categories, error: categoriesError } = await supabase
        .from("categories")
        .select("*")
        .eq("cafe_id", cafe.id)
        .eq("is_active", true)
        .order("sort_order", { ascending: true })
        .order("created_at", { ascending: false });

      if (categoriesError) {
        return null;
      }

      // Get products for the cafe (including out-of-stock items for display)
      const { data: products, error: productsError } = await supabase
        .from("products")
        .select("*")
        .eq("cafe_id", cafe.id)
        .order("is_available", { ascending: false })
        .order("created_at", { ascending: false });

      if (productsError) {
        return null;
      }

      // Group products by category
      const categoriesWithProducts: PublicCategory[] = (categories || []).map((category) => ({
        ...category,
        products: (products || []).filter((product) => product.category_id === category.id),
      }));

      return {
        cafe,
        categories: categoriesWithProducts,
      };
    } catch (_error) {
      return null;
    }
  }
}

export const publicMenuRepository = new PublicMenuRepository();
