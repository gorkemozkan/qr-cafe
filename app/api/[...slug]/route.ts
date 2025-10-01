import { http } from "@/lib/http";
import { checkApiRateLimit } from "@/lib/rate-limiter-redis";
import { NextRequest, NextResponse } from "next/server";

const handleApiRequest = async (request: NextRequest) => {
  const rateLimitResult = await checkApiRateLimit(request);

  if (!rateLimitResult.allowed) {
    return NextResponse.json(
      {
        message: http.TOO_MANY_REQUESTS_MESSAGE.message,
      },
      {
        status: http.TOO_MANY_REQUESTS_MESSAGE.status,
      },
    );
  }

  return NextResponse.json(
    {
      message: http.NOT_FOUND.message,
    },
    {
      status: http.NOT_FOUND.status,
      headers: {
        "X-Content-Type-Options": "nosniff",
        "X-Frame-Options": "DENY",
        "Cache-Control": "no-store, no-cache, must-revalidate",
      },
    },
  );
};

export async function GET(request: NextRequest) {
  return handleApiRequest(request);
}

export async function POST(request: NextRequest) {
  return handleApiRequest(request);
}

export async function PUT(request: NextRequest) {
  return handleApiRequest(request);
}

export async function DELETE(request: NextRequest) {
  return handleApiRequest(request);
}

export async function PATCH(request: NextRequest) {
  return handleApiRequest(request);
}

export async function HEAD(request: NextRequest) {
  return handleApiRequest(request);
}

export async function OPTIONS(request: NextRequest) {
  return handleApiRequest(request);
}
