import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/db/client";
import { getStripe, priceIdForPlan } from "@/lib/billing/stripe";

export async function POST(request: Request) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const body = await request.json();
    const plan = String(body?.plan ?? "");
    if (plan !== "BUSINESS" && plan !== "PRO") return NextResponse.json({ error: "Invalid plan." }, { status: 400 });

    const membership = await prisma.organizationMember.findFirst({
      where: { userId: session.user.id, role: { in: ["OWNER", "ADMIN"] } },
      include: { organization: { include: { subscription: true } } },
    });
    if (!membership) return NextResponse.json({ error: "Company billing access denied." }, { status: 403 });

    const stripe = getStripe();
    let customerId = membership.organization.subscription?.stripeCustomerId;
    if (!customerId) {
      const customer = await stripe.customers.create({
        email: session.user.email ?? undefined,
        name: membership.organization.name,
        metadata: { organizationId: membership.organizationId },
      });
      customerId = customer.id;
      await prisma.subscription.upsert({
        where: { organizationId: membership.organizationId },
        create: { organizationId: membership.organizationId, plan: "STARTER", status: "INCOMPLETE", stripeCustomerId: customerId },
        update: { stripeCustomerId: customerId },
      });
    }

    const baseUrl = process.env.NEXTAUTH_URL ?? new URL(request.url).origin;
    const checkout = await stripe.checkout.sessions.create({
      mode: "subscription",
      customer: customerId,
      line_items: [{ price: priceIdForPlan(plan), quantity: 1 }],
      success_url: `${baseUrl}/dashboard/billing?success=1`,
      cancel_url: `${baseUrl}/dashboard/billing?canceled=1`,
      metadata: { organizationId: membership.organizationId, plan },
      subscription_data: { metadata: { organizationId: membership.organizationId, plan } },
    });

    return NextResponse.json({ url: checkout.url });
  } catch (error) {
    console.error("HELP-ME checkout error:", error);
    return NextResponse.json({ error: "Unable to start checkout." }, { status: 500 });
  }
}
