import { NextResponse } from "next/server";
import { prisma } from "@/lib/db/client";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const publicKey = String(body?.publicKey ?? "");
    const conversationId = String(body?.conversationId ?? "");
    if (!publicKey || !conversationId) return NextResponse.json({ error: "Chatbot and conversation are required." }, { status: 400 });

    const chatbot = await prisma.chatbot.findFirst({ where: { publicKey, status: "ACTIVE" }, select: { id: true, organizationId: true } });
    if (!chatbot) return NextResponse.json({ error: "Chatbot unavailable." }, { status: 404 });

    const conversation = await prisma.conversation.findFirst({ where: { id: conversationId, chatbotId: chatbot.id, organizationId: chatbot.organizationId } });
    if (!conversation) return NextResponse.json({ error: "Conversation not found." }, { status: 404 });

    await prisma.conversation.update({ where: { id: conversation.id }, data: { status: "HANDED_OFF", handoffRequestedAt: new Date() } });
    return NextResponse.json({ ok: true, status: "HANDED_OFF" });
  } catch (error) {
    console.error("HELP-ME handoff error:", error);
    return NextResponse.json({ error: "Unable to request a human agent." }, { status: 500 });
  }
}
