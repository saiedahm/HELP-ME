import { NextRequest, NextResponse } from "next/server";
import { generateAiReply } from "../../../lib/ai/provider";

export const dynamic = "force-dynamic";

const MAX_MESSAGE_LENGTH = 5000;

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const message = typeof body?.message === "string" ? body.message.trim() : "";

    if (!message) {
      return NextResponse.json({ error: "Message is required" }, { status: 400 });
    }

    if (message.length > MAX_MESSAGE_LENGTH) {
      return NextResponse.json(
        { error: `Message must not exceed ${MAX_MESSAGE_LENGTH} characters` },
        { status: 400 },
      );
    }

    const result = await generateAiReply([
      {
        role: "system",
        content:
          "Du bist der HELP ME Assistent. Antworte klar, freundlich und hilfreich. Behaupte nicht, eine Aktion ausgeführt zu haben, wenn sie nicht tatsächlich ausgeführt wurde.",
      },
      { role: "user", content: message },
    ]);

    return NextResponse.json({
      ok: true,
      received: true,
      reply: result.content,
      provider: result.provider,
      model: result.model,
      nextStep: "ai-processing",
    });
  } catch (error) {
    console.error("HELP ME AI request failed", error);
    return NextResponse.json(
      { error: "The AI service is temporarily unavailable" },
      { status: 503 },
    );
  }
}
