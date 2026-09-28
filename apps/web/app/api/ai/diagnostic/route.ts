import { NextResponse } from "next/server";
import OpenAI from "openai";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function safeDetail(error: unknown) {
  const message = error instanceof Error ? error.message : String(error ?? "Unknown error");
  return message.replace(/sk-[A-Za-z0-9_-]+/g, "[redacted]").slice(0, 500);
}

export async function GET() {
  const apiKey = process.env.OPENAI_API_KEY;
  const model = "gpt-5.6-luna";

  if (!apiKey) {
    return NextResponse.json({ ok: false, stage: "configuration", error: "OPENAI_API_KEY is missing" }, { status: 503 });
  }

  try {
    const client = new OpenAI({ apiKey, maxRetries: 0 });
    const response = await client.responses.create({
      model,
      input: "Reply with exactly: HELP-ME OK",
    });

    return NextResponse.json({
      ok: true,
      stage: "openai",
      model,
      response: response.output_text?.trim() || null,
    });
  } catch (error) {
    return NextResponse.json({
      ok: false,
      stage: "openai",
      model,
      error: safeDetail(error),
    }, { status: 503 });
  }
}
