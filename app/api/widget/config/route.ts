import { NextResponse } from "next/server";
import { prisma } from "@/lib/db/client";

export async function GET(request: Request) {
  const publicKey = new URL(request.url).searchParams.get("bot")?.trim();
  if (!publicKey) return NextResponse.json({ error: "Bot key is required." }, { status: 400 });
  const chatbot = await prisma.chatbot.findFirst({
    where: { publicKey, status: "ACTIVE" },
    select: { publicKey: true, name: true, welcomeMessage: true, primaryColor: true, logoUrl: true },
  });
  if (!chatbot) return NextResponse.json({ error: "Chatbot unavailable." }, { status: 404 });
  return NextResponse.json({ chatbot }, { headers: { "Cache-Control": "public, max-age=60" } });
}
