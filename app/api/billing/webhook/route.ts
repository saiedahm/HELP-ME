import { NextResponse } from "next/server";
import Stripe from "stripe";
import { getStripe } from "@/lib/billing/stripe";
import { prisma } from "@/lib/db/client";

export async function POST(request: Request) {
  const signature = request.headers.get("stripe-signature");
  const secret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!signature || !secret) return new NextResponse("Webhook configuration missing.", { status: 400 });

  try {
    const body = await request.text();
    const stripe = getStripe();
    const event = stripe.webhooks.constructEvent(body, signature, secret);

    if (event.type === "checkout.session.completed") {
      const session = event.data.object as Stripe.Checkout.Session;
      const organizationId = session.metadata?.organizationId;
      const plan = session.metadata?.plan;
      if (organizationId && (plan === "BUSINESS" || plan === "PRO")) {
        await prisma.subscription.update({
          where: { organizationId },
          data: {
            plan,
            status: "ACTIVE",
            stripeCustomerId: typeof session.customer === "string" ? session.customer : undefined,
            stripeSubscriptionId: typeof session.subscription === "string" ? session.subscription : undefined,
          },
        });
      }
    }

    if (event.type === "customer.subscription.updated" || event.type === "customer.subscription.deleted") {
      const subscription = event.data.object as Stripe.Subscription;
      const organizationId = subscription.metadata?.organizationId;
      const plan = subscription.metadata?.plan;
      const status = event.type === "customer.subscription.deleted" ? "CANCELED" : subscription.status === "active" ? "ACTIVE" : subscription.status === "past_due" ? "PAST_DUE" : "INCOMPLETE";
      if (organizationId) {
        await prisma.subscription.update({
          where: { organizationId },
          data: {
            status,
            ...(plan === "BUSINESS" || plan === "PRO" ? { plan } : {}),
            stripeCustomerId: typeof subscription.customer === "string" ? subscription.customer : undefined,
            stripeSubscriptionId: subscription.id,
          },
        });
      }
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error("HELP-ME Stripe webhook error:", error);
    return new NextResponse("Webhook signature or event processing failed.", { status: 400 });
  }
}
