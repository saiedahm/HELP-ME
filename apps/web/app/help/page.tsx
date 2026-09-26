"use client";

import { FormEvent, useState } from "react";

export default function HelpPage() {
  const [message, setMessage] = useState("");
  const [reply, setReply] = useState("");
  const [loading, setLoading] = useState(false);

  async function submit(event: FormEvent) {
    event.preventDefault();
    if (!message.trim() || loading) return;

    setLoading(true);
    setReply("");
    try {
      const response = await fetch("/api/help", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message }),
      });
      const data = await response.json();
      setReply(data.reply ?? data.error ?? "Unbekannter Fehler");
    } catch {
      setReply("Die Anfrage konnte gerade nicht verarbeitet werden.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="help-page">
      <div className="container">
        <a className="back-link" href="/">← HELP ME</a>
        <section className="assistant-card">
          <div className="eyebrow">HELP ME ASSISTANT</div>
          <h1>Was brauchst du?</h1>
          <p>Beschreibe dein Anliegen. Diese Oberfläche ist die Grundlage für die spätere KI-Assistenz.</p>
          <form onSubmit={submit}>
            <textarea
              value={message}
              onChange={(event) => setMessage(event.target.value)}
              placeholder="Ich brauche Hilfe bei ..."
              rows={6}
              aria-label="Deine Anfrage"
            />
            <button className="button primary" type="submit" disabled={loading || !message.trim()}>
              {loading ? "Wird verarbeitet ..." : "Anfrage senden"}
            </button>
          </form>
          {reply && <div className="reply" role="status">{reply}</div>}
        </section>
      </div>
    </main>
  );
}
