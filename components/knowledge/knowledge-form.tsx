"use client";

import { FormEvent, useState } from "react";

export default function KnowledgeForm() {
  const [error, setError] = useState("");
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(false);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setSaved(false);
    setLoading(true);
    const form = new FormData(event.currentTarget);

    const response = await fetch("/api/knowledge", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title: form.get("title"),
        type: form.get("type"),
        sourceUrl: form.get("sourceUrl"),
        content: form.get("content"),
        chatbotId: form.get("chatbotId") || null,
      }),
    });
    const data = await response.json();

    if (!response.ok) {
      setError(data.error ?? "Unable to save knowledge.");
      setLoading(false);
      return;
    }

    setSaved(true);
    event.currentTarget.reset();
    setLoading(false);
  }

  return (
    <form className="auth-form" onSubmit={submit}>
      <label>Title<input name="title" placeholder="About our company" required /></label>
      <label>Type<select name="type" defaultValue="TEXT"><option value="TEXT">General information</option><option value="FAQ">FAQ</option><option value="WEBSITE">Website content</option><option value="FILE">File content</option></select></label>
      <label>Source URL<input name="sourceUrl" type="url" placeholder="https://example.com" /></label>
      <label>Knowledge<textarea name="content" rows={9} placeholder="Write the information your chatbot should know..." required /></label>
      {error && <p className="form-error">{error}</p>}
      {saved && <p className="success-message">Knowledge saved successfully.</p>}
      <button className="button primary" type="submit" disabled={loading}>{loading ? "Saving…" : "Save knowledge"}</button>
    </form>
  );
}
