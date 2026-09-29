"use client";

import { useState } from "react";

export default function MembershipButton() {
  const [loading, setLoading] = useState(false);

  async function subscribe() {
    if (loading) return;
    setLoading(true);
    try {
      const response = await fetch("/api/billing/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ plan: "member", interval: "month" }),
      });
      const data = await response.json().catch(() => ({}));
      if (!response.ok || !data.url) {
        window.alert(data.error || "Unable to start membership checkout.");
        return;
      }
      window.location.href = data.url;
    } catch {
      window.alert("Unable to connect to the payment service.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <button
      type="button"
      onClick={subscribe}
      disabled={loading}
      aria-label="HELP-ME Membership 4.99 euros per month"
      style={{
        position: "fixed",
        top: 16,
        right: 16,
        zIndex: 9999,
        border: "1px solid rgba(255,255,255,.28)",
        borderRadius: 999,
        padding: "10px 15px",
        background: "linear-gradient(135deg,#111827,#2563eb)",
        color: "#fff",
        fontWeight: 700,
        cursor: loading ? "wait" : "pointer",
        boxShadow: "0 8px 24px rgba(0,0,0,.25)",
      }}
    >
      {loading ? "…" : "⭐ HELP-ME · 4,99 €/Monat"}
    </button>
  );
}
