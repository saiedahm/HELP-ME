"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { signIn } from "next-auth/react";

export default function LoginPage() {
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setLoading(true);

    const form = new FormData(event.currentTarget);
    const result = await signIn("credentials", {
      email: String(form.get("email") ?? ""),
      password: String(form.get("password") ?? ""),
      redirect: false,
    });

    if (!result || result.error) {
      setError("Invalid email or password.");
      setLoading(false);
      return;
    }

    window.location.href = "/dashboard";
  }

  return (
    <main className="page">
      <section className="panel auth-panel">
        <div className="badge">HELP-ME · Login</div>
        <h1>Welcome back</h1>
        <p>Sign in to manage your company chatbot platform.</p>
        <form className="auth-form" onSubmit={submit}>
          <label>Email<input name="email" type="email" required autoComplete="email" /></label>
          <label>Password<input name="password" type="password" required autoComplete="current-password" /></label>
          {error && <p className="form-error">{error}</p>}
          <button className="button primary" type="submit" disabled={loading}>{loading ? "Signing in…" : "Sign in"}</button>
        </form>
        <p>New company? <Link href="/register">Create an account</Link></p>
      </section>
    </main>
  );
}
