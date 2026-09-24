 export type Locale =
  | "en"
  | "ar";

export type TextDirection =
  | "ltr"
  | "rtl";

export interface LocaleConfig {
  locale: Locale;
  direction: TextDirection;
  name: string;
  nativeName: string;
}

export type TranslationDictionary =
  Record<string, string>;

export interface TranslationResources {
  locale: Locale;
  translations: TranslationDictionary;
}

export interface TranslationOptions {
  locale?: Locale;
  fallbackLocale?: Locale;
  variables?: Record<string, string | number>;
}
