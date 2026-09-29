"use client";

import { useState } from "react";

export default function MembershipButton({ compact = false }: { compact?: boolean }) {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  async function subscribe() {
    setLoading(true);
    setMessage("");
    try {
      const response = await fetch("/api/billing/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ plan: "member", interval: "month" }),
      });
      const data = await response.json().catch(() => ({}));
      if (!response.ok || !data.url) throw new Error(data.error || "Checkout konnte nicht gestartet werden.");
      window.location.assign(data.url);
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Checkout konnte nicht gestartet werden.");
      setLoading(false);
    }
  }

  return (
    <div style={{ display: "inline-flex", flexDirection: "column", alignItems: compact ? "stretch" : "flex-start", gap: 6 }}>
      <button type="button" className="button primary membership-button" onClick={subscribe} disabled={loading}>
        {loading ? "Stripe wird geöffnet…" : "⭐ Mitgliedschaft · 4,99 €/Monat"}
      </button>
      {message && <small role="alert" style={{ color: "#c0392b" }}>{message}</small>}
    </div>
  );
}
