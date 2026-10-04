"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { signIn } from "next-auth/react";

export default function RegisterPage() {
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setLoading(true);

    const form = new FormData(event.currentTarget);
    const response = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: String(form.get("name") ?? ""),
        email: String(form.get("email") ?? ""),
        companyName: String(form.get("companyName") ?? ""),
        password: String(form.get("password") ?? ""),
        privacyConsent: form.get("privacyConsent") === "on",
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      setError(data.error ?? "Unable to create the account.");
      setLoading(false);
      return;
    }

    const login = await signIn("credentials", {
      email: String(form.get("email") ?? ""),
      password: String(form.get("password") ?? ""),
      redirect: false,
    });

    if (!login || login.error) {
      setError("Account created. Please sign in.");
      setLoading(false);
      return;
    }

    window.location.href = "/dashboard";
  }

  return (
    <main className="page">
      <section className="panel auth-panel">
        <div className="badge">HELP-ME · Register</div>
        <h1>Create your company account</h1>
        <p>Start with a free workspace and build your first chatbot.</p>
        <form className="auth-form" onSubmit={submit}>
          <label>Your name<input name="name" required autoComplete="name" /></label>
          <label>Company name<input name="companyName" required autoComplete="organization" /></label>
          <label>Email<input name="email" type="email" required autoComplete="email" /></label>
          <label>Password<input name="password" type="password" minLength={8} required autoComplete="new-password" /></label>
          <label className="checkbox-row">
            <input name="privacyConsent" type="checkbox" required />
            <span>I accept the privacy policy and data processing terms.</span>
          </label>
          {error && <p className="form-error">{error}</p>}
          <button className="button primary" type="submit" disabled={loading}>{loading ? "Creating…" : "Create account"}</button>
        </form>
        <p>Already registered? <Link href="/login">Sign in</Link></p>
      </section>
    </main>
  );
}
