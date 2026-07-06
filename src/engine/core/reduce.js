// The pure conversation core: reduce :: (State, Event, Config) -> { state, effects }
//
// This is the functional-idioms backbone of the whole system. It performs NO
// I/O. Given the current immutable state and an incoming event, it returns the
// next immutable state plus a list of effects (data) for the edge to run.
// Because it is pure and deterministic, the entire dialog can be exercised in
// unit tests without telephony, ASR, or TTS.

import { EVENTS } from "../domain/events.js";
import { DEFAULT_LOCALE, isSupportedLocale, emergencyNumber } from "../domain/locales.js";
import { INTENTS, detectIntent } from "../domain/intents.js";
import { PHASES, initialState, patch, appendTranscript } from "../domain/state.js";
import * as Fx from "../domain/effects.js";
import { phrase } from "./phrases.js";
import { isEmergency, emergencyScript } from "../skills/triage.js";
import {
  advanceBooking,
  emptyBooking,
  appointmentLabel,
  BOOKING_STATUS,
} from "../skills/scheduling.js";
import {
  advanceAmendment,
  emptyAmendment,
  AMENDMENT_KINDS,
  AMENDMENT_STATUS,
} from "../skills/amendment.js";
import { findFaqAnswer } from "../skills/faq.js";

// Spoken hints used to recognise a language choice from free text, e.g. the
// caller answering the menu with "English please" or "עברית".
const LANGUAGE_HINTS = Object.freeze({
  he: ["hebrew", "hébreu", "hebreu", "עברית"],
  fr: ["french", "français", "francais", "צרפתית"],
  en: ["english", "anglais", "אנגלית"],
});

// resolveLocale :: (string, detectedLocale) -> locale | null
// Prefer a trustworthy ASR detection, otherwise parse a spoken choice.
function resolveLocale(text, detectedLocale) {
  if (isSupportedLocale(detectedLocale)) return detectedLocale;
  const haystack = (text || "").toLowerCase();
  const match = Object.keys(LANGUAGE_HINTS).find((code) =>
    LANGUAGE_HINTS[code].some((hint) => haystack.includes(hint.toLowerCase())),
  );
  return match || null;
}

// A tiny accumulator so a handler can emit a "say" and mirror it into the
// transcript in one call, keeping every reply auditable.
function reply(state, effects, locale, key, vars) {
  const text = phrase(locale, key, vars);
  return {
    state: appendTranscript(state, "yael", text),
    effects: [...effects, Fx.say(locale, text)],
  };
}

// --- individual event handlers (all pure) ---------------------------------

function onCallStarted(state, event) {
  const locale = DEFAULT_LOCALE; // language not yet known
  let next = patch(state, {
    callId: event.callId,
    phase: PHASES.LANGUAGE_SELECTION,
  });
  const effects = [Fx.log({ kind: "call_started", callId: event.callId })];

  let acc = reply(next, effects, locale, "greeting");
  acc = reply(acc.state, acc.effects, locale, "languageMenu");
  return { state: acc.state, effects: acc.effects };
}

function onEmergency(state, locale) {
  const script = emergencyScript(locale);
  const next = appendTranscript(
    patch(state, { intent: INTENTS.EMERGENCY, phase: PHASES.ROUTING }),
    "yael",
    script,
  );
  return {
    state: next,
    effects: [
      Fx.log({ kind: "emergency_detected", locale, number: emergencyNumber(locale) }),
      Fx.escalateEmergency(locale, script),
      Fx.say(locale, script),
    ],
  };
}

function onLanguageSelection(state, event, locale) {
  const resolved = resolveLocale(event.text, event.detectedLocale);
  if (!resolved) {
    // Couldn't tell — offer the menu again in the fallback language.
    return reply(state, [], locale, "languageMenu");
  }
  const next = patch(state, { locale: resolved, phase: PHASES.ROUTING });
  const acc = reply(next, [Fx.setLanguage(resolved)], resolved, "howCanIHelp");
  return { state: acc.state, effects: acc.effects };
}

// Map a routed intent to its reply key and any accompanying side-effect. Only
// the single-turn intents live here; BOOK / RESCHEDULE / CANCEL / ASK / MESSAGE
// are handled by their dedicated skill handlers below.
const INTENT_ROUTES = Object.freeze({
  [INTENTS.HANDOFF]: { key: "handoff", effect: () => Fx.transferToHuman("caller_requested") },
  [INTENTS.UNKNOWN]: { key: "fallback" },
});

