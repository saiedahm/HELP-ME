import { NextResponse } from "next/server";
import { prisma } from "@/lib/db/client";
import { requirePlatformAdmin } from "@/lib/auth/admin";

export async function GET() {
  const admin = await requirePlatformAdmin();
  if (!admin) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const [users, organizations, chatbots, conversations, subscriptions] = await Promise.all([
    prisma.user.count(),
    prisma.organization.count(),
    prisma.chatbot.count(),
    prisma.conversation.count(),
    prisma.subscription.groupBy({ by: ["plan"], _count: { _all: true } }),
  ]);
  return NextResponse.json({ users, organizations, chatbots, conversations, subscriptions });
}
