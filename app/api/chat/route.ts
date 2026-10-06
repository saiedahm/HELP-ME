import { NextResponse } from "next/server";
import { mockAI } from "@/lib/ai/mock";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const message = typeof body?.message === "string" ? body.message.trim() : "";
    if (!message) return NextResponse.json({ error: "Message is required." }, { status: 400 });

    const reply = await mockAI.generateReply({
      messages: [{ role: "user", content: message }],
      context: { botName: "HELP-ME" }
    });

    return NextResponse.json({ reply, provider: "mock" });
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }
}
