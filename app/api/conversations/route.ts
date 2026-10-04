import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/db/client";

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const membership = await prisma.organizationMember.findFirst({ where: { userId: session.user.id }, select: { organizationId: true } });
  if (!membership) return NextResponse.json({ error: "Company access denied." }, { status: 403 });

  const conversations = await prisma.conversation.findMany({
    where: { organizationId: membership.organizationId },
    orderBy: { updatedAt: "desc" },
    take: 100,
    include: { chatbot: { select: { name: true } }, messages: { orderBy: { createdAt: "asc" }, take: 2, select: { role: true, content: true, createdAt: true } } },
  });
  return NextResponse.json({ conversations });
}

export async function PATCH(request: Request) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const body = await request.json();
  const id = String(body?.id ?? "");
  const status = String(body?.status ?? "");
  if (!id || !["OPEN", "HANDED_OFF", "CLOSED"].includes(status)) return NextResponse.json({ error: "Invalid conversation update." }, { status: 400 });

  const membership = await prisma.organizationMember.findFirst({ where: { userId: session.user.id, role: { in: ["OWNER", "ADMIN", "MEMBER"] } }, select: { organizationId: true } });
  if (!membership) return NextResponse.json({ error: "Company access denied." }, { status: 403 });

  const conversation = await prisma.conversation.findFirst({ where: { id, organizationId: membership.organizationId } });
  if (!conversation) return NextResponse.json({ error: "Conversation not found." }, { status: 404 });

  const updated = await prisma.conversation.update({
    where: { id },
    data: { status: status as "OPEN" | "HANDED_OFF" | "CLOSED", ...(status === "HANDED_OFF" ? { handoffRequestedAt: new Date() } : {}) },
  });
  return NextResponse.json({ conversation: updated });
}
