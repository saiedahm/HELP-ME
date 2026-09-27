export type BillingPlan = {
  id: "free" | "starter" | "pro" | "business";
  name: string;
  monthlyPriceCents: number;
  yearlyPriceCents: number;
  aiRequestsPerMonth: number;
  description: string;
};

export const BILLING_PLANS: BillingPlan[] = [
  { id: "free", name: "Free", monthlyPriceCents: 0, yearlyPriceCents: 0, aiRequestsPerMonth: 10, description: "Test HELP-ME with a small monthly AI allowance." },
  { id: "starter", name: "Starter", monthlyPriceCents: 1900, yearlyPriceCents: 19000, aiRequestsPerMonth: 150, description: "For individuals and small projects." },
  { id: "pro", name: "Pro", monthlyPriceCents: 4900, yearlyPriceCents: 49000, aiRequestsPerMonth: 600, description: "For professionals who use HELP-ME regularly." },
  { id: "business", name: "Business", monthlyPriceCents: 14900, yearlyPriceCents: 149000, aiRequestsPerMonth: 2500, description: "For teams and higher-volume AI work." },
];

export function getPlan(id: string) {
  return BILLING_PLANS.find((plan) => plan.id === id) ?? null;
}
