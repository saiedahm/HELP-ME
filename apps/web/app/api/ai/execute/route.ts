import { NextResponse } from "next/server";
import { executeAI } from "@/lib/ai/openai";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const input = typeof body?.input === "string" ? body.input.trim() : "";
    const language = typeof body?.language === "string" ? body.language : "de";

    if (!input) return NextResponse.json({ error: "Input is required" }, { status: 400 });
    if (input.length > 12000) return NextResponse.json({ error: "Input is too long" }, { status: 413 });

    const result = await executeAI(input, language);
    return NextResponse.json({ ok: true, ...result });
  } catch (error) {
    console.error("HELP-ME AI execution error:", error);
    return NextResponse.json({ error: "AI service is temporarily unavailable" }, { status: 503 });
  }
}
