// Mocked telephony + ASR adapters for Phase 0.
//
// The real system streams audio over SIP/Twilio and runs per-locale ASR/TTS.
// For the risk-busting spike (and for deterministic tests) we model those
// edges as simple in-memory adapters:
//
//   - The telephony adapter records everything Yael "says" and every other
//     effect, so tests/demos can assert on the outbound side of a call.
//   - The ASR adapter turns a scripted line of caller text (plus an optional
//     detected locale) into a CALLER_UTTERANCE event.
//
// Because all I/O is isolated here, swapping in a live provider later means
// implementing this same tiny interface — the core never changes.

import { callerUtterance } from "../domain/events.js";
import { EFFECTS } from "../domain/effects.js";

// createMockTelephony :: () -> Telephony
// `perform(effect)` interprets a single effect from the core and collects a
// human-readable trace of the call for assertions/demos.
export function createMockTelephony() {
  const spoken = []; // [{ locale, text }]
  const texts = []; // [{ locale, text }] — outbound SMS/WhatsApp confirmations
  const bookings = []; // [{ callId, details }] — appointments booked at the edge
  const events = []; // full effect trace

  return {
    perform(effect) {
      events.push(effect);
      if (effect.type === EFFECTS.SAY) {
        spoken.push({ locale: effect.locale, text: effect.text });
      } else if (effect.type === EFFECTS.SEND_SMS) {
        texts.push({ locale: effect.locale, text: effect.text });
      } else if (effect.type === EFFECTS.BOOK_APPOINTMENT) {
        bookings.push({ callId: effect.callId, details: effect.details });
      }
      return effect;
    },
    // Everything Yael said, in order.
    transcript() {
      return spoken.slice();
    },
    // Outbound SMS/WhatsApp messages sent during the call.
    messages() {
      return texts.slice();
    },
    // Appointments booked against the calendar/PMS during the call.
    bookings() {
      return bookings.slice();
    },
    // The raw effect trace (SAY, LOG, ESCALATE_EMERGENCY, …).
    effects() {
      return events.slice();
    },
  };
}

// createMockAsr :: () -> Asr
// `hear(text, locale)` produces the CALLER_UTTERANCE event the core consumes.
export function createMockAsr() {
  return {
    hear(text, detectedLocale = null) {
      return callerUtterance(text, detectedLocale);
    },
  };
}
