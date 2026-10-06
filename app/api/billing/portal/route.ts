import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/db/client";
import { getStripe } from "@/lib/billing/stripe";

export async function POST(request: Request) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const membership = await prisma.organizationMember.findFirst({
      where: { userId: session.user.id, role: { in: ["OWNER", "ADMIN"] } },
      include: { organization: { include: { subscription: true } } },
    });

    const customerId = membership?.organization.subscription?.stripeCustomerId;
    if (!customerId) return NextResponse.json({ error: "No active Stripe customer is available yet." }, { status: 400 });

    const baseUrl = process.env.NEXTAUTH_URL ?? new URL(request.url).origin;
    const portal = await getStripe().billingPortal.sessions.create({
      customer: customerId,
      return_url: ${baseUrl}/dashboard/billing,
    });

    return NextResponse.json({ url: portal.url });
  } catch (error) {
    console.error("HELP-ME billing portal error:", error);
    return NextResponse.json({ error: "Unable to open billing management." }, { status: 500 });
  }
}
