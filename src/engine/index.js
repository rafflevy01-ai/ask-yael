// Public API for the Ask-Yael conversation engine.
//
// Import surface for the rest of the app (admin dashboard, future telephony
// worker) and for tests. The core is pure and framework-agnostic; UI code can
// reuse the same locale metadata that LanguageContext relies on.

export { createEngine, reduce } from "./core/reduce.js";
export { runCall } from "./core/runCall.js";
export { phrase, offeredLanguagesLine } from "./core/phrases.js";

export { PHASES, initialState } from "./domain/state.js";
export { EVENTS, callStarted, callerUtterance, languageSelected, callEnded } from "./domain/events.js";
export { EFFECTS } from "./domain/effects.js";
export { INTENTS, detectIntent } from "./domain/intents.js";
export {
  LOCALES,
  DEFAULT_LOCALE,
  OFFERED_LOCALES,
  isSupportedLocale,
  localeDir,
  emergencyNumber,
} from "./domain/locales.js";

export { isEmergency, emergencyScript } from "./skills/triage.js";
export {
  BOOKING_STATUS,
  emptyBooking,
  advanceBooking,
  detectAppointmentType,
  detectDay,
  appointmentLabel,
} from "./skills/scheduling.js";

export { createMockTelephony, createMockAsr } from "./adapters/mockTelephony.js";
export { dentalConfig } from "./config/dental.js";
