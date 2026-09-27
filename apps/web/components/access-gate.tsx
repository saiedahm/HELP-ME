"use client";

import { useEffect, useState } from "react";
import { signIn } from "next-auth/react";
import { usePathname } from "next/navigation";

const CONSENT_KEY = "help-me-platform-consent-v1";

export default function AccessGate() {
  const pathname = usePathname();
  const [consent, setConsent] = useState<"unknown" | "accepted" | "rejected">("unknown");
  const [loginOpen, setLoginOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [emailMessage, setEmailMessage] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    const saved = window.localStorage.getItem(CONSENT_KEY);
    if (saved === "accepted" || saved === "rejected") setConsent(saved);
  }, []);

  if (pathname.startsWith("/legal") || pathname.startsWith("/admin") || pathname.startsWith("/api")) return null;

  function accept() {
    window.localStorage.setItem(CONSENT_KEY, "accepted");
    setConsent("accepted");
    setLoginOpen(true);
  }

  function reject() {
    window.localStorage.setItem(CONSENT_KEY, "rejected");
    setConsent("rejected");
  }

  async function social(provider: "google" | "facebook") {
    setBusy(true);
    await signIn(provider, { callbackUrl: "/help" });
    setBusy(false);
  }

  function emailLogin(event: React.FormEvent) {
    event.preventDefault();
    setEmailMessage(
      "Die E-Mail-Anmeldung wird vorbereitet. Für einen sicheren E-Mail-Code benötigen wir noch einen E-Mail-Versanddienst (z. B. Resend) und die dazugehörigen Vercel-Variablen."
    );
  }

  if (consent === "unknown") {
    return (
      <div className="access-overlay" role="dialog" aria-modal="true" aria-labelledby="consent-title">
        <div className="access-card">
          <img className="access-logo" src="/help-me-logo.png" alt="HELP-ME" />
          <div className="eyebrow">Willkommen bei HELP-ME</div>
          <h2 id="consent-title">Bevor wir beginnen</h2>
          <p>
            Damit Sie HELP-ME nutzen können, bitten wir Sie, unsere Nutzungsbedingungen,
            Datenschutzinformationen und Hinweise zur Testphase zu bestätigen.
          </p>
          <p className="access-note">Sie können Ihre Entscheidung später über „Cookie-Einstellungen“ ändern.</p>
          <div className="access-actions">
            <button className="button primary" onClick={accept}>Akzeptieren &amp; fortfahren</button>
            <button className="button" onClick={reject}>Ablehnen</button>
          </div>
          <a className="access-legal" href="/legal">Rechtliche Informationen ansehen</a>
        </div>
      </div>
    );
  }

  if (consent === "rejected") {
    return (
      <div className="access-overlay" role="dialog" aria-modal="true" aria-labelledby="rejected-title">
        <div className="access-card">
          <img className="access-logo" src="/help-me-logo.png" alt="HELP-ME" />
          <h2 id="rejected-title">Ihre Entscheidung wurde gespeichert</h2>
          <p>HELP-ME kann ohne Zustimmung zu den Nutzungsbedingungen nicht verwendet werden.</p>
          <div className="access-actions">
            <button className="button primary" onClick={accept}>Zustimmen &amp; fortfahren</button>
            <a className="button" href="/legal">Rechtliche Informationen</a>
          </div>
        </div>
      </div>
    );
  }

  if (!loginOpen) return null;

  return (
    <div className="access-overlay" role="dialog" aria-modal="true" aria-labelledby="login-title">
      <div className="access-card login-card">
        <img className="access-logo" src="/help-me-logo.png" alt="HELP-ME" />
        <div className="eyebrow">Zugang zur Plattform</div>
        <h2 id="login-title">Wie möchten Sie sich anmelden?</h2>
        <p>Wählen Sie den Zugang, der für Sie am besten passt.</p>
        <div className="login-actions">
          <button className="button social google" disabled={busy} onClick={() => social("google")}>Mit Google anmelden</button>
          <button className="button social facebook" disabled={busy} onClick={() => social("facebook")}>Mit Facebook anmelden</button>
        </div>
        <div className="divider"><span>oder</span></div>
        <form className="email-login" onSubmit={emailLogin}>
          <label htmlFor="access-email">E-Mail-Adresse</label>
          <input id="access-email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="name@beispiel.de" required />
          <button className="button primary" type="submit">Mit E-Mail fortfahren</button>
        </form>
        {emailMessage && <p className="access-message" role="status">{emailMessage}</p>}
        <a className="access-legal" href="/legal">Datenschutz · AGB · Impressum</a>
      </div>
    </div>
  );
}
