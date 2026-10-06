"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";

export default function SignupPage() {
  const [accepted, setAccepted] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!accepted) return;
    setSubmitted(true);
  }

  return (
    <main className="site-shell">
      <section className="panel auth-panel">
        <span className="eyebrow">HELP-ME · ACCOUNT</span>
        <h1>Create your account</h1>
        <p>Secure account registration will be connected to server-side authentication in the next foundation step.</p>
        <form onSubmit={submit} className="auth-form">
          <label>Email<input type="email" name="email" required autoComplete="email" /></label>
          <label>Password<input type="password" name="password" required minLength={8} autoComplete="new-password" /></label>
          <label className="consent">
            <input type="checkbox" checked={accepted} onChange={(e) => setAccepted(e.target.checked)} />
            <span>I accept the applicable privacy and data-use terms.</span>
          </label>
          <button className="button" type="submit" disabled={!accepted}>Create account</button>
        </form>
        {submitted && <p className="status-message">Registration form validated. Secure persistence is the next authentication step.</p>}
        <Link className="text-link" href="/privacy">Read privacy information</Link>
      </section>
    </main>
  );
}
