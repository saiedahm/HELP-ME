import type { Locale, LocaleConfig } from "./types";

export const LOCALES: Record<Locale, LocaleConfig> = {
  en: { locale: "en", direction: "ltr", name: "English", nativeName: "English" },
  ar: { locale: "ar", direction: "rtl", name: "Arabic", nativeName: "العربية" },
};

export const DEFAULT_LOCALE: Locale = "en";
export const SUPPORTED_LOCALES = Object.keys(LOCALES) as Locale[];
