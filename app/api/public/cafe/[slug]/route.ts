import { NextRequest, NextResponse } from "next/server";
import { http } from "@/lib/http";
import { publicRateLimiter } from "@/lib/rate-limiter";
import { getCacheKeys, redis } from "@/lib/redis";
import { createClient } from "@/lib/supabase/server";

export async function GET(request: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  try {
    const rateLimitResult = publicRateLimiter.check(request);

    console.log("rateLimitResult", rateLimitResult);

    if (!rateLimitResult.allowed) {
      return NextResponse.json(
        {
          error: http.TOO_MANY_REQUESTS.message,
          retryAfter: Math.ceil((rateLimitResult.resetTime - Date.now()) / 1000),
        },
        {
          status: http.TOO_MANY_REQUESTS.status,
        },
      );
    }

    const { slug } = await params;

    console.log("slug", slug);

    if (!slug) {
      return NextResponse.json({ error: "Slug is required" }, { status: http.BAD_REQUEST.status });
    }

    const supabase = await createClient();

    const cacheKey = getCacheKeys.publicCafe(slug);

    try {
      const cachedData = await redis.get(cacheKey);

      console.log("cachedData", cachedData);

      if (cachedData && typeof cachedData === "string") {
        return NextResponse.json(JSON.parse(cachedData));
      }
    } catch (cacheError) {
      console.warn("Redis cache read failed:", cacheError);
    }

    const { data: cafe, error: cafeError } = await supabase
      .from("cafes")
      .select("id, name, description, logo_url, currency, slug")
      .eq("slug", slug)
      .eq("is_active", true)
      .single();

    console.log("cafe", cafe);

    if (cafeError) {
      console.error("Cafe fetch error:", cafeError);
      return NextResponse.json(
        {
          error: "Database error while fetching cafe",
          details: cafeError.message,
        },
        { status: http.INTERNAL_SERVER_ERROR.status },
      );
    }

    if (!cafe) {
      return NextResponse.json({ error: "Cafe not found" }, { status: http.NOT_FOUND.status });
    }

    const [categoriesResult, productsResult] = await Promise.all([
      supabase
        .from("categories")
        .select("id, name, description, sort_order, image_url")
        .eq("cafe_id", cafe.id)
        .eq("is_active", true)
        .order("sort_order", { ascending: true })
        .order("created_at", { ascending: true }),
      supabase
        .from("products")
        .select("id, name, description, price, image_url, is_available, category_id")
        .eq("cafe_id", cafe.id)
        .eq("is_available", true)
        .order("created_at", { ascending: true }),
    ]);

    console.log("categoriesResult", categoriesResult);
    console.log("productsResult", productsResult);

    if (categoriesResult.error) {
      console.error("Categories fetch error:", categoriesResult.error);
      return NextResponse.json(
        {
          error: "Database error while fetching categories",
          details: categoriesResult.error.message,
        },
        { status: http.INTERNAL_SERVER_ERROR.status },
      );
    }

    if (productsResult.error) {
      console.error("Products fetch error:", productsResult.error);
      return NextResponse.json(
        {
          error: "Database error while fetching products",
          details: productsResult.error.message,
        },
        { status: http.INTERNAL_SERVER_ERROR.status },
      );
    }

    const productsByCategory = (productsResult.data || []).reduce(
      (acc, { category_id, ...product }) => {
        if (!acc[category_id]) acc[category_id] = [];
        acc[category_id].push(product);
        return acc;
      },
      {} as Record<string, any[]>,
    );
    console.log("productsByCategory", productsByCategory);

    const categoriesWithProducts = (categoriesResult.data || []).map((category) => ({
      ...category,
      products: productsByCategory[category.id] || [],
    }));

    console.log("categoriesWithProducts", categoriesWithProducts);

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

    console.log("publicCafeData", publicCafeData);

    try {
      await redis.setex(cacheKey, 900, JSON.stringify(publicCafeData));
    } catch (cacheError) {
      console.warn("Redis cache write failed:", cacheError);
    }

    return NextResponse.json(publicCafeData);
  } catch (error) {
    console.error("Public cafe API error:", error);

    if (error instanceof Error) {
      if (error.message.includes("NEXT_PUBLIC")) {
        return NextResponse.json(
          {
            error: "Configuration error",
            details: "Environment variables not properly configured",
          },
          { status: http.INTERNAL_SERVER_ERROR.status },
        );
      }

      if (error.message.includes("Redis")) {
        return NextResponse.json(
          {
            error: "Cache service unavailable",
            details: "Menu data may load slower than usual",
          },
          { status: http.INTERNAL_SERVER_ERROR.status },
        );
      }

      if (error.message.includes("Supabase")) {
        return NextResponse.json(
          {
            error: "Database connection error",
            details: "Unable to fetch menu data",
          },
          { status: http.INTERNAL_SERVER_ERROR.status },
        );
      }
    }

    return NextResponse.json(
      {
        error: "Internal server error",
        details: error instanceof Error ? error.message : "Unknown error occurred",
      },
      { status: http.INTERNAL_SERVER_ERROR.status },
    );
  }
}
