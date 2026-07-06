// Scheduling skill — the heart of the Phase 1 dental prototype.
//
// A pure, deterministic multi-turn slot-filler that collects the details Yael
// needs to book an appointment: the appointment *type* (from the vertical
// config's catalogue) and a preferred *day*. It performs NO I/O — like the rest
// of the core it only maps (booking, utterance) -> next booking, and the edge
// runs the resulting BOOK_APPOINTMENT / SEND_SMS effects.
//
// Keeping this a small state machine (mirroring the top-level dialog manager)
// means the whole booking conversation is exhaustively unit-testable without
// telephony, ASR, or a calendar, and a new language is a data change (locale
// keyword tables) rather than a code change.

// The slots we still need before a booking can be confirmed, plus completion.
export const BOOKING_STATUS = Object.freeze({
  ASK_TYPE: "ask_type",
  ASK_DAY: "ask_day",
  COMPLETE: "complete",
});

// Recognisable day tokens per locale. A caller may also answer the day prompt
// with free text (e.g. "next Tuesday afternoon"); see advanceBooking below.
const DAY_TOKENS = Object.freeze({
  en: Object.freeze([
    "today", "tomorrow",
    "monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday",
  ]),
  fr: Object.freeze([
    "aujourd'hui", "demain",
    "lundi", "mardi", "mercredi", "jeudi", "vendredi", "samedi", "dimanche",
  ]),
  he: Object.freeze([
    "היום", "מחר",
    "יום ראשון", "יום שני", "יום שלישי", "יום רביעי", "יום חמישי", "יום שישי", "שבת",
  ]),
});

// emptyBooking :: () -> Booking
// The initial, empty booking slot bag. `awaiting` records which slot Yael last
// asked for, so a free-text answer to the day prompt can be accepted verbatim.
export function emptyBooking() {
  return Object.freeze({ appointmentType: null, day: null, awaiting: null });
}

// detectAppointmentType :: (string, locale, Config) -> code | null
// Matches the utterance against each catalogue entry's localized keywords (and
// its English label/code as a sensible fallback). Pure and order-stable.
export function detectAppointmentType(text, locale, config = {}) {
  if (typeof text !== "string" || text.trim() === "") return null;
  const haystack = text.toLowerCase();
  const types = config.appointmentTypes || [];

  for (const type of types) {
    const candidates = [
      ...((type.keywords && type.keywords[locale]) || []),
      type.label || "",
      type.code || "",
    ];
    if (candidates.some((c) => c && haystack.includes(String(c).toLowerCase()))) {
      return type.code;
    }
  }
  return null;
}

// detectDay :: (string, locale) -> string | null
// Returns the recognised day token (as written in the locale) or null.
export function detectDay(text, locale) {
  if (typeof text !== "string" || text.trim() === "") return null;
  const haystack = text.toLowerCase();
  const tokens = DAY_TOKENS[locale] || DAY_TOKENS.en;
  return tokens.find((t) => haystack.includes(t.toLowerCase())) || null;
}

// advanceBooking :: (Booking, Config, locale, string) -> { booking, status }
// Folds one caller utterance into the booking, filling any slots it can, then
// reports whether we still need the type, still need the day, or are complete.
export function advanceBooking(prev, config, locale, text) {
  const current = prev || emptyBooking();
  const utterance = typeof text === "string" ? text : "";

  let appointmentType = current.appointmentType;
  if (!appointmentType) {
    appointmentType = detectAppointmentType(utterance, locale, config);
  }

  let day = current.day;
  if (!day) {
    day = detectDay(utterance, locale);
    // A caller answering the "which day?" prompt with free text we couldn't
    // tokenise still expressed a preference — accept it verbatim rather than
    // looping forever on the same question.
    if (!day && current.awaiting === "day" && utterance.trim() !== "") {
      day = utterance.trim();
    }
  }

  if (!appointmentType) {
    return {
      booking: Object.freeze({ appointmentType: null, day, awaiting: "type" }),
      status: BOOKING_STATUS.ASK_TYPE,
    };
  }
  if (!day) {
    return {
      booking: Object.freeze({ appointmentType, day: null, awaiting: "day" }),
      status: BOOKING_STATUS.ASK_DAY,
    };
  }
  return {
    booking: Object.freeze({ appointmentType, day, awaiting: null }),
    status: BOOKING_STATUS.COMPLETE,
  };
}

// appointmentLabel :: (code, Config) -> string
// The human-readable label for a booked type (for confirmations/logs).
export function appointmentLabel(code, config = {}) {
  const match = (config.appointmentTypes || []).find((t) => t.code === code);
  return match ? match.label : code;
}
