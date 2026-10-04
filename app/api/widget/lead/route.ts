import { NextResponse } from "next/server";
import { prisma } from "@/lib/db/client";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const publicKey = String(body?.publicKey ?? "");
    const conversationId = String(body?.conversationId ?? "");
    const name = String(body?.name ?? "").trim().slice(0, 120);
    const email = String(body?.email ?? "").trim().toLowerCase().slice(0, 254);
    if (!publicKey || !conversationId || !email || !email.includes("@")) return NextResponse.json({ error: "Valid contact details are required." }, { status: 400 });

    const chatbot = await prisma.chatbot.findFirst({ where: { publicKey, status: "ACTIVE" }, select: { id: true, organizationId: true } });
    if (!chatbot) return NextResponse.json({ error: "Chatbot unavailable." }, { status: 404 });

    const conversation = await prisma.conversation.findFirst({ where: { id: conversationId, chatbotId: chatbot.id, organizationId: chatbot.organizationId } });
    if (!conversation) return NextResponse.json({ error: "Conversation not found." }, { status: 404 });

    await prisma.conversation.update({ where: { id: conversation.id }, data: { visitorName: name || null, visitorEmail: email } });
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("HELP-ME lead capture error:", error);
    return NextResponse.json({ error: "Unable to save contact details." }, { status: 500 });
  }
}
