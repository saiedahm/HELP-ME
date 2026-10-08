import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/db";
import { mockAI } from "@/lib/ai/mock";

export async function POST(request: Request) {
  try {
    const session = await auth();
    const userId = session?.user?.email
      ? (await prisma.user.findUnique({ where: { email: session.user.email }, select: { id: true } }))?.id
      : null;
    if (!userId) return NextResponse.json({ error: "Sign in to save conversations." }, { status: 401 });

    const body = await request.json();
    const message = typeof body?.message === "string" ? body.message.trim() : "";
    const conversationId = typeof body?.conversationId === "string" ? body.conversationId : null;
    if (!message || message.length > 4000)
      return NextResponse.json({ error: "Enter a message up to 4,000 characters." }, { status: 400 });

    const membership = await prisma.membership.findFirst({
      where: { userId },
      orderBy: { createdAt: "asc" },
      select: { organizationId: true }
    });
    if (!membership) return NextResponse.json({ error: "No workspace is connected to this account." }, { status: 403 });

    let conversation;
    if (conversationId) {
      conversation = await prisma.conversation.findFirst({
        where: { id: conversationId, organizationId: membership.organizationId },
        select: { id: true }
      });
      if (!conversation) return NextResponse.json({ error: "Conversation not found." }, { status: 404 });
    } else {
      const chatbot = await prisma.chatbot.findFirst({
        where: { organizationId: membership.organizationId, status: "ACTIVE" },
        select: { id: true }
      });
      if (!chatbot) return NextResponse.json({ error: "No active assistant is configured." }, { status: 409 });
      conversation = await prisma.conversation.create({
        data: { organizationId: membership.organizationId, chatbotId: chatbot.id, title: message.slice(0, 80) },
        select: { id: true }
      });
    }

    await prisma.message.create({ data: { conversationId: conversation.id, role: "user", content: message } });
    const knowledge = await prisma.knowledgeDocument.findMany({
      where: { organizationId: membership.organizationId },
      select: { title: true, content: true },
      take: 10
    });
    const contextText = knowledge.map(item => item.title + ": " + item.content.slice(0, 1500)).join("\n");
    const reply = await mockAI.generateReply({
      messages: [{ role: "user", content: message }],
      context: { botName: "HELP-ME", knowledge: contextText }
    });
    await prisma.message.create({ data: { conversationId: conversation.id, role: "assistant", content: reply } });
    return NextResponse.json({ reply, provider: "mock", conversationId: conversation.id });
  } catch (error) {
    console.error("Chat request failed:", error);
    return NextResponse.json({ error: "The assistant is temporarily unavailable." }, { status: 500 });
  }
}
