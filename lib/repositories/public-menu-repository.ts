import { createClient } from "@/lib/supabase/server";

interface PublicProduct {
  id: number;
  name: string;
  description: string | null;
  price: number | null;
  image_url: string | null;
  is_available: boolean;
}

interface PublicCategory {
  id: number;
  name: string;
  description: string;
  sort_order: number | null;
  products: PublicProduct[];
}

interface PublicCafe {
  id: number;
  name: string;
  description: string | null;
  logo_url: string | null;
  currency: string | null;
  slug: string;
}

export interface PublicMenuData {
  cafe: PublicCafe;
  categories: PublicCategory[];
  generated_at: string;
}

export class PublicMenuRepository {
  async getMenuBySlugDirect(slug: string): Promise<PublicMenuData | null> {
    const supabase = await createClient();

    // Fetch cafe data
    const { data: cafe, error: cafeError } = await supabase
      .from("cafes")
      .select("id, name, description, logo_url, currency, slug")
      .eq("slug", slug)
      .eq("is_active", true)
      .single();

    if (cafeError || !cafe) {
      return null;
    }

    // Fetch categories
    const { data: categories, error: categoriesError } = await supabase
      .from("categories")
      .select("id, name, description, sort_order")
      .eq("cafe_id", cafe.id)
      .eq("is_active", true)
      .order("sort_order", { ascending: true })
      .order("created_at", { ascending: true });

    if (categoriesError) {
      return null;
    }

    // Get products for each category
    const categoriesWithProducts = await Promise.all(
      categories.map(async (category) => {
        const { data: products, error: productsError } = await supabase
          .from("products")
          .select("id, name, description, price, image_url, is_available")
          .eq("category_id", category.id)
          .eq("cafe_id", cafe.id)
          .eq("is_available", true)
          .order("created_at", { ascending: true });

        if (productsError) {
          return { ...category, products: [] };
        }

        return { ...category, products: products || [] };
      }),
    );

    return {
      cafe,
      categories: categoriesWithProducts,
      generated_at: new Date().toISOString(),
    };
  }
}

export const publicMenuRepository = new PublicMenuRepository();
