import { NextRequest, NextResponse } from "next/server";
import { executeAI } from "../../../lib/ai/openai";
import { saveHelpRequest } from "../../../lib/help/store";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const MAX_MESSAGE_LENGTH = 5000;
const MAX_LOCALE_LENGTH = 32;

function safeErrorDetail(error: unknown): string {
  const raw = error instanceof Error ? error.message : String(error || "Unknown error");
  return raw
    .replace(/sk-[A-Za-z0-9_-]+/g, "[redacted-key]")
    .replace(/Bearer\s+[A-Za-z0-9._-]+/gi, "Bearer [redacted]")
    .slice(0, 500);
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json().catch(() => null);

    if (!body || typeof body !== "object") {
      return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
    }

    const message = typeof body.message === "string" ? body.message.trim() : "";
    const locale =
      typeof body.locale === "string"
        ? body.locale.trim().slice(0, MAX_LOCALE_LENGTH)
        : "de";

    if (!message) return NextResponse.json({ error: "Message is required" }, { status: 400 });
    if (message.length > MAX_MESSAGE_LENGTH) {
      return NextResponse.json(
        { error: `Message must not exceed ${MAX_MESSAGE_LENGTH} characters` },
        { status: 400 },
      );
    }

    const result = await executeAI(message, locale || "de");

    let requestId: string | undefined;
    try {
      requestId = (await saveHelpRequest({ message, locale: locale || "de" })).id;
    } catch (storageError) {
      console.error("HELP ME storage failed after successful AI response", storageError);
    }

    return NextResponse.json({
      ok: true,
      received: true,
      requestId,
      locale: locale || "de",
      reply: result.answer,
      provider: "openai",
      model: process.env.OPENAI_MODEL || "gpt-5.6-luna",
      agents: result.agents,
    });
  } catch (error) {
    const detail = safeErrorDetail(error);
    console.error("HELP ME AI request failed:", detail);

    return NextResponse.json(
      {
        error: "HELP ME AI could not answer this request right now.",
        detail,
      },
      { status: 503 },
    );
  }
}
