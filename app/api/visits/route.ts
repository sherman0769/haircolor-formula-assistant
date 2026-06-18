import { NextResponse } from "next/server";
import {
  getHomepageVisitCount,
  hasVisitCounterConfig,
  incrementHomepageVisitCount,
} from "@/lib/visit-counter";

export const dynamic = "force-dynamic";

function buildVisitResponse(count: number | null) {
  return NextResponse.json(
    {
      configured: hasVisitCounterConfig(),
      count,
    },
    {
      headers: {
        "Cache-Control": "no-store",
      },
    },
  );
}

export async function GET() {
  return buildVisitResponse(await getHomepageVisitCount());
}

export async function POST() {
  return buildVisitResponse(await incrementHomepageVisitCount());
}
