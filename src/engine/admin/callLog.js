// Admin-dashboard aggregation — pure, framework-agnostic, and testable.
//
// The dashboard is fed by the same effects-as-data the engine already emits.
// `buildCallRecord` folds a finished call (its final immutable State plus the
// ordered Effect trace collected at the edge) into a flat, serialisable "call
// record" for display and audit. `summarize` rolls a set of records up into the
// analytics the Overview tab charts. No React, no I/O — just data in, data out,
// so every number on the dashboard is unit-testable.

import { EFFECTS } from "../domain/effects.js";
import { INTENTS } from "../domain/intents.js";

// Outcomes we classify a call into for the dashboard. Order matters: the first
// matching predicate (most significant outcome) wins.
export const CALL_OUTCOMES = Object.freeze({
  EMERGENCY: "emergency",
  BOOKED: "booked",
  RESCHEDULED: "rescheduled",
  CANCELLED: "cancelled",
  CALLBACK: "callback",
  HANDOFF: "handoff",
  ANSWERED: "answered",
  UNRESOLVED: "unresolved",
});

const has = (effects, type) => effects.some((e) => e.type === type);
const count = (effects, type) => effects.filter((e) => e.type === type).length;

// classifyOutcome :: ([Effect], State) -> outcome
function classifyOutcome(effects, state) {
  if (has(effects, EFFECTS.ESCALATE_EMERGENCY)) return CALL_OUTCOMES.EMERGENCY;
  if (has(effects, EFFECTS.BOOK_APPOINTMENT)) return CALL_OUTCOMES.BOOKED;
  if (has(effects, EFFECTS.RESCHEDULE_APPOINTMENT)) return CALL_OUTCOMES.RESCHEDULED;
  if (has(effects, EFFECTS.CANCEL_APPOINTMENT)) return CALL_OUTCOMES.CANCELLED;
  if (has(effects, EFFECTS.REQUEST_CALLBACK)) return CALL_OUTCOMES.CALLBACK;
  if (has(effects, EFFECTS.TRANSFER_TO_HUMAN)) return CALL_OUTCOMES.HANDOFF;
  if (state && state.intent === INTENTS.ASK) return CALL_OUTCOMES.ANSWERED;
  return CALL_OUTCOMES.UNRESOLVED;
}

// A call is "contained" (handled autonomously) when Yael did not hand off to a
// human. Emergency escalations are deliberate, correct behaviour and still count
// as contained by the automation.
function isContained(outcome) {
  return outcome !== CALL_OUTCOMES.HANDOFF;
}

// buildCallRecord :: ({ id, state, effects, startedAt?, endedAt? }) -> CallRecord
export function buildCallRecord({ id, state, effects = [], startedAt = null, endedAt = null }) {
  const outcome = classifyOutcome(effects, state);
  const appointments = effects
    .filter((e) =>
      e.type === EFFECTS.BOOK_APPOINTMENT ||
      e.type === EFFECTS.RESCHEDULE_APPOINTMENT ||
      e.type === EFFECTS.CANCEL_APPOINTMENT,
    )
    .map((e) => ({ type: e.type, callId: e.callId, details: e.details }));

  return Object.freeze({
    id: id || (state && state.callId) || null,
    locale: (state && state.locale) || null,
    intent: (state && state.intent) || null,
    phase: (state && state.phase) || null,
    transcript: state && state.transcript ? state.transcript.slice() : [],
    outcome,
    contained: isContained(outcome),
    appointments,
    smsSent: count(effects, EFFECTS.SEND_SMS),
    escalated: has(effects, EFFECTS.ESCALATE_EMERGENCY),
    transferred: has(effects, EFFECTS.TRANSFER_TO_HUMAN),
    callback: has(effects, EFFECTS.REQUEST_CALLBACK),
    logs: effects.filter((e) => e.type === EFFECTS.LOG).map((e) => e.entry),
    startedAt,
    endedAt,
  });
}

const tally = (records, keyOf) =>
  records.reduce((acc, r) => {
    const key = keyOf(r);
    if (key == null) return acc;
    acc[key] = (acc[key] || 0) + 1;
    return acc;
  }, {});

// summarize :: ([CallRecord]) -> Analytics
// The headline metrics the Overview tab renders.
export function summarize(records = []) {
  const total = records.length;
  const containedCount = records.filter((r) => r.contained).length;

  return Object.freeze({
    total,
    byLocale: tally(records, (r) => r.locale),
    byIntent: tally(records, (r) => r.intent),
    byOutcome: tally(records, (r) => r.outcome),
    bookings: records.filter((r) => r.outcome === CALL_OUTCOMES.BOOKED).length,
    reschedules: records.filter((r) => r.outcome === CALL_OUTCOMES.RESCHEDULED).length,
    cancellations: records.filter((r) => r.outcome === CALL_OUTCOMES.CANCELLED).length,
    emergencies: records.filter((r) => r.escalated).length,
    handoffs: records.filter((r) => r.transferred).length,
    callbacks: records.filter((r) => r.callback).length,
    smsSent: records.reduce((n, r) => n + r.smsSent, 0),
    // Containment rate: share of calls resolved without a human handoff.
    containmentRate: total === 0 ? 0 : containedCount / total,
  });
}

// upcomingAppointments :: ([CallRecord]) -> [Appointment]
// Flatten the booked/rescheduled appointments across calls for the Calendar tab.
export function upcomingAppointments(records = []) {
  return records
    .flatMap((r) =>
      r.appointments
        .filter((a) => a.type === EFFECTS.BOOK_APPOINTMENT || a.type === EFFECTS.RESCHEDULE_APPOINTMENT)
        .map((a) => ({
          callId: a.callId,
          day: a.details.newDay || a.details.day || null,
          appointmentType: a.details.appointmentType || null,
          locale: a.details.locale || r.locale,
        })),
    );
}
