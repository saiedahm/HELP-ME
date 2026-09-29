import { cookies } from "next/headers";
import { requireStripe } from "@/lib/billing/stripe";

export const FREE_REQUESTS_PER_DAY = 10;
const CUSTOMER_COOKIE = "helpme_stripe_customer";
const USAGE_COOKIE = "helpme_free_usage";

type Usage = { day: string; count: number };

export async function getMembershipStatus() {
  const store = await cookies();
  const customerId = store.get(CUSTOMER_COOKIE)?.value;
  if (!customerId) return { active: false, customerId: null, source: "free" as const };

  try {
    const stripe = requireStripe();
    const subscriptions = await stripe.subscriptions.list({ customer: customerId, status: "all", limit: 10 });
    const active = subscriptions.data.some((s) => ["active", "trialing", "past_due"].includes(s.status));
    return { active, customerId, source: active ? ("stripe" as const) : ("free" as const) };
  } catch {
    return { active: false, customerId, source: "free" as const };
  }
}

export async function consumeFreeRequest() {
  const store = await cookies();
  const today = new Date().toISOString().slice(0, 10);
  let usage: Usage = { day: today, count: 0 };
  const raw = store.get(USAGE_COOKIE)?.value;
  if (raw) { try { const parsed = JSON.parse(raw); if (parsed?.day === today) usage = { day: today, count: Number(parsed.count) || 0 }; } catch {} }
  if (usage.count >= FREE_REQUESTS_PER_DAY) return { allowed: false, remaining: 0 };
  usage.count += 1;
  store.set(USAGE_COOKIE, JSON.stringify(usage), { httpOnly: true, sameSite: "lax", secure: process.env.NODE_ENV === "production", maxAge: 60 * 60 * 24, path: "/" });
  return { allowed: true, remaining: FREE_REQUESTS_PER_DAY - usage.count };
}

export const customerCookieName = CUSTOMER_COOKIE;
