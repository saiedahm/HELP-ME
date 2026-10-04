import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/db/client";
import { mockAI } from "@/lib/ai/mock";

export async function POST(request: Request) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const body = await request.json();
    const chatbotId = String(body?.chatbotId ?? "");
    const message = String(body?.message ?? "").trim();
    const conversationId = body?.conversationId ? String(body.conversationId) : null;

    if (!chatbotId || !message) return NextResponse.json({ error: "Chatbot and message are required." }, { status: 400 });
    if (message.length > 4000) return NextResponse.json({ error: "Message is too long." }, { status: 400 });

    const membership = await prisma.organizationMember.findFirst({
      where: { userId: session.user.id },
      select: { organizationId: true },
    });
    if (!membership) return NextResponse.json({ error: "Company access denied." }, { status: 403 });

    const chatbot = await prisma.chatbot.findFirst({
      where: { id: chatbotId, organizationId: membership.organizationId, status: "ACTIVE" },
      include: { knowledgeItems: { orderBy: { updatedAt: "desc" }, take: 20 } },
    });
    if (!chatbot) return NextResponse.json({ error: "Chatbot not found." }, { status: 404 });

    let conversation;
    if (conversationId) {
      conversation = await prisma.conversation.findFirst({
        where: { id: conversationId, organizationId: membership.organizationId, chatbotId },
      });
      if (!conversation) return NextResponse.json({ error: "Conversation not found." }, { status: 404 });
    } else {
      conversation = await prisma.conversation.create({
        data: {
          organizationId: membership.organizationId,
          chatbotId,
          title: message.slice(0, 80),
        },
      });
    }

    const history = await prisma.message.findMany({
      where: { conversationId: conversation.id },
      orderBy: { createdAt: "asc" },
      take: 30,
      select: { role: true, content: true },
    });

    await prisma.message.create({
      data: { conversationId: conversation.id, role: "USER", content: message },
    });

    const reply = await mockAI.generateReply(
      [...history, { role: "USER", content: message }]
        .filter((item) => item.role === "USER" || item.role === "ASSISTANT")
        .map((item) => ({ role: item.role as "USER" | "ASSISTANT", content: item.content })),
      {
        chatbotName: chatbot.name,
        welcomeMessage: chatbot.welcomeMessage,
        knowledge: chatbot.knowledgeItems.map((item) => ({ title: item.title, content: item.content })),
      }
    );

    await prisma.message.create({
      data: { conversationId: conversation.id, role: "ASSISTANT", content: reply },
    });

    await prisma.usage.upsert({
      where: { organizationId: membership.organizationId },
      create: { organizationId: membership.organizationId, periodStart: new Date(), messages: 2, conversations: conversationId ? 0 : 1 },
      update: { messages: { increment: 2 }, conversations: conversationId ? undefined : { increment: 1 } },
    });

    return NextResponse.json({ conversationId: conversation.id, reply });
  } catch (error) {
    console.error("HELP-ME chat error:", error);
    return NextResponse.json({ error: "Unable to process the message." }, { status: 500 });
  }
}
