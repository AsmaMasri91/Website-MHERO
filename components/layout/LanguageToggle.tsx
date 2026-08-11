"use client";

import { useLocale } from "@/components/i18n/LocaleProvider";
import { Locale } from "@/lib/i18n";

export default function LanguageToggle() {
  const { locale, setLocale } = useLocale();

  return (
    <div className="flex w-fit items-center rounded-full border border-white/20 p-0.5 text-xs font-semibold uppercase tracking-widest2">
      {(["en", "ar"] as Locale[]).map((l) => (
        <button
          key={l}
          onClick={() => setLocale(l)}
          aria-pressed={locale === l}
          className={`rounded-full px-2 py-0.5 transition-colors ${
            locale === l ? "bg-white text-mhero-black" : "text-white/70 hover:text-white"
          }`}
        >
          {l}
        </button>
      ))}
    </div>
  );
}
