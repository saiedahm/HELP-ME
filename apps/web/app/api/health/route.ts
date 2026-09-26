import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET() {
  return NextResponse.json({
    ok: true,
    service: "help-me-web",
    status: "operational",
    timestamp: new Date().toISOString(),
  });
}
