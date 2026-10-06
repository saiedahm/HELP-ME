"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

const plans = [
  { code: "BUSINESS", name: "Business", price: "49€", text: "5,000 messages · 5 chatbots · 250 knowledge items" },
  { code: "PRO", name: "Pro", price: "99€", text: "20,000 messages · 20 chatbots · 1,000 knowledge items" },
];

type BillingStatus = {
  plan?: string;
  status?: string;
  hasCustomer?: boolean;
  hasSubscription?: boolean;
};

export default function BillingPage() {
  const [loading, setLoading] = useState("");
  const [error, setError] = useState("");
  const [status, setStatus] = useState<BillingStatus | null>(null);

  useEffect(() => {
    fetch("/api/billing/status")
      .then(async (response) => {
        const data = await response.json();
        if (!response.ok) throw new Error(data.error ?? "Unable to load billing status.");
        setStatus(data);
      })
      .catch((e) => setError(e.message));
  }, []);

  async function checkout(plan: string) {
    setLoading(plan); setError("");
    const response = await fetch("/api/billing/checkout", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ plan }) });
    const data = await response.json();
    if (!response.ok) { setError(data.error ?? "Unable to start checkout."); setLoading(""); return; }
    if (data.url) window.location.href = data.url;
  }

  async function openPortal() {
    setLoading("portal"); setError("");
    const response = await fetch("/api/billing/portal", { method: "POST" });
    const data = await response.json();
    if (!response.ok) { setError(data.error ?? "Unable to open billing portal."); setLoading(""); return; }
    if (data.url) window.location.href = data.url;
  }

  return <main className="dashboard-page">
    <header className="dashboard-header">
      <div><div className="badge">HELP-ME · Billing</div><h1>Plans & billing</h1><p>Subscriptions are activated from verified Stripe events.</p></div>
      <div className="actions"><Link className="button" href="/dashboard">Dashboard</Link>{status?.hasCustomer && <button className="button" disabled={!!loading} onClick={openPortal}>{loading === "portal" ? "Opening…" : "Manage billing"}</button>}</div>
    </header>
    {status && <section className="usage-panel"><div className="usage-top"><div><span>Current plan</span><strong>{status.plan ?? "STARTER"}</strong></div><div><span>Status</span><strong>{status.status ?? "ACTIVE"}</strong></div></div><p className="muted">Manage your subscription, payment method and invoices securely through Stripe.</p></section>}
    <section className="billing-grid">{plans.map((plan) => <article className={`price-card ${status?.plan === plan.code ? "featured" : ""}`} key={plan.code}>{status?.plan === plan.code && <div className="popular">CURRENT PLAN</div>}<div className="plan-name">{plan.name}</div><div className="price">{plan.price}<small>/ month</small></div><p>{plan.text}</p><button className="button primary" disabled={!!loading || status?.plan === plan.code} onClick={() => checkout(plan.code)}>{status?.plan === plan.code ? "Current plan" : loading === plan.code ? "Opening checkout…" : "Choose " + plan.name}</button></article>)}</section>
    {error && <p className="form-error">{error}</p>}
  </main>;
}
