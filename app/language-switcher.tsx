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
    helpMeGoogleTranslateInit?: () => void;
  }
}

export default function LanguageSwitcher() {
  const [language, setLanguage] = useState("en");
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const saved = window.localStorage.getItem("helpme-language");
    const initialLanguage = saved && LANGUAGES.some(([code]) => code === saved) ? saved : "en";
    setLanguage(initialLanguage);

    const host = document.getElementById("google_translate_element");
    if (!host) {
      const element = document.createElement("div");
      element.id = "google_translate_element";
      element.setAttribute("aria-hidden", "true");
      element.style.position = "absolute";
      element.style.width = "1px";
      element.style.height = "1px";
      element.style.overflow = "hidden";
      element.style.clipPath = "inset(50%)";
      document.body.appendChild(element);
    }

    const applyInitialLanguage = () => {
      const select = document.querySelector<HTMLSelectElement>(".goog-te-combo");
      if (!select) return false;
      if (initialLanguage !== "en" && select.value !== initialLanguage) {
        select.value = initialLanguage;
        select.dispatchEvent(new Event("change", { bubbles: true }));
      }
      setReady(true);
      return true;
    };

    const init = () => {
      if (window.google?.translate?.TranslateElement && !window.__helpMeTranslateReady) {
        new window.google.translate.TranslateElement({
          pageLanguage: "en",
          includedLanguages: LANGUAGES.map(([code]) => code).join(","),
          autoDisplay: false
        }, "google_translate_element");
        window.__helpMeTranslateReady = true;
      }
      if (window.google?.translate?.TranslateElement) setReady(true);
    };
    window.helpMeGoogleTranslateInit = init;

    let script = document.querySelector<HTMLScriptElement>('script[data-helpme-translate="true"]');
    if (!script) {
      script = document.createElement("script");
      script.src = "https://translate.google.com/translate_a/element.js?cb=helpMeGoogleTranslateInit";
      script.async = true;
      script.dataset.helpmeTranslate = "true";
      document.head.appendChild(script);
    } else {
      init();
    }

    const initInterval = window.setInterval(() => {
      if (window.google?.translate?.TranslateElement) {
        init();
        window.clearInterval(initInterval);
      }
    }, 250);
    const languageInterval = window.setInterval(() => {
      if (applyInitialLanguage()) window.clearInterval(languageInterval);
    }, 500);
    return () => {
      window.clearInterval(initInterval);
      window.clearInterval(languageInterval);
    };
  }, []);

  function changeLanguage(next: string) {
    setLanguage(next);
    window.localStorage.setItem("helpme-language", next);
    const select = document.querySelector<HTMLSelectElement>(".goog-te-combo");
    if (select) {
      select.value = next;
      select.dispatchEvent(new Event("change", { bubbles: true }));
    } else if (next === "en") {
      document.cookie = "googtrans=/en/en; path=/";
      window.location.reload();
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
