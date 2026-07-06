// Supported locales for the receptionist.
//
// Each locale carries the *localized content* the engine needs — not just a
// language tag. Adding a new language is a data change here, never a code
// change in the core (per the multilingual strategy in docs/SPEC.md).
//
// Fields:
//   name             human-readable language name (in English, for logs/UI)
//   nativeName       language name in its own script
//   dir              text direction ("rtl" | "ltr") — reused by LanguageContext
//   emergencyNumber  locale-correct emergency number spoken during escalation

export const LOCALES = Object.freeze({
  he: Object.freeze({
    name: "Hebrew",
    nativeName: "עברית",
    dir: "rtl",
    emergencyNumber: "101",
  }),
  fr: Object.freeze({
    name: "French",
    nativeName: "Français",
    dir: "ltr",
    emergencyNumber: "15",
  }),
  en: Object.freeze({
    name: "English",
    nativeName: "English",
    dir: "ltr",
    emergencyNumber: "911",
  }),
});

// The default locale used before the caller's language is known.
export const DEFAULT_LOCALE = "en";

// The languages offered explicitly in the fallback greeting, in order.
export const OFFERED_LOCALES = Object.freeze(["he", "fr", "en"]);

export function isSupportedLocale(locale) {
  return Object.prototype.hasOwnProperty.call(LOCALES, locale);
}

export function localeDir(locale) {
  return isSupportedLocale(locale) ? LOCALES[locale].dir : "ltr";
}

export function emergencyNumber(locale) {
  return isSupportedLocale(locale)
    ? LOCALES[locale].emergencyNumber
    : LOCALES[DEFAULT_LOCALE].emergencyNumber;
}
