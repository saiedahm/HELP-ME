import Stripe from "stripe";

let stripeInstance: Stripe | null = null;

export function getStripe() {
  if (!stripeInstance) {
    const secret = process.env.STRIPE_SECRET_KEY;
    if (!secret) throw new Error("STRIPE_SECRET_KEY is not configured.");
    stripeInstance = new Stripe(secret);
  }
  return stripeInstance;
}

export function priceIdForPlan(plan: "BUSINESS" | "PRO") {
  const priceId = plan === "BUSINESS" ? process.env.STRIPE_PRICE_BUSINESS : process.env.STRIPE_PRICE_PRO;
  if (!priceId) throw new Error(`Stripe price is not configured for ${plan}.`);
  return priceId;
}
