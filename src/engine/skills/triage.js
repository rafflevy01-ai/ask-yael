// Emergency triage skill.
//
// Safety-critical and therefore deliberately deterministic — no LLM in the
// hot path. Given a caller utterance and locale, decide whether this is an
// emergency and, if so, produce the locale-correct escalation script.
//
// The keyword set intentionally mirrors the EMERGENCY intent in
// domain/intents.js but is kept independent here so triage can be tightened
// (e.g. dental "knocked-out tooth" is time-critical) without loosening intent
// routing. Vertical config packs may extend the trigger list.

import { emergencyNumber } from "../domain/locales.js";
import { phrase } from "../core/phrases.js";

// Baseline, profession-agnostic emergency triggers per locale.
const BASE_TRIGGERS = Object.freeze({
  en: ["emergency", "bleeding", "severe pain", "can't breathe", "chest pain", "swelling"],
  fr: ["urgence", "saigne", "douleur intense", "je ne peux pas respirer", "douleur à la poitrine", "gonflement"],
  he: ["חירום", "מדמם", "כאב חזק", "לא יכול לנשום", "כאב בחזה", "נפיחות"],
});

// isEmergency :: (string, locale, string[]?) -> boolean
// `extraTriggers` lets a vertical config pack add domain-specific red flags.
export function isEmergency(text, locale, extraTriggers = []) {
  if (typeof text !== "string" || text.trim() === "") return false;
  const haystack = text.toLowerCase();
  const triggers = [...(BASE_TRIGGERS[locale] || BASE_TRIGGERS.en), ...extraTriggers];
  return triggers.some((t) => haystack.includes(String(t).toLowerCase()));
}

// emergencyScript :: (locale) -> string
// The exact words Yael says while escalating, with the locale's emergency
// number interpolated (101 IL / 15 FR / 911 US).
export function emergencyScript(locale) {
  return phrase(locale, "emergency", { number: emergencyNumber(locale) });
}
