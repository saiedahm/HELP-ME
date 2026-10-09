"use client";

import { useEffect } from "react";

declare global {
  interface Window {
    google?: {
      translate?: {
        TranslateElement: new (options: Record<string, unknown>, elementId: string) => unknown;
      };
    };
    googleTranslateElementInit?: () => void;
  }
}

const LANGUAGES = [
  ["en", "English"], ["de", "Deutsch"], ["ar", "العربية"], ["fr", "Français"],
  ["es", "Español"], ["it", "Italiano"], ["pt", "Português"], ["nl", "Nederlands"],
  ["pl", "Polski"], ["ru", "Русский"], ["tr", "Türkçe"], ["uk", "Українська"],
  ["zh-CN", "中文"], ["ja", "日本語"], ["ko", "한국어"], ["hi", "हिन्दी"],
  ["ur", "اردو"], ["fa", "فارسی"], ["bn", "বাংলা"], ["id", "Bahasa Indonesia"],
  ["sv", "Svenska"], ["el", "Ελληνικά"], ["ro", "Română"], ["vi", "Tiếng Việt"]
] as const;

export default function LanguageSelector() {
  useEffect(() => {
    const init = () => {
      if (!window.google?.translate?.TranslateElement) return;
      const host = document.getElementById("google_translate_element");
      if (host && !host.dataset.initialized) {
        new window.google.translate.TranslateElement({
          pageLanguage: "en",
          includedLanguages: LANGUAGES.map(([code]) => code).join(","),
          autoDisplay: false,
          layout: 0
        }, "google_translate_element");
        host.dataset.initialized = "true";
      }
    };

    window.googleTranslateElementInit = init;
    if (!document.querySelector('script[data-helpme-translate="true"]')) {
      const script = document.createElement("script");
      script.src = "https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit";
      script.async = true;
      script.dataset.helpmeTranslate = "true";
      script.onerror = () => console.error("Language translation service could not be loaded.");
      document.head.appendChild(script);
    } else {
      init();
    }
    return () => {
      // Keep the shared script and callback available during client-side navigation.
    };
  }, []);

  return (
    <div className="language-control" aria-label="Website language">
      <label htmlFor="helpme-language">Language / Sprache / اللغة</label>
      <select
        id="helpme-language"
        defaultValue="en"
        onChange={(event) => {
          const targetLanguage = event.target.value;
          const combo = document.querySelector<HTMLSelectElement>(".goog-te-combo");
          if (combo) {
            combo.value = targetLanguage;
            combo.dispatchEvent(new Event("change", { bubbles: true }));
          } else {
            const cookie = targetLanguage === "en" ? "/en/en" : `/en/${targetLanguage}`;
            document.cookie = `googtrans=${cookie};path=/;max-age=31536000;SameSite=Lax`;
            window.location.reload();
          }
        }}
      >
        {LANGUAGES.map(([code, name]) => <option value={code} key={code}>{name}</option>)}
      </select>
      <div id="google_translate_element" className="google-translate-hidden" aria-hidden="true" />
    </div>
  );
}
