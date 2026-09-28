import { NextResponse } from "next/server";
import { getPlan } from "@/lib/billing/plans";
import { requireStripe } from "@/lib/billing/stripe";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const planId = typeof body?.plan === "string" ? body.plan : "";
    const interval = body?.interval === "year" ? "year" : "month";
    const plan = getPlan(planId as Parameters<typeof getPlan>[0]);

    if (!plan) {
      return NextResponse.json({ error: "Invalid billing plan" }, { status: 400 });
    }

    if (plan.id === "free") {
      return NextResponse.json({ error: "Free plan does not require checkout" }, { status: 400 });
    }

    const stripe = requireStripe();
    const origin = request.headers.get("origin") || process.env.NEXTAUTH_URL || "http://localhost:3000";
    const price = interval === "year" ? plan.yearlyPriceCents : plan.monthlyPriceCents;

    const session = await stripe.checkout.sessions.create({
      mode: "subscription",
      line_items: [{
        price_data: {
          currency: "eur",
          product_data: { name: `HELP-ME ${plan.name}` },
          unit_amount: price,
          recurring: { interval: interval === "year" ? "year" : "month" },
        },
        quantity: 1,
      }],
      success_url: `${origin}/?checkout=success`,
      cancel_url: `${origin}/?checkout=cancelled`,
      allow_promotion_codes: true,
    });

    return NextResponse.json({ url: session.url });
  } catch (error) {
    console.error("HELP-ME Stripe checkout error:", error);
    return NextResponse.json({ error: "Unable to create checkout session" }, { status: 503 });
  }
}
