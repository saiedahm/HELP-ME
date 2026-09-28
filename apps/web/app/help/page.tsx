"use client";

import { FormEvent, useMemo, useState } from "react";
import { getLanguageName, getTranslations, languageCatalog, type Locale } from "../../lib/i18n";

const examples: Record<string, string[]> = {
  de: ["Ich brauche Hilfe bei meiner Website.", "Ich möchte ein digitales Projekt starten.", "Ich brauche Unterstützung bei einem technischen Problem."],
  en: ["I need help with my website.", "I want to start a digital project.", "I need help with a technical problem."],
  ar: ["أحتاج إلى مساعدة في موقعي.", "أريد بدء مشروع رقمي.", "أحتاج إلى مساعدة في مشكلة تقنية."],
};

const rtlLocales = new Set(["ar", "he", "fa", "ur"]);

type ChatMessage = { id: number; role: "user" | "assistant"; text: string };

export default function HelpPage() {
  const [locale, setLocale] = useState<Locale>("de");
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [loading, setLoading] = useState(false);
  const [languageOpen, setLanguageOpen] = useState(false);
  const t = useMemo(() => getTranslations(locale), [locale]);
  const currentExamples = examples[locale] ?? examples.en;
  const isRtl = rtlLocales.has(locale);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const value = message.trim();
    if (!value || loading) return;

    const userMessage: ChatMessage = { id: Date.now(), role: "user", text: value };
    setMessages((current) => [...current, userMessage]);
    setMessage("");
    setLoading(true);

    try {
      const response = await fetch("/api/help", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: value, locale }),
      });
      const data = await response.json().catch(() => ({}));
      const reply = data.reply ?? data.error ?? "HELP-ME could not answer this request right now.";
      setMessages((current) => [
        ...current,
        { id: Date.now() + 1, role: "assistant", text: reply },
      ]);
    } catch {
      setMessages((current) => [
        ...current,
        { id: Date.now() + 1, role: "assistant", text: "HELP-ME could not connect to the service right now." },
      ]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="help-page" dir={isRtl ? "rtl" : "ltr"} lang={locale}>
      <div className="container">
        <a className="back-link" href="/">← HELP-ME</a>
        <div className="help-brand">
          <img src="/help-me-logo.png" alt="HELP-ME" />
          <span>HELP-ME</span>
        </div>
        <div style={{ position: "relative", display: "flex", justifyContent: "flex-end", marginBottom: 24 }}>
          <button type="button" onClick={() => setLanguageOpen((open) => !open)} aria-expanded={languageOpen} aria-label="Choose language">
            {getLanguageName(locale)} ▾
          </button>
          {languageOpen && (
            <div role="listbox" aria-label="Languages" style={{ position: "absolute", top: "100%", zIndex: 10, maxHeight: 320, overflowY: "auto", minWidth: 190 }}>
              {languageCatalog.map(([code, name]) => (
                <button key={code} type="button" role="option" aria-selected={locale === code} onClick={() => { setLocale(code); setLanguageOpen(false); }} style={{ display: "block", width: "100%", textAlign: "start" }}>
                  {name} ({code.toUpperCase()})
                </button>
              ))}
            </div>
          )}
        </div>

        <section className="assistant-card chat-card">
          <div className="eyebrow">{t.eyebrow}</div>
          <h1>{t.title}</h1>
          <p>{t.description}</p>

          <div className="chat-window" aria-live="polite">
            {messages.length === 0 ? (
              <div className="chat-empty">
                <strong>HELP-ME AI</strong>
                <span> {t.description}</span>
              </div>
            ) : (
              messages.map((item) => (
                <div key={item.id} className={`chat-row ${item.role}`}>
                  <div className="chat-avatar">{item.role === "user" ? "👤" : "🤖"}</div>
                  <div className="chat-bubble">
                    <div className="chat-label">{item.role === "user" ? "You" : "HELP-ME AI"}</div>
                    <div>{item.text}</div>
                  </div>
                </div>
              ))
            )}
            {loading && (
              <div className="chat-row assistant">
                <div className="chat-avatar">🤖</div>
                <div className="chat-bubble typing"><div className="chat-label">HELP-ME AI</div><span>● ● ●</span></div>
              </div>
            )}
          </div>

          <div className="example-list" aria-label="Examples">
            {currentExamples.map((example) => (
              <button key={example} type="button" className="example-chip" onClick={() => setMessage(example)}>{example}</button>
            ))}
          </div>

          <form onSubmit={submit} className="chat-input-form">
            <label htmlFor="help-message">{t.label}</label>
            <div className="chat-input-row">
              <textarea id="help-message" value={message} onChange={(event) => setMessage(event.target.value)} placeholder={t.placeholder} rows={2} maxLength={5000} required />
              <button className="button primary chat-send" type="submit" disabled={loading || !message.trim()} aria-label={t.submit}>➤</button>
            </div>
            <div className="form-footer"><span>{message.length}/5000</span><span>{loading ? t.loading : ""}</span></div>
          </form>
        </section>
      </div>
    </main>
  );
}
