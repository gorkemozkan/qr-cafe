import { NextResponse, type NextRequest } from "next/server";
import createIntlMiddleware from "next-intl/middleware";
import { updateSession } from "@/lib/supabase/middleware";
import { locales, defaultLocale } from "./i18n";

createIntlMiddleware({
  locales,
  defaultLocale,
  localeDetection: false, // We'll handle locale detection via cookies
});

export async function middleware(request: NextRequest) {
  const locale = request.cookies.get("locale")?.value || defaultLocale;

  const requestHeaders = new Headers(request.headers);

  requestHeaders.set("x-locale", locale);

  if (request.nextUrl.pathname.split("/")[1].startsWith("admin")) {
    const response = await updateSession(request);

    if (response) {
      response.headers.set("x-locale", locale);
    }

    return response;
  }

  const response = NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  });

  if (!request.cookies.get("locale")) {
    response.cookies.set("locale", defaultLocale, {
      maxAge: 365 * 24 * 60 * 60,
      httpOnly: false,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
    });
  }

  return response;
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)"],
};
