import { NextResponse } from "next/server";
import { prisma } from "@/lib/db/client";
import { mockAI } from "@/lib/ai/mock";
import { getUsageState } from "@/lib/usage/limits";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const publicKey = String(body?.publicKey ?? "");
    const message = String(body?.message ?? "").trim();
    const conversationId = body?.conversationId ? String(body.conversationId) : null;
    const visitorId = String(body?.visitorId ?? "").slice(0, 100) || null;
    if (!publicKey || !message) return NextResponse.json({ error: "Chatbot and message are required." }, { status: 400 });
    if (message.length > 4000) return NextResponse.json({ error: "Message is too long." }, { status: 400 });

    const chatbot = await prisma.chatbot.findFirst({ where: { publicKey, status: "ACTIVE" }, include: { knowledgeItems: { orderBy: { updatedAt: "desc" }, take: 30 } } });
    if (!chatbot) return NextResponse.json({ error: "Chatbot unavailable." }, { status: 404 });

    const subscription = await prisma.subscription.findUnique({ where: { organizationId: chatbot.organizationId }, select: { plan: true, status: true } });
    const plan = subscription?.plan ?? "STARTER";
    if (subscription && subscription.status !== "ACTIVE") return NextResponse.json({ error: "This chatbot is temporarily unavailable." }, { status: 403 });
    const usageState = await getUsageState(prisma, chatbot.organizationId, plan);
    if (!usageState.allowed) return NextResponse.json({ error: "Monthly message limit reached. Please upgrade your plan." }, { status: 429 });
    const reserved = await prisma.usage.updateMany({
      where: { organizationId: chatbot.organizationId, periodStart: usageState.usage.periodStart, messages: { lt: usageState.limit } },
      data: { messages: { increment: 1 } },
    });
    if (reserved.count !== 1) return NextResponse.json({ error: "Monthly message limit reached. Please upgrade your plan." }, { status: 429 });

    let conversation = conversationId ? await prisma.conversation.findFirst({ where: { id: conversationId, chatbotId: chatbot.id, organizationId: chatbot.organizationId } }) : null;
    if (!conversation) conversation = await prisma.conversation.create({ data: { organizationId: chatbot.organizationId, chatbotId: chatbot.id, visitorId, title: message.slice(0, 80) } });

    const history = await prisma.message.findMany({ where: { conversationId: conversation.id }, orderBy: { createdAt: "asc" }, take: 30, select: { role: true, content: true } });
    await prisma.message.create({ data: { conversationId: conversation.id, role: "USER", content: message } });

    const reply = await mockAI.generateReply(
      [...history, { role: "USER", content: message }].filter((item) => item.role === "USER" || item.role === "ASSISTANT").map((item) => ({ role: item.role as "USER" | "ASSISTANT", content: item.content })),
      { chatbotName: chatbot.name, welcomeMessage: chatbot.welcomeMessage, knowledge: chatbot.knowledgeItems.map((item) => ({ title: item.title, content: item.content })) }
    );
    await prisma.message.create({ data: { conversationId: conversation.id, role: "ASSISTANT", content: reply } });

    return NextResponse.json({ conversationId: conversation.id, reply, chatbot: { name: chatbot.name, primaryColor: chatbot.primaryColor, logoUrl: chatbot.logoUrl } });
  } catch (error) {
    console.error("HELP-ME public widget chat error:", error);
    return NextResponse.json({ error: "Unable to process the message." }, { status: 500 });
  }
}
