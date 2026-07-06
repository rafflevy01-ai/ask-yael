// Caller intents the dialog manager can route to.
//
// Intent detection here is deliberately simple keyword matching so the pure
// core stays fully deterministic and unit-testable without a network call.
// In production this module is the seam where an LLM-assisted NLU adapter is
// swapped in — the rest of the engine only depends on the INTENTS contract.

export const INTENTS = Object.freeze({
  BOOK: "book",
  RESCHEDULE: "reschedule",
  CANCEL: "cancel",
  ASK: "ask",
  EMERGENCY: "emergency",
  MESSAGE: "message",
  HANDOFF: "handoff",
  UNKNOWN: "unknown",
});

// Per-locale keyword tables. Order of INTENT_PRIORITY (see below) resolves ties
// when a single utterance matches multiple intents.
const KEYWORDS = Object.freeze({
  en: Object.freeze({
    [INTENTS.EMERGENCY]: ["emergency", "urgent", "bleeding", "severe pain", "knocked out", "swelling"],
    [INTENTS.RESCHEDULE]: ["reschedule", "move my appointment", "change my appointment"],
    [INTENTS.CANCEL]: ["cancel"],
    [INTENTS.BOOK]: ["book", "appointment", "schedule", "make an appointment"],
    [INTENTS.MESSAGE]: ["leave a message", "message", "call me back", "callback"],
    [INTENTS.HANDOFF]: ["human", "receptionist", "speak to someone", "real person"],
    [INTENTS.ASK]: ["hours", "open", "where", "address", "parking", "how much", "price", "cost"],
  }),
  fr: Object.freeze({
    [INTENTS.EMERGENCY]: ["urgence", "urgent", "saigne", "douleur intense", "gonflement"],
    [INTENTS.RESCHEDULE]: ["reprogrammer", "déplacer mon rendez-vous", "changer mon rendez-vous"],
    [INTENTS.CANCEL]: ["annuler"],
    [INTENTS.BOOK]: ["rendez-vous", "réserver", "prendre rendez-vous", "planifier"],
    [INTENTS.MESSAGE]: ["laisser un message", "message", "rappelez-moi", "rappel"],
    [INTENTS.HANDOFF]: ["humain", "réceptionniste", "parler à quelqu'un", "vraie personne"],
    [INTENTS.ASK]: ["horaires", "ouvert", "où", "adresse", "parking", "combien", "prix", "tarif"],
  }),
  he: Object.freeze({
    [INTENTS.EMERGENCY]: ["חירום", "דחוף", "מדמם", "כאב חזק", "נפיחות"],
    [INTENTS.RESCHEDULE]: ["לשנות תור", "להזיז את התור", "לדחות את התור"],
    [INTENTS.CANCEL]: ["לבטל", "ביטול"],
    [INTENTS.BOOK]: ["תור", "לקבוע", "לקבוע תור", "לזמן"],
    [INTENTS.MESSAGE]: ["להשאיר הודעה", "הודעה", "תחזרו אליי", "חזרה"],
    [INTENTS.HANDOFF]: ["בנאדם", "פקידה", "לדבר עם מישהו", "נציג"],
    [INTENTS.ASK]: ["שעות", "פתוח", "איפה", "כתובת", "חניה", "כמה עולה", "מחיר"],
  }),
});

// Higher-priority intents win when multiple match. Emergency always wins.
const INTENT_PRIORITY = Object.freeze([
  INTENTS.EMERGENCY,
  INTENTS.HANDOFF,
  INTENTS.RESCHEDULE,
  INTENTS.CANCEL,
  INTENTS.BOOK,
  INTENTS.MESSAGE,
  INTENTS.ASK,
]);

// detectIntent :: (string, locale) -> Intent
// Pure: same input always yields the same intent.
export function detectIntent(text, locale) {
  if (typeof text !== "string" || text.trim() === "") return INTENTS.UNKNOWN;

  const haystack = text.toLowerCase();
  const table = KEYWORDS[locale] || KEYWORDS.en;

  const matched = INTENT_PRIORITY.filter((intent) =>
    (table[intent] || []).some((kw) => haystack.includes(kw.toLowerCase())),
  );

  return matched.length > 0 ? matched[0] : INTENTS.UNKNOWN;
}
