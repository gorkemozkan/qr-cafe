import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { verifyCsrfToken } from "@/lib/security";

export async function POST(request: NextRequest) {
  try {
    if (!verifyCsrfToken(request)) {
      return NextResponse.json({ error: "Invalid request origin" }, { status: 403 });
    }

    const supabase = await createClient();

    await supabase.auth.signOut();

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (_error) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
