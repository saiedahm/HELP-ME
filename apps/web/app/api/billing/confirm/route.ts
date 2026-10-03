import { NextResponse } from "next/server";
import { customerCookieName } from "@/lib/billing/membership";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => ({}));
    const sessionId = typeof body?.sessionId === "string" ? body.sessionId : "";
    if (!sessionId) return NextResponse.json({ error: "sessionId is required." }, { status: 400 });

    const coreUrl = (process.env.PAYMENT_CORE_URL || "https://www.nexoraonline.de").replace(/\/$/, "");
    const coreSecret = process.env.PAYMENT_CORE_SECRET?.trim();
    if (!coreSecret) return NextResponse.json({ error: "Central payment service is not configured." }, { status: 503 });

    const response = await fetch(`${coreUrl}/api/payments/core/status`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${coreSecret}`,
      },
      body: JSON.stringify({ sessionId }),
      cache: "no-store",
    });
    const data = await response.json().catch(() => ({}));

    if (!response.ok || data?.metadata?.platform !== "help-me" || data?.paid !== true) {
      return NextResponse.json({ paid: false }, { status: 402 });
    }

    if (data.customerId) {
      const result = NextResponse.json({ paid: true, customerId: data.customerId });
      result.cookies.set(customerCookieName, data.customerId, {
        httpOnly: true,
        sameSite: "lax",
        secure: process.env.NODE_ENV === "production",
        maxAge: 60 * 60 * 24 * 365,
        path: "/",
      });
      return result;
    }

    return NextResponse.json({ paid: true });
  } catch (error) {
    console.error("HELP-ME payment confirmation error:", error);
    return NextResponse.json({ error: "Unable to verify payment." }, { status: 503 });
  }
}
