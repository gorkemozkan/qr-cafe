/** biome-ignore-all lint/suspicious/useIterableCallbackReturn: <> */

import { createServerClient } from "@supabase/ssr";
import { type NextRequest, NextResponse } from "next/server";
import { supabaseConfig } from "@/lib/env";

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  });

  const supabase = createServerClient(supabaseConfig.supabaseUrl, supabaseConfig.supabaseAnonKey, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
        supabaseResponse = NextResponse.next({
          request,
        });
        cookiesToSet.forEach(({ name, value, options }) => supabaseResponse.cookies.set(name, value, options));
      },
    },
  });

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (
    !user &&
    !request.nextUrl.pathname.startsWith("/admin/auth/login") &&
    !request.nextUrl.pathname.startsWith("/admin/auth/signup") &&
    !request.nextUrl.pathname.startsWith("/error")
  ) {
    const url = request.nextUrl.clone();
    url.pathname = "/admin/auth/login";
    return NextResponse.redirect(url);
  }

  if (request.nextUrl.pathname === "/admin/auth/login" && user) {
    const url = request.nextUrl.clone();
    url.pathname = "/admin/app/dashboard";
    return NextResponse.redirect(url);
  }

  if (request.nextUrl.pathname === "/admin/auth/signup" && user) {
    const url = request.nextUrl.clone();
    url.pathname = "/admin/app/dashboard";
    return NextResponse.redirect(url);
  }

  return supabaseResponse;
}
