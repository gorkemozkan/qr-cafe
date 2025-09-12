import { NextResponse } from "next/server";
import { getNextPublicBaseUrl } from "@/lib/env";

export async function GET() {
  const env = {
    NODE_ENV: process.env.NODE_ENV,
    NEXT_PUBLIC_ENV: process.env.NEXT_PUBLIC_ENV,
    NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL,
    NEXT_PUBLIC_BASE_URL_PROD: process.env.NEXT_PUBLIC_BASE_URL_PROD,
    NEXT_PUBLIC_BASE_URL_STAGING: process.env.NEXT_PUBLIC_BASE_URL_STAGING,
  };

  console.log("Debug environment:", env);

  // This will trigger the debug logging in getNextPublicBaseUrl
  const baseUrl = getNextPublicBaseUrl();
  console.log("Resolved base URL:", baseUrl);

  return NextResponse.json({ ...env, resolvedBaseUrl: baseUrl });
}