// onBooking drives the Scheduling skill's slot-filling machine. It folds the
// caller's utterance into the booking, then either asks for the next missing
// slot (type/day) or, once complete, emits the BOOK_APPOINTMENT + SMS
// confirmation effects and returns to general routing.
function onBooking(state, prevBooking, config, locale, text) {
  const { booking, status } = advanceBooking(prevBooking, config, locale, text);

  if (status === BOOKING_STATUS.ASK_TYPE) {
    const next = patch(state, { intent: INTENTS.BOOK, phase: PHASES.BOOKING, booking });
    return reply(next, [], locale, "askAppointmentType");
  }
  if (status === BOOKING_STATUS.ASK_DAY) {
    const next = patch(state, { intent: INTENTS.BOOK, phase: PHASES.BOOKING, booking });
    return reply(next, [], locale, "askDay");
  }

  // COMPLETE — confirm, book against the calendar, and text the confirmation.
  const vars = { type: appointmentLabel(booking.appointmentType, config), day: booking.day };
  const next = patch(state, { intent: INTENTS.BOOK, phase: PHASES.ROUTING, booking: null });
  const effects = [
    Fx.log({ kind: "appointment_booked", callId: state.callId, details: booking }),
    Fx.bookAppointment(state.callId, {
      appointmentType: booking.appointmentType,
      day: booking.day,
      locale,
    }),
    Fx.sendSms(locale, phrase(locale, "smsConfirmation", vars)),
  ];
  return reply(next, effects, locale, "bookingConfirmed", vars);
}

// onAmendment drives the reschedule/cancel slot-filling machine. It folds the
// caller's utterance into the amendment, then either asks for the next missing
// slot (name / current day / new day) or, once complete, emits the
// RESCHEDULE_APPOINTMENT or CANCEL_APPOINTMENT + SMS confirmation effects and
// returns to general routing.
const AMENDMENT_PROMPT = Object.freeze({
  [AMENDMENT_KINDS.RESCHEDULE]: {
    [AMENDMENT_STATUS.ASK_NAME]: "rescheduleAskName",
    [AMENDMENT_STATUS.ASK_DAY]: "rescheduleAskDay",
    [AMENDMENT_STATUS.ASK_NEW_DAY]: "rescheduleAskNewDay",
    phase: PHASES.RESCHEDULING,
    intent: INTENTS.RESCHEDULE,
  },
  [AMENDMENT_KINDS.CANCEL]: {
    [AMENDMENT_STATUS.ASK_NAME]: "cancelAskName",
    [AMENDMENT_STATUS.ASK_DAY]: "cancelAskDay",
    phase: PHASES.CANCELLING,
    intent: INTENTS.CANCEL,
  },
});

function onAmendment(state, prevAmendment, locale, text) {
  const { amendment, status } = advanceAmendment(prevAmendment, locale, text);
  const meta = AMENDMENT_PROMPT[amendment.kind];

  if (status !== AMENDMENT_STATUS.COMPLETE) {
    const next = patch(state, { intent: meta.intent, phase: meta.phase, amendment });
    return reply(next, [], locale, meta[status]);
  }

  // COMPLETE — confirm, apply against the calendar/PMS, and text the confirmation.
  const next = patch(state, { intent: meta.intent, phase: PHASES.ROUTING, amendment: null });
  if (amendment.kind === AMENDMENT_KINDS.RESCHEDULE) {
    const vars = { day: amendment.day, newDay: amendment.newDay };
    const effects = [
      Fx.log({ kind: "appointment_rescheduled", callId: state.callId, details: amendment }),
      Fx.rescheduleAppointment(state.callId, {
        name: amendment.name,
        day: amendment.day,
        newDay: amendment.newDay,
        locale,
      }),
      Fx.sendSms(locale, phrase(locale, "smsReschedule", vars)),
    ];
    return reply(next, effects, locale, "rescheduleConfirmed", vars);
  }

  const vars = { day: amendment.day };
  const effects = [
    Fx.log({ kind: "appointment_cancelled", callId: state.callId, details: amendment }),
    Fx.cancelAppointment(state.callId, {
      name: amendment.name,
      day: amendment.day,
      locale,
    }),
    Fx.sendSms(locale, phrase(locale, "smsCancel", vars)),
  ];
  return reply(next, effects, locale, "cancelConfirmed", vars);
}

// onFaq answers a question from the per-clinic knowledge base, falling back to a
// generic reply when nothing matches.
function onFaq(state, locale, config, text) {
  const answer = findFaqAnswer(text, locale, config);
  const withIntent = patch(state, { intent: INTENTS.ASK, phase: PHASES.ROUTING });
  if (answer) {
    const heard = appendTranscript(withIntent, "yael", answer);
    return {
      state: heard,
      effects: [Fx.log({ kind: "faq_answered", locale }), Fx.say(locale, answer)],
    };
  }
  return reply(withIntent, [], locale, "faq");
}

