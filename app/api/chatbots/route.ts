import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/db/client";

function slugify(value: string) {
  return value.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "").slice(0, 50) || "chatbot";
}

export async function POST(request: Request) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const body = await request.json();
    const name = String(body?.name ?? "").trim();
    const welcomeMessage = String(body?.welcomeMessage ?? "").trim() || null;
    const primaryColor = String(body?.primaryColor ?? "").trim() || "#39d9ff";

    if (!name) return NextResponse.json({ error: "Chatbot name is required." }, { status: 400 });
    if (!/^#[0-9a-fA-F]{6}$/.test(primaryColor)) {
      return NextResponse.json({ error: "Invalid color." }, { status: 400 });
    }

    const membership = await prisma.organizationMember.findFirst({
      where: { userId: session.user.id, role: { in: ["OWNER", "ADMIN"] } },
      select: { organizationId: true },
    });
    if (!membership) return NextResponse.json({ error: "Company access denied." }, { status: 403 });

    const slug = `${slugify(name)}-${crypto.randomUUID().slice(0, 6)}`;
    const chatbot = await prisma.chatbot.create({
      data: { organizationId: membership.organizationId, name, slug, welcomeMessage, primaryColor },
      select: { id: true, publicKey: true, name: true, slug: true, status: true, welcomeMessage: true, primaryColor: true },
    });

    return NextResponse.json({ chatbot }, { status: 201 });
  } catch (error) {
    console.error("HELP-ME chatbot creation error:", error);
    return NextResponse.json({ error: "Unable to create chatbot." }, { status: 500 });
  }
}
