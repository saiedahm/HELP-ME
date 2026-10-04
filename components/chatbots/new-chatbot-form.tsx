"use client";

import { FormEvent, useState } from "react";

export default function NewChatbotForm() {
  const [error, setError] = useState("");
  const [created, setCreated] = useState("");
  const [loading, setLoading] = useState(false);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setCreated("");
    setLoading(true);
    const form = new FormData(event.currentTarget);

    const response = await fetch("/api/chatbots", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: form.get("name"),
        welcomeMessage: form.get("welcomeMessage"),
        primaryColor: form.get("primaryColor"),
      }),
    });
    const data = await response.json();

    if (!response.ok) {
      setError(data.error ?? "Unable to create chatbot.");
      setLoading(false);
      return;
    }

    setCreated(data.chatbot.name);
    event.currentTarget.reset();
    setLoading(false);
  }

  return (
    <form className="auth-form" onSubmit={submit}>
      <label>Chatbot name<input name="name" placeholder="My Website Assistant" required /></label>
      <label>Welcome message<textarea name="welcomeMessage" placeholder="Hello! How can I help?" rows={3} /></label>
      <label>Primary color<input name="primaryColor" type="text" defaultValue="#39d9ff" pattern="^#[0-9a-fA-F]{6}$" /></label>
      {error && <p className="form-error">{error}</p>}
      {created && <p className="success-message">Chatbot “{created}” created successfully.</p>}
      <button className="button primary" type="submit" disabled={loading}>{loading ? "Creating…" : "Create chatbot"}</button>
    </form>
  );
}
