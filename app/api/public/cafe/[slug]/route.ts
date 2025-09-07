import { createClient } from "@/lib/supabase/server";
import { NextRequest, NextResponse } from "next/server";
import { apiRateLimiter } from "@/lib/rate-limiter";

export async function GET(request: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  try {
    // Rate limiting check
    const rateLimitResult = apiRateLimiter.check(request);
    if (!rateLimitResult.allowed) {
      return NextResponse.json(
        {
          error: "Too many requests",
          retryAfter: Math.ceil((rateLimitResult.resetTime - Date.now()) / 1000),
        },
        {
          status: 429,
          headers: {
            "Retry-After": Math.ceil((rateLimitResult.resetTime - Date.now()) / 1000).toString(),
            "X-RateLimit-Remaining": rateLimitResult.remainingRequests.toString(),
          },
        },
      );
    }

    const supabase = await createClient();
    const slug = (await params).slug;

    if (!slug) {
      return NextResponse.json({ error: "Slug is required" }, { status: 400 });
    }

    // Get cafe details with public information only
    const { data: cafe, error: cafeError } = await supabase
      .from("cafes")
      .select("id, name, description, logo_url, currency, slug")
      .eq("slug", slug)
      .eq("is_active", true)
      .single();

    if (cafeError || !cafe) {
      return NextResponse.json({ error: "Cafe not found" }, { status: 404 });
    }

    // Get active categories for this cafe
    const { data: categories, error: categoriesError } = await supabase
      .from("categories")
      .select("id, name, description, sort_order")
      .eq("cafe_id", cafe.id)
      .eq("is_active", true)
      .order("sort_order", { ascending: true })
      .order("created_at", { ascending: true });

    if (categoriesError) {
      return NextResponse.json({ error: "Failed to fetch categories" }, { status: 500 });
    }

    // Get active products for each category
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
          console.error("Error fetching products for category", category.id, productsError);
          return { ...category, products: [] };
        }

        return { ...category, products: products || [] };
      }),
    );

    // Return public cafe menu data
    const publicCafeData = {
      cafe: {
        id: cafe.id,
        name: cafe.name,
        description: cafe.description,
        logo_url: cafe.logo_url,
        currency: cafe.currency,
        slug: cafe.slug,
      },
      categories: categoriesWithProducts,
      generated_at: new Date().toISOString(),
    };

    return NextResponse.json(publicCafeData);
  } catch (_error) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
