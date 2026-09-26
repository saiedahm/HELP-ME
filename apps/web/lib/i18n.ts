export const supportedLocales = ["de", "en", "ar"] as const;
export type Locale = (typeof supportedLocales)[number];

export const translations: Record<Locale, Record<string, string>> = {
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
  en: {
    back: "← HELP ME",
    eyebrow: "HELP ME ASSISTANT",
    title: "What do you need?",
    description: "Describe your request. HELP ME receives it and supports you step by step.",
    label: "Your request",
    placeholder: "Describe what you need help with ...",
    submit: "Send request",
    loading: "Processing ...",
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
