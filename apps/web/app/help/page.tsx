"use client";

import { FormEvent, useMemo, useState } from "react";
import { getLanguageName, getTranslations, languageCatalog, type Locale } from "../../lib/i18n";

const examples: Record<string, string[]> = {
  de: ["Ich brauche Hilfe bei meiner Website.", "Ich möchte ein digitales Projekt starten.", "Ich brauche Unterstützung bei einem technischen Problem."],
  en: ["I need help with my website.", "I want to start a digital project.", "I need help with a technical problem."],
  ar: ["أحتاج إلى مساعدة في موقعي.", "أريد بدء مشروع رقمي.", "أحتاج إلى مساعدة في مشكلة تقنية."],
};

const rtlLocales = new Set(["ar", "he", "fa", "ur"]);

export default function HelpPage() {
  const [locale, setLocale] = useState<Locale>("de");
  const [message, setMessage] = useState("");
  const [reply, setReply] = useState("");
  const [loading, setLoading] = useState(false);
  const [languageOpen, setLanguageOpen] = useState(false);
  const t = useMemo(() => getTranslations(locale), [locale]);
  const currentExamples = examples[locale] ?? examples.en;
  const isRtl = rtlLocales.has(locale);

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
        body: JSON.stringify({ message: value, locale }),
      });
      const data = await response.json();
      setReply(data.reply ?? data.error ?? "Unknown response");
      if (response.ok) setMessage("");
    } catch {
      setReply("The request could not be processed right now.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="help-page" dir={isRtl ? "rtl" : "ltr"} lang={locale}>
      <div className="container">
        <a className="back-link" href="/">{t.back}</a>
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
        <section className="assistant-card">
          <div className="eyebrow">{t.eyebrow}</div>
          <h1>{t.title}</h1>
          <p>{t.description}</p>
          <div className="example-list" aria-label="Examples">
            {currentExamples.map((example) => (
              <button key={example} type="button" className="example-chip" onClick={() => setMessage(example)}>{example}</button>
            ))}
          </div>
          <form onSubmit={submit}>
            <label htmlFor="help-message">{t.label}</label>
            <textarea id="help-message" value={message} onChange={(event) => setMessage(event.target.value)} placeholder={t.placeholder} rows={7} maxLength={5000} required />
            <div className="form-footer">
              <span>{message.length}/5000</span>
              <button className="button primary" type="submit" disabled={loading || !message.trim()}>{loading ? t.loading : t.submit}</button>
            </div>
          </form>
          {reply && <div className="reply" role="status" aria-live="polite"><strong>HELP ME</strong><p>{reply}</p></div>}
        </section>
      </div>
    </main>
  );
}
