"use client";

import { FormEvent, useState } from "react";

const examples = [
  "Ich brauche Hilfe bei meiner Website.",
  "Ich möchte ein digitales Projekt starten.",
  "Ich brauche Unterstützung bei einem technischen Problem.",
];

export default function HelpPage() {
  const [message, setMessage] = useState("");
  const [reply, setReply] = useState("");
  const [loading, setLoading] = useState(false);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const value = message.trim();
    if (!value || loading) return;

    setLoading(true);
    setReply("");
    try {
      const response = await fetch("/api/help", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: value }),
      });
      const data = await response.json();
      setReply(data.reply ?? data.error ?? "Unbekannte Antwort");
      if (response.ok) setMessage("");
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
          <p>Beschreibe dein Anliegen. HELP ME nimmt deine Anfrage strukturiert entgegen und wird anschließend mit den KI-Diensten verbunden.</p>

          <div className="example-list" aria-label="Beispiele">
            {examples.map((example) => (
              <button key={example} type="button" className="example-chip" onClick={() => setMessage(example)}>
                {example}
              </button>
            ))}
          </div>

          <form onSubmit={submit}>
            <label htmlFor="help-message">Deine Anfrage</label>
            <textarea
              id="help-message"
              value={message}
              onChange={(event) => setMessage(event.target.value)}
              placeholder="Beschreibe hier, wobei du Hilfe brauchst ..."
              rows={7}
              maxLength={5000}
              required
            />
            <div className="form-footer">
              <span>{message.length}/5000</span>
              <button className="button primary" type="submit" disabled={loading || !message.trim()}>
                {loading ? "Wird verarbeitet ..." : "Anfrage senden"}
              </button>
            </div>
          </form>

          {reply && (
            <div className="reply" role="status" aria-live="polite">
              <strong>HELP ME</strong>
              <p>{reply}</p>
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
