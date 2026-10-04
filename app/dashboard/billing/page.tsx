"use client";

import { useState } from "react";
import Link from "next/link";

const plans = [
  { code: "BUSINESS", name: "Business", price: "49€", text: "5,000 messages · 5 chatbots · 250 knowledge items" },
  { code: "PRO", name: "Pro", price: "99€", text: "20,000 messages · 20 chatbots · 1,000 knowledge items" },
];

export default function BillingPage() {
  const [loading, setLoading] = useState("");
  const [error, setError] = useState("");

  async function checkout(plan: string) {
    setLoading(plan); setError("");
    const response = await fetch("/api/billing/checkout", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ plan }) });
    const data = await response.json();
    if (!response.ok) { setError(data.error ?? "Unable to start checkout."); setLoading(""); return; }
    if (data.url) window.location.href = data.url;
  }

  return <main className="dashboard-page"><header className="dashboard-header"><div><div className="badge">HELP-ME · Billing</div><h1>Plans & billing</h1><p>Subscriptions are activated from verified Stripe events.</p></div><Link className="button" href="/dashboard">Dashboard</Link></header><section className="billing-grid">{plans.map((plan) => <article className="price-card" key={plan.code}><div className="plan-name">{plan.name}</div><div className="price">{plan.price}<small>/ month</small></div><p>{plan.text}</p><button className="button primary" disabled={!!loading} onClick={() => checkout(plan.code)}>{loading === plan.code ? "Opening checkout…" : "Choose " + plan.name}</button></article>)}</section>{error && <p className="form-error">{error}</p>}</main>;
}