// onMessageStart prompts the caller for their message and enters the MESSAGE
// phase; onMessageCapture then records the message and requests a callback.
function onMessageStart(state, locale) {
  const next = patch(state, { intent: INTENTS.MESSAGE, phase: PHASES.MESSAGE });
  return reply(next, [Fx.takeMessage(locale)], locale, "takeMessage");
}

function onMessageCapture(state, locale, text) {
  const message = typeof text === "string" ? text.trim() : "";
  const next = patch(state, { intent: INTENTS.MESSAGE, phase: PHASES.ROUTING });
  const effects = [
    Fx.log({ kind: "callback_requested", callId: state.callId, message }),
    Fx.requestCallback(locale, message),
  ];
  return reply(next, effects, locale, "messageCaptured");
}

function onRouting(state, event, locale, config) {
  const intent = detectIntent(event.text, locale);
  if (intent === INTENTS.BOOK) {
    return onBooking(state, emptyBooking(), config, locale, event.text);
  }
  if (intent === INTENTS.RESCHEDULE) {
    return onAmendment(state, emptyAmendment(AMENDMENT_KINDS.RESCHEDULE), locale, event.text);
  }
  if (intent === INTENTS.CANCEL) {
    return onAmendment(state, emptyAmendment(AMENDMENT_KINDS.CANCEL), locale, event.text);
  }
  if (intent === INTENTS.ASK) {
    return onFaq(state, locale, config, event.text);
  }
  if (intent === INTENTS.MESSAGE) {
    return onMessageStart(state, locale);
  }
  const route = INTENT_ROUTES[intent] || INTENT_ROUTES[INTENTS.UNKNOWN];
  const withIntent = patch(state, { intent });
  const sideEffects = route.effect ? [route.effect(locale)] : [];
  return reply(withIntent, sideEffects, locale, route.key);
}

// activeLocale :: (State, Event) -> locale
// The locale to speak in right now: the confirmed call locale if we have one,
// otherwise a trustworthy ASR detection, otherwise the default.
function activeLocale(state, event) {
  if (state.locale) return state.locale;
  if (isSupportedLocale(event.detectedLocale)) return event.detectedLocale;
  return DEFAULT_LOCALE;
}

function onCallerUtterance(state, event, config) {
  const locale = activeLocale(state, event);
  const heard = appendTranscript(state, "caller", event.text);

  // Safety first: emergencies short-circuit every phase.
  if (isEmergency(event.text, locale, config.emergencyTriggers)) {
    return onEmergency(heard, locale);
  }

  if (heard.phase === PHASES.LANGUAGE_SELECTION && !heard.locale) {
    return onLanguageSelection(heard, event, locale);
  }

  // Continue an in-progress multi-turn skill before general routing.
  if (heard.phase === PHASES.BOOKING && heard.booking) {
    return onBooking(heard, heard.booking, config, locale, event.text);
  }
  if (
    (heard.phase === PHASES.RESCHEDULING || heard.phase === PHASES.CANCELLING) &&
    heard.amendment
  ) {
    return onAmendment(heard, heard.amendment, locale, event.text);
  }
  if (heard.phase === PHASES.MESSAGE) {
    return onMessageCapture(heard, locale, event.text);
  }

  return onRouting(heard, event, locale, config);
}

function onCallEnded(state) {
  const locale = state.locale || DEFAULT_LOCALE;
  const ended = patch(state, { phase: PHASES.ENDED });
  const acc = reply(ended, [Fx.log({ kind: "call_ended", callId: state.callId })], locale, "goodbye");
  return { state: acc.state, effects: [...acc.effects, Fx.endCall()] };
}

// reduce :: (State, Event, Config) -> { state, effects }
export function reduce(state, event, config = {}) {
  switch (event.type) {
    case EVENTS.CALL_STARTED:
      return onCallStarted(state, event);
    case EVENTS.CALLER_UTTERANCE:
      return onCallerUtterance(state, event, config);
    case EVENTS.LANGUAGE_SELECTED:
      return onLanguageSelection(
        appendTranscript(state, "caller", event.locale),
        { text: "", detectedLocale: event.locale },
        state.locale || DEFAULT_LOCALE,
      );
    case EVENTS.CALL_ENDED:
      return onCallEnded(state);
    default:
      // Unknown events leave state untouched (defensive, still pure).
      return { state, effects: [] };
  }
}

// createEngine :: (Config) -> { initialState, reduce }
// Binds a vertical config pack (dental, PT, …) to the reducer so the same core
// serves every profession — the config is data, not code.
export function createEngine(config = {}) {
  return {
    initialState,
    reduce: (state, event) => reduce(state, event, config),
  };
}
