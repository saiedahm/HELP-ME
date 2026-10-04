import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/db/client";

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const membership = await prisma.organizationMember.findFirst({
    where: { userId: session.user.id },
    select: { organizationId: true },
  });
  if (!membership) return NextResponse.json({ error: "Company access denied." }, { status: 403 });

  const items = await prisma.knowledgeItem.findMany({
    where: { organizationId: membership.organizationId },
    orderBy: { updatedAt: "desc" },
    select: { id: true, title: true, type: true, sourceUrl: true, content: true, chatbotId: true, updatedAt: true },
  });

  return NextResponse.json({ items });
}

export async function POST(request: Request) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const body = await request.json();
    const title = String(body?.title ?? "").trim();
    const content = String(body?.content ?? "").trim();
    const sourceUrl = String(body?.sourceUrl ?? "").trim() || null;
    const type = String(body?.type ?? "TEXT");
    const chatbotId = body?.chatbotId ? String(body.chatbotId) : null;

    if (!title || !content) return NextResponse.json({ error: "Title and content are required." }, { status: 400 });
    if (!["TEXT", "FAQ", "WEBSITE", "FILE"].includes(type)) return NextResponse.json({ error: "Invalid knowledge type." }, { status: 400 });

    const membership = await prisma.organizationMember.findFirst({
      where: { userId: session.user.id, role: { in: ["OWNER", "ADMIN"] } },
      select: { organizationId: true },
    });
    if (!membership) return NextResponse.json({ error: "Company access denied." }, { status: 403 });

    if (chatbotId) {
      const bot = await prisma.chatbot.findFirst({ where: { id: chatbotId, organizationId: membership.organizationId }, select: { id: true } });
      if (!bot) return NextResponse.json({ error: "Chatbot does not belong to this company." }, { status: 403 });
    }

    const item = await prisma.knowledgeItem.create({
      data: {
        organizationId: membership.organizationId,
        chatbotId,
        title,
        content,
        sourceUrl,
        type: type as "TEXT" | "FAQ" | "WEBSITE" | "FILE",
      },
      select: { id: true, title: true, type: true, sourceUrl: true, chatbotId: true, updatedAt: true },
    });

    return NextResponse.json({ item }, { status: 201 });
  } catch (error) {
    console.error("HELP-ME knowledge creation error:", error);
    return NextResponse.json({ error: "Unable to save knowledge." }, { status: 500 });
  }
}
