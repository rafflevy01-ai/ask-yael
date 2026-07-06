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
export {
  AMENDMENT_KINDS,
  AMENDMENT_STATUS,
  emptyAmendment,
  advanceAmendment,
} from "./skills/amendment.js";
export { findFaqAnswer, matchFaqEntry } from "./skills/faq.js";

export { createMockTelephony, createMockAsr } from "./adapters/mockTelephony.js";
export { createMockCalendar } from "./adapters/mockCalendar.js";
export {
  createElevenLabsTelephony,
  createElevenLabsAsr,
  ELEVENLABS_API_BASE,
  DEFAULT_TTS_MODEL,
  DEFAULT_STT_MODEL,
} from "./adapters/elevenLabsTelephony.js";
export {
  createVoiceProfile,
  createVoiceProfileFromEnv,
  missingVoiceRequirements,
  isVoiceProfileReady,
  assertVoiceProfileReady,
  REQUIRED_VOICE_LOCALES,
  VOICE_FINALIZATION_CHECKLIST,
} from "./config/voiceProfile.js";
export {
  createGoogleCalendar,
  createGoogleCalendarClient,
  GOOGLE_CALENDAR_API_BASE,
} from "./adapters/googleCalendar.js";
export {
  createDentalPms,
  createDentalPmsClient,
} from "./adapters/dentalPms.js";
export { dentalConfig, dentalClinicProfile } from "./config/dental.js";
export {
  createLiveReceptionist,
  describeLiveReadiness,
  missingLiveConfig,
  assertLiveConfigReady,
} from "./config/liveConfig.js";
export { buildKnowledgeBase, FAQ_TOPIC_IDS } from "./config/knowledgeBase.js";

export {
  buildCallRecord,
  summarize,
  upcomingAppointments,
  CALL_OUTCOMES,
} from "./admin/callLog.js";
export { demoCallRecords } from "./admin/demoCalls.js";
