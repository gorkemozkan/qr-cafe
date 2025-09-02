import { cafeRepository } from "@/lib/repositories/cafe-repository";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const result = await cafeRepository.list();

    if (!result.success) {
      return NextResponse.json({ error: result.error }, { status: 500 });
    }

    return NextResponse.json({ cafes: result.data });
  } catch (error) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
