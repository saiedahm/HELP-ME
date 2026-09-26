export const languageCatalog = [
  ["de", "Deutsch"],
  ["en", "English"],
  ["ar", "العربية"],
  ["fr", "Français"],
  ["es", "Español"],
  ["it", "Italiano"],
  ["pt", "Português"],
  ["nl", "Nederlands"],
  ["pl", "Polski"],
  ["cs", "Čeština"],
  ["sk", "Slovenčina"],
  ["hu", "Magyar"],
  ["ro", "Română"],
  ["bg", "Български"],
  ["el", "Ελληνικά"],
  ["tr", "Türkçe"],
  ["ru", "Русский"],
  ["uk", "Українська"],
  ["he", "עברית"],
  ["fa", "فارسی"],
  ["ur", "اردو"],
  ["hi", "हिन्दी"],
  ["bn", "বাংলা"],
  ["ta", "தமிழ்"],
  ["te", "తెలుగు"],
  ["th", "ไทย"],
  ["vi", "Tiếng Việt"],
  ["id", "Bahasa Indonesia"],
  ["ms", "Bahasa Melayu"],
  ["ko", "한국어"],
  ["ja", "日本語"],
  ["zh", "中文"],
  ["sw", "Kiswahili"],
  ["am", "አማርኛ"],
] as const;

export const supportedLocales = languageCatalog.map(([code]) => code);
export type Locale = (typeof supportedLocales)[number];

type Translation = {
  back: string;
  eyebrow: string;
  title: string;
  description: string;
  label: string;
  placeholder: string;
  submit: string;
  loading: string;
};

const base: Translation = {
  back: "← HELP ME",
  eyebrow: "HELP ME ASSISTANT",
  title: "What do you need?",
  description: "Describe your request. HELP ME receives it and supports you step by step.",
  label: "Your request",
  placeholder: "Describe what you need help with ...",
  submit: "Send request",
  loading: "Processing ...",
};

export const translations: Record<string, Translation> = {
  en: base,
  de: {
    back: "← HELP ME",
    eyebrow: "HELP ME ASSISTENT",
    title: "Was brauchst du?",
    description: "Beschreibe dein Anliegen. HELP ME nimmt deine Anfrage entgegen und unterstützt dich Schritt für Schritt.",
    label: "Deine Anfrage",
    placeholder: "Beschreibe hier, wobei du Hilfe brauchst ...",
    submit: "Anfrage senden",
    loading: "Wird verarbeitet ...",
  },
  ar: {
    back: "← HELP ME",
    eyebrow: "مساعد HELP ME",
    title: "بماذا تحتاج المساعدة؟",
    description: "اكتب طلبك، وسيستقبله HELP ME ويساعدك خطوة بخطوة.",
    label: "طلبك",
    placeholder: "اكتب هنا ما تحتاج المساعدة فيه ...",
    submit: "إرسال الطلب",
    loading: "جارٍ المعالجة ...",
  },
};

export function getTranslations(locale: string): Translation {
  return translations[locale] ?? base;
}

export function getLanguageName(locale: string): string {
  return languageCatalog.find(([code]) => code === locale)?.[1] ?? locale;
}
