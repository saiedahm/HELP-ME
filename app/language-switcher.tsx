"use client";

import { useEffect, useState } from "react";

const LANGUAGES = [
  ["en", "English"], ["de", "Deutsch"], ["ar", "العربية"], ["fr", "Français"],
  ["es", "Español"], ["it", "Italiano"], ["pt", "Português"], ["nl", "Nederlands"],
  ["tr", "Türkçe"], ["ru", "Русский"], ["uk", "Українська"], ["pl", "Polski"],
  ["ro", "Română"], ["el", "Ελληνικά"], ["sv", "Svenska"], ["hi", "हिन्दी"],
  ["ur", "اردو"], ["zh-CN", "中文"], ["ja", "日本語"], ["bn", "বাংলা"]
] as const;

declare global {
  interface Window {
    google?: { translate?: { TranslateElement: new (options: Record<string, unknown>, elementId: string) => unknown } };
    __helpMeTranslateReady?: boolean;
  }
}

export default function LanguageSwitcher() {
  const [language, setLanguage] = useState("en");
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const saved = window.localStorage.getItem("helpme-language");
    if (saved && LANGUAGES.some(([code]) => code === saved)) setLanguage(saved);
    const existing = document.getElementById("google_translate_element");
    if (!existing) {
      const host = document.createElement("div");
      host.id = "google_translate_element";
      host.setAttribute("aria-hidden", "true");
      host.style.position = "absolute";
      host.style.width = "1px";
      host.style.height = "1px";
      host.style.overflow = "hidden";
      host.style.clipPath = "inset(50%)";
      document.body.appendChild(host);
    }
    const init = () => {
      if (window.google?.translate?.TranslateElement && !window.__helpMeTranslateReady) {
        new window.google.translate.TranslateElement({
          pageLanguage: "en",
          includedLanguages: LANGUAGES.map(([code]) => code).join(","),
          autoDisplay: false
        }, "google_translate_element");
        window.__helpMeTranslateReady = true;
        setReady(true);
      }
    };
    const prior = document.querySelector<HTMLScriptElement>('script[data-helpme-translate="true"]');
    if (!prior) {
      const script = document.createElement("script");
      script.src = "https://translate.google.com/translate_a/element.js?cb=helpMeGoogleTranslateInit";
      script.async = true;
      script.dataset.helpmeTranslate = "true";
      (window as Window & { helpMeGoogleTranslateInit?: () => void }).helpMeGoogleTranslateInit = init;
      document.head.appendChild(script);
    } else {
      (window as Window & { helpMeGoogleTranslateInit?: () => void }).helpMeGoogleTranslateInit = init;
      init();
    }
    const check = window.setInterval(() => {
      if (window.google?.translate?.TranslateElement) {
        init();
        window.clearInterval(check);
      }
    }, 250);
    return () => window.clearInterval(check);
  }, []);

  function changeLanguage(next: string) {
    setLanguage(next);
    window.localStorage.setItem("helpme-language", next);
    const select = document.querySelector<HTMLSelectElement>(".goog-te-combo");
    if (select) {
      select.value = next;
      select.dispatchEvent(new Event("change", { bubbles: true }));
    } else if (next === "en") {
      const reset = document.querySelector<HTMLSelectElement>(".goog-te-combo");
      if (reset) {
        reset.value = "en";
        reset.dispatchEvent(new Event("change", { bubbles: true }));
      } else {
        document.cookie = "googtrans=/en/en; path=/";
        window.location.reload();
      }
    }
  }

  return (
    <label className="language-switcher">
      <span aria-hidden="true">◎</span>
      <span className="language-label">Language</span>
      <select aria-label="Choose page language" value={language} onChange={event => changeLanguage(event.target.value)}>
        {LANGUAGES.map(([code, label]) => <option key={code} value={code}>{label}</option>)}
      </select>
      <span className="sr-only" aria-live="polite">{ready ? "Translation options ready" : "Loading translation options"}</span>
    </label>
  );
}
