import { NextRequest, NextResponse } from "next/server";
import { http } from "@/lib/http";
import { publicRateLimiter } from "@/lib/rate-limiter";
import { getCacheKeys, redis } from "@/lib/redis";
import { createClient } from "@/lib/supabase/server";
import { isDevelopment } from "@/lib/env";

export async function GET(request: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  try {
    const rateLimitResult = publicRateLimiter.check(request);

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

    if (!slug) {
      return NextResponse.json({ error: "Slug is required" }, { status: http.BAD_REQUEST.status });
    }

    const supabase = await createClient();

    const cacheKey = getCacheKeys.publicCafe(slug);

    try {
      const cachedData = await redis.get(cacheKey);

      if (cachedData && typeof cachedData === "string") {
        return NextResponse.json(JSON.parse(cachedData));
      }
    } catch (_error) {}

    const { data: cafe, error: cafeError } = await supabase
      .from("cafes")
      .select("id, name, description, logo_url, currency, slug")
      .eq("slug", slug)
      .eq("is_active", true)
      .single();

    if (cafeError) {
      return NextResponse.json(
        {
          error: "Unable to fetch cafe information",
          ...(isDevelopment && { details: cafeError.message }),
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
        .select("id, name, description, price, image_url, is_available, category_id, calory, preparation_time, tags")
        .eq("cafe_id", cafe.id)
        .eq("is_available", true)
        .order("created_at", { ascending: true }),
    ]);

    if (categoriesResult.error) {
      return NextResponse.json(
        {
          error: "Unable to fetch menu categories",
          ...(isDevelopment && { details: categoriesResult.error.message }),
        },
        { status: http.INTERNAL_SERVER_ERROR.status },
      );
    }

    if (productsResult.error) {
      return NextResponse.json(
        {
          error: "Unable to fetch menu products",
          ...(isDevelopment && { details: productsResult.error.message }),
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

    const categoriesWithProducts = (categoriesResult.data || []).map((category) => ({
      ...category,
      products: productsByCategory[category.id] || [],
    }));

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

    try {
      await redis.setex(cacheKey, 900, JSON.stringify(publicCafeData));
    } catch (_error) {}

    return NextResponse.json(publicCafeData);
  } catch (error) {
    if (error instanceof Error) {
      if (error.message.includes("NEXT_PUBLIC")) {
        return NextResponse.json(
          {
            error: "Configuration error",
            ...(isDevelopment && { details: "Environment variables not properly configured" }),
          },
          { status: http.INTERNAL_SERVER_ERROR.status },
        );
      }

      if (error.message.includes("Redis")) {
        return NextResponse.json(
          {
            error: "Cache service temporarily unavailable",
            ...(isDevelopment && { details: "Redis connection failed" }),
          },
          { status: http.INTERNAL_SERVER_ERROR.status },
        );
      }

      if (error.message.includes("Supabase")) {
        return NextResponse.json(
          {
            error: "Unable to fetch menu data",
            ...(isDevelopment && { details: "Database connection failed" }),
          },
          { status: http.INTERNAL_SERVER_ERROR.status },
        );
      }
    }

    return NextResponse.json(
      {
        error: "Internal server error",
        ...(isDevelopment && { details: error instanceof Error ? error.message : "Unknown error occurred" }),
      },
      { status: http.INTERNAL_SERVER_ERROR.status },
    );
  }
}
