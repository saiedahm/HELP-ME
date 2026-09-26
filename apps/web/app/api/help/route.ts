import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const message = typeof body?.message === "string" ? body.message.trim() : "";

    if (!message) {
      return NextResponse.json({ error: "Message is required" }, { status: 400 });
    }

    return NextResponse.json({
      ok: true,
      reply: "Danke. HELP ME hat deine Anfrage erhalten. Die intelligente Assistenz wird in der nächsten Ausbaustufe mit den KI-Diensten verbunden.",
      received: message,
    });
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
}
