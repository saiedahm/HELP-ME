import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/db/client";

type Params = { params: Promise<{ id: string }> };

async function getAccess(userId: string, chatbotId: string) {
  return prisma.chatbot.findFirst({
    where: {
      id: chatbotId,
      organization: { members: { some: { userId, role: { in: ["OWNER", "ADMIN"] } } } },
    },
  });
}

export async function GET(_request: Request, { params }: Params) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { id } = await params;
  const chatbot = await getAccess(session.user.id, id);
  if (!chatbot) return NextResponse.json({ error: "Chatbot not found." }, { status: 404 });
  return NextResponse.json({ chatbot });
}

export async function PATCH(request: Request, { params }: Params) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { id } = await params;
  const existing = await getAccess(session.user.id, id);
  if (!existing) return NextResponse.json({ error: "Chatbot not found." }, { status: 404 });

  try {
    const body = await request.json();
    const name = body?.name === undefined ? existing.name : String(body.name).trim();
    const welcomeMessage = body?.welcomeMessage === undefined ? existing.welcomeMessage : String(body.welcomeMessage).trim() || null;
    const primaryColor = body?.primaryColor === undefined ? existing.primaryColor : String(body.primaryColor).trim();
    const logoUrl = body?.logoUrl === undefined ? existing.logoUrl : String(body.logoUrl).trim() || null;
    const status = body?.status === undefined ? existing.status : String(body.status);

    if (!name) return NextResponse.json({ error: "Chatbot name is required." }, { status: 400 });
    if (primaryColor && !/^#[0-9a-fA-F]{6}$/.test(primaryColor)) return NextResponse.json({ error: "Invalid color." }, { status: 400 });
    if (status !== "ACTIVE" && status !== "PAUSED") return NextResponse.json({ error: "Invalid status." }, { status: 400 });

    const chatbot = await prisma.chatbot.update({
      where: { id },
      data: { name, welcomeMessage, primaryColor, logoUrl, status: status as "ACTIVE" | "PAUSED" },
    });

    return NextResponse.json({ chatbot });
  } catch (error) {
    console.error("HELP-ME chatbot update error:", error);
    return NextResponse.json({ error: "Unable to update chatbot." }, { status: 500 });
  }
}
