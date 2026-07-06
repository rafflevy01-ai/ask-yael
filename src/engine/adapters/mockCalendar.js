// Mocked Calendar / PMS adapter for Phase 1.
//
// The real system books against a dental PMS or Google Calendar behind this
// same tiny interface (see docs/SPEC.md, Phase 1). The core emits
// BOOK_APPOINTMENT / RESCHEDULE_APPOINTMENT / CANCEL_APPOINTMENT as *data*; this
// edge adapter is the seam that carries them out. For the risk-busting spike
// (and for deterministic tests) it keeps appointments in memory and records the
// operations applied, so a call can be asserted end-to-end without a real PMS.
//
// Swapping in a live provider later means implementing this same interface —
// the pure core never changes.

import { EFFECTS } from "../domain/effects.js";

// createMockCalendar :: () -> Calendar
// `perform(effect)` interprets a single appointment effect from the core and
// mutates the in-memory schedule, ignoring any non-appointment effect.
export function createMockCalendar() {
  const appointments = []; // current bookings: [{ id, callId, ...details }]
  const operations = []; // ordered audit trail of applied operations
  let seq = 0;

  const nextId = () => `appt-${++seq}`;

  return {
    perform(effect) {
      switch (effect.type) {
        case EFFECTS.BOOK_APPOINTMENT: {
          const record = { id: nextId(), callId: effect.callId, ...effect.details };
          appointments.push(record);
          operations.push({ op: "book", record });
          return record;
        }
        case EFFECTS.RESCHEDULE_APPOINTMENT: {
          const record = { callId: effect.callId, ...effect.details };
          // Move any matching booking (by day) to the new day; the mock keeps
          // both cases: a known appointment is updated, an unknown one is added.
          const match = appointments.find(
            (a) => a.day === effect.details.day && !a.cancelled,
          );
          if (match) match.day = effect.details.newDay;
          operations.push({ op: "reschedule", record });
          return record;
        }
        case EFFECTS.CANCEL_APPOINTMENT: {
          const record = { callId: effect.callId, ...effect.details };
          const match = appointments.find(
            (a) => a.day === effect.details.day && !a.cancelled,
          );
          if (match) match.cancelled = true;
          operations.push({ op: "cancel", record });
          return record;
        }
        default:
          return effect;
      }
    },
    // The currently active (non-cancelled) appointments.
    appointments() {
      return appointments.filter((a) => !a.cancelled).map((a) => ({ ...a }));
    },
    // The full audit trail of book/reschedule/cancel operations, in order.
    operations() {
      return operations.slice();
    },
  };
}
