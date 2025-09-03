import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const cspReport = await request.json();

    // Log CSP violations for monitoring (remove in production or send to logging service)
    console.error("CSP Violation:", {
      timestamp: new Date().toISOString(),
      "user-agent": request.headers.get("user-agent"),
      report: cspReport,
    });

    // In production, you might want to send this to a logging service
    // like Sentry, DataDog, or similar instead of console.error

    return NextResponse.json({ received: true }, { status: 204 });
  } catch (_error) {
    return NextResponse.json({ error: "Invalid CSP report" }, { status: 400 });
  }
}
