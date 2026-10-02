import { NextResponse } from "next/server";
import { requireStripe } from "@/lib/billing/stripe";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function isValidUrl(value: string) {
  try {
    const u = new URL(value);
    return u.protocol === "https:" || u.protocol === "http:";
  } catch {
    return false;
  }
}

export async function GET() {
  try {
    const stripe = requireStripe();
    const sessions = await stripe.checkout.sessions.list({ limit: 100, status: "complete" });
    const now = Date.now();

    const ads = sessions.data
      .filter((s) => s.payment_status === "paid" && s.metadata?.help_me_ad === "1")
      .map((s) => {
        const months = Number(s.metadata?.ad_duration_months || 1);
        const created = (s.created || 0) * 1000;
        const expiresAt = new Date(created + months * 30 * 24 * 60 * 60 * 1000).toISOString();
        const design = s.metadata?.ad_design || "";
        const companyName = s.metadata?.ad_company || "Advertiser";
        const message = design.split("\n").find((line) => /النص|رسالة|عنوان|headline/i.test(line))?.slice(0, 180) || "إعلان جديد";
        return {
          id: s.id,
          space: Number(s.metadata?.ad_space || 0),
          companyName,
          message,
          design,
          expiresAt,
          destination: "",
        };
      })
      .filter((ad) => [1, 2, 3].includes(ad.space) && new Date(ad.expiresAt).getTime() > now)
      .sort((a, b) => b.id.localeCompare(a.id));

    const bySpace = new Map<number, typeof ads[number]>();
    for (const ad of ads) if (!bySpace.has(ad.space)) bySpace.set(ad.space, ad);

    return NextResponse.json({ ads: Array.from(bySpace.values()) });
  } catch (error) {
    console.error("HELP-ME active advertising error:", error);
    return NextResponse.json({ ads: [] }, { status: 200 });
  }
}
