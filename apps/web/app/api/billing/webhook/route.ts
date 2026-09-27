import { NextResponse } from "next/server";
import Stripe from "stripe";
import { requireStripe } from "@/lib/billing/stripe";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  return NextResponse.json({
    ok: true,
    service: "HELP-ME Stripe Webhook",
  });
}

export async function POST(request: Request) {
  const signature = request.headers.get("stripe-signature");
  const secret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!signature || !secret) {
    return NextResponse.json(
      { error: "Stripe webhook is not configured" },
      { status: 400 },
    );
  }

  try {
    const payload = await request.text();
    const stripe = requireStripe();
    const event = stripe.webhooks.constructEvent(payload, signature, secret);

    switch (event.type) {
      case "checkout.session.completed":
      case "customer.subscription.created":
      case "customer.subscription.updated":
      case "customer.subscription.deleted":
      case "invoice.payment_failed":
        console.log("HELP-ME Stripe event:", event.type, event.id);
        break;
      default:
        break;
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error("HELP-ME Stripe webhook error:", error);
    if (error instanceof Stripe.errors.StripeSignatureVerificationError) {
      return NextResponse.json({ error: "Invalid Stripe signature" }, { status: 400 });
    }
    return NextResponse.json({ error: "Webhook processing failed" }, { status: 400 });
  }
}
