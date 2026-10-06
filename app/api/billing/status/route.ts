import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/db/client";
import { PLAN_LIMITS } from "@/lib/billing/plans";

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const membership = await prisma.organizationMember.findFirst({
    where: { userId: session.user.id, role: { in: ["OWNER", "ADMIN"] } },
    include: { organization: { include: { subscription: true, usage: true } } },
  });

  if (!membership) return NextResponse.json({ error: "Company billing access denied." }, { status: 403 });

  const subscription = membership.organization.subscription;
  const plan = subscription?.plan ?? "STARTER";
  const usage = membership.organization.usage;

  return NextResponse.json({
    organization: { id: membership.organization.id, name: membership.organization.name },
    subscription: {
      plan,
      status: subscription?.status ?? "ACTIVE",
      hasStripeCustomer: Boolean(subscription?.stripeCustomerId),
      hasStripeSubscription: Boolean(subscription?.stripeSubscriptionId),
    },
    limits: PLAN_LIMITS[plan],
    usage: {
      messages: usage?.messages ?? 0,
      conversations: usage?.conversations ?? 0,
    },
  });
}
