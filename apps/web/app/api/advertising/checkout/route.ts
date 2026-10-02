import { NextResponse } from "next/server";
import { requireStripe } from "@/lib/billing/stripe";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const prices: Record<number, Record<number, number>> = {
  1: { 1: 499, 2: 299, 3: 299 },
  3: { 1: 1299, 2: 799, 3: 799 },
  6: { 1: 2399, 2: 1499, 3: 1499 },
  12: { 1: 4499, 2: 2799, 3: 2799 },
};

function clean(value: unknown, max: number) {
  return typeof value === "string" ? value.trim().slice(0, max) : "";
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const space = Number(body?.space);
    const durationMonths = Number(body?.durationMonths);
    const companyName = clean(body?.companyName, 120);
    const design = clean(body?.design, 5000);
    const conversation = Array.isArray(body?.conversation) ? body.conversation.slice(-20) : [];

    if (![1, 2, 3].includes(space) || !prices[durationMonths]?.[space]) {
      return NextResponse.json({ error: "Invalid advertising package" }, { status: 400 });
    }

    const total = prices[durationMonths][space];
    const origin = request.headers.get("origin") || process.env.NEXTAUTH_URL || "http://localhost:3000";
    const stripe = requireStripe();

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      line_items: [{
        price_data: {
          currency: "eur",
          product_data: { name: `HELP-ME Advertising Space ${space} · ${durationMonths} months` },
          unit_amount: total * 100,
        },
        quantity: 1,
      }],
      metadata: {
        help_me_ad: "1",
        ad_space: String(space),
        ad_duration_months: String(durationMonths),
        ad_company: companyName || "HELP-ME Advertiser",
        ad_design: design.slice(0, 4500),
        ad_conversation: JSON.stringify(conversation).slice(0, 4500),
      },
      success_url: `${origin}/?advertising=success&space=${space}`,
      cancel_url: `${origin}/?advertising=cancelled`,
      allow_promotion_codes: true,
    });

    return NextResponse.json({ url: session.url });
  } catch (error) {
    console.error("HELP-ME advertising checkout error:", error);
    return NextResponse.json({ error: "Unable to create advertising checkout" }, { status: 503 });
  }
}
