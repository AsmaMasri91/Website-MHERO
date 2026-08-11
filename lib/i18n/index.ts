import en from "./en";
import ar from "./ar";
import type { Dictionary } from "./en";

export type Locale = "en" | "ar";
export const LOCALE_COOKIE = "mhero-locale";
export const locales: Locale[] = ["en", "ar"];

const dictionaries: Record<Locale, Dictionary> = { en, ar };

export function getDictionary(locale: Locale): Dictionary {
  return dictionaries[locale] ?? dictionaries.en;
}

export type { Dictionary };
