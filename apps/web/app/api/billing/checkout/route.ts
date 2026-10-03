import { NextResponse } from "next/server";
import { getPlan } from "@/lib/billing/plans";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => ({}));
    const planId = typeof body?.plan === "string" ? body.plan : "";
    const interval = body?.interval === "year" ? "year" : "month";
    const plan = getPlan(planId as Parameters<typeof getPlan>[0]);

    if (!plan) {
      return NextResponse.json({ error: "Invalid billing plan" }, { status: 400 });
    }

    if (plan.id === "free") {
      return NextResponse.json({ error: "Free plan does not require checkout" }, { status: 400 });
    }

    const coreUrl = (process.env.PAYMENT_CORE_URL || "https://www.nexoraonline.de").replace(/\/$/, "");
    const coreSecret = process.env.PAYMENT_CORE_SECRET?.trim();

    if (!coreSecret) {
      return NextResponse.json({ error: "Central payment service is not configured." }, { status: 503 });
    }

    const response = await fetch(`${coreUrl}/api/payments/core/checkout`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${coreSecret}`,
      },
      body: JSON.stringify({
        platform: "help-me",
        product: plan.id,
        interval,
      }),
      cache: "no-store",
    });

    const data = await response.json().catch(() => ({}));

    if (!response.ok || !data?.url) {
      console.error("Central HELP-ME checkout error:", data?.error || response.status);
      return NextResponse.json(
        { error: data?.error || "Unable to create checkout session" },
        { status: response.status >= 500 ? 503 : response.status },
      );
    }

    return NextResponse.json({ url: data.url });
  } catch (error) {
    console.error("HELP-ME central checkout error:", error);
    return NextResponse.json({ error: "Unable to connect to the central payment service." }, { status: 503 });
  }
}
