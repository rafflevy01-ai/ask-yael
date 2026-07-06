// Effects are the *outputs* of the pure conversation core ("effects as data").
//
// The reducer never talks to a phone, an SMS gateway or a calendar directly.
// Instead it returns a list of effect descriptions, and an interpreter at the
// edge (see adapters/) carries them out. This keeps the core pure and makes
// every decision — "say this", "send that SMS", "escalate now" — trivially
// assertable in a unit test.

export const EFFECTS = Object.freeze({
  SAY: "SAY",
  SET_LANGUAGE: "SET_LANGUAGE",
  ESCALATE_EMERGENCY: "ESCALATE_EMERGENCY",
  TRANSFER_TO_HUMAN: "TRANSFER_TO_HUMAN",
  TAKE_MESSAGE: "TAKE_MESSAGE",
  BOOK_APPOINTMENT: "BOOK_APPOINTMENT",
  SEND_SMS: "SEND_SMS",
  LOG: "LOG",
  END_CALL: "END_CALL",
});

// Speak `text` to the caller in `locale` (NLG -> TTS at the edge).
export const say = (locale, text) => ({ type: EFFECTS.SAY, locale, text });

// Tell the telephony/UI layer the active language changed.
export const setLanguage = (locale) => ({ type: EFFECTS.SET_LANGUAGE, locale });

// Deterministic emergency escalation with a locale-correct script.
export const escalateEmergency = (locale, script) => ({
  type: EFFECTS.ESCALATE_EMERGENCY,
  locale,
  script,
});

// Warm transfer / handoff to a human.
export const transferToHuman = (reason) => ({
  type: EFFECTS.TRANSFER_TO_HUMAN,
  reason,
});

// Capture a message for callback.
export const takeMessage = (locale) => ({ type: EFFECTS.TAKE_MESSAGE, locale });

// Book a confirmed appointment against the calendar/PMS (executed at the edge).
// `details` carries the collected slots, e.g. { appointmentType, day }.
export const bookAppointment = (callId, details) => ({
  type: EFFECTS.BOOK_APPOINTMENT,
  callId,
  details,
});

// Send an SMS/WhatsApp confirmation or reminder (executed at the edge).
export const sendSms = (locale, text) => ({ type: EFFECTS.SEND_SMS, locale, text });

// Structured audit log entry.
export const log = (entry) => ({ type: EFFECTS.LOG, entry });

// End the call.
export const endCall = () => ({ type: EFFECTS.END_CALL });
