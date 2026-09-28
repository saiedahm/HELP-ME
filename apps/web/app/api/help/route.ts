import { NextRequest, NextResponse } from "next/server";
import { executeAI } from "../../../lib/ai/openai";
import { saveHelpRequest } from "../../../lib/help/store";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const MAX_MESSAGE_LENGTH = 5000;
const MAX_LOCALE_LENGTH = 32;

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

    if (!message) {
      return NextResponse.json({ error: "Message is required" }, { status: 400 });
    }

    if (message.length > MAX_MESSAGE_LENGTH) {
      return NextResponse.json(
        { error: `Message must not exceed ${MAX_MESSAGE_LENGTH} characters` },
        { status: 400 },
      );
    }

    // Get the AI answer first. We only persist a request after a successful
    // answer so the UI never shows a sent-but-unanswered request as success.
    const result = await executeAI(message, locale || "de");
    const requestRecord = await saveHelpRequest({
      message,
      locale: locale || "de",
    });

    return NextResponse.json({
      ok: true,
      received: true,
      requestId: requestRecord.id,
      locale: locale || "de",
      reply: result.answer,
      provider: "openai",
      model: process.env.OPENAI_MODEL || "gpt-5-mini",
      agents: result.agents,
    });
  } catch (error) {
    console.error("HELP ME request failed", error);

    const message = error instanceof Error ? error.message : "Unknown AI error";
    const isConfigError = /OPENAI_API_KEY|OPENAI_MODEL|credential/i.test(message);

    return NextResponse.json(
      {
        error: isConfigError
          ? "HELP ME AI is not configured correctly yet."
          : "HELP ME AI could not answer this request right now.",
      },
      { status: 503 },
    );
  }
}
