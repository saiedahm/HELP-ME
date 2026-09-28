import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET() {
  return NextResponse.json({
    ok: true,
    service: "help-me-web",
    status: "operational",
    openaiConfigured: Boolean(process.env.OPENAI_API_KEY),
    openaiModel: process.env.OPENAI_MODEL || "gpt-5-mini",
    timestamp: new Date().toISOString(),
  });
}
