// Live Calendar / PMS adapter backed by a dedicated dental PMS.
//
// This is the pilot's chosen production sibling of `mockCalendar` (see
// docs/SPEC.md §5.2 — the open "Calendar/PMS" decision is resolved in favour of
// a **dedicated dental PMS** rather than Google Calendar). It implements the
// very same tiny interface the core relies on — `perform(effect)` plus
// `appointments()` / `operations()` / `pending()` / `flush()` — so it drops into
// `runCall` unchanged, exactly like `googleCalendar`.
//
// The pure core emits `BOOK_APPOINTMENT` / `RESCHEDULE_APPOINTMENT` /
// `CANCEL_APPOINTMENT` as *data*; this adapter is the seam that carries them out
// against the clinic's PMS. Following the effects-as-data philosophy, `perform`
// only records the intended operation (keeping `runCall` synchronous), and the
// async `flush()` executes the queued PMS REST calls in order.
//
// All I/O is injected through a small `client` ({ createAppointment,
// updateAppointment, cancelAppointment }), so the adapter is deterministically
// unit-testable without a network or an API key. `createDentalPmsClient` builds
// the real client against a generic dental-PMS booking API.

import { EFFECTS } from "../domain/effects.js";

export const DEFAULT_TIME_ZONE = "Asia/Jerusalem";

// Weekday name -> index (Sunday = 0), matching the day keywords the scheduling
// skill collects. Used by the default slot resolver.
const WEEKDAYS = Object.freeze({
  sunday: 0,
  monday: 1,
  tuesday: 2,
  wednesday: 3,
  thursday: 4,
  friday: 5,
  saturday: 6,
});

// defaultResolveSlot :: (day, opts) -> { startIso, endIso } | null
// Turns a spoken weekday ("tuesday") into the next upcoming date at a default
// time slot. A real deployment injects a resolver bound to PMS chair/provider
// availability; this keeps the adapter self-contained and testable.
function defaultResolveSlot(day, { now = new Date(), hour = 9, durationMinutes = 30 } = {}) {
  const target = WEEKDAYS[String(day || "").toLowerCase()];
  if (target === undefined) return null;

  const start = new Date(now);
  start.setHours(hour, 0, 0, 0);
  const diff = (target - start.getDay() + 7) % 7 || 7; // next upcoming occurrence
  start.setDate(start.getDate() + diff);
  const end = new Date(start.getTime() + durationMinutes * 60 * 1000);
  return { startIso: start.toISOString(), endIso: end.toISOString() };
}

// createDentalPms :: (Options) -> Calendar
// Options:
//   - client:      { createAppointment, updateAppointment, cancelAppointment } — injected I/O.
//   - providerId:  the dentist/provider the PMS should book against.
//   - operatoryId: the chair/operatory resource id (mirrors dentalConfig.resource).
//   - timeZone:    IANA time zone for created appointments.
//   - resolveSlot: (day) -> { startIso, endIso } | null slot resolver.
export function createDentalPms(options = {}) {
  const {
    client = null,
    providerId = null,
    operatoryId = null,
    timeZone = DEFAULT_TIME_ZONE,
    resolveSlot = (day) => defaultResolveSlot(day),
  } = options;

  const appointments = []; // [{ id, callId, day, cancelled, pmsAppointmentId, details }]
  const operations = []; // ordered audit trail
  const queue = []; // pending PMS jobs awaiting flush()
  let seq = 0;
  const nextId = () => `pms-${++seq}`;

  // Build a PMS appointment request from the collected slots.
  const buildAppointment = (details) => {
    const treatment = details.appointmentType || "appointment";
    const request = {
      providerId,
      operatoryId,
      treatment,
      patientName: details.name || null,
      timeZone,
      note: `Booked by Yael (call ${details.callId || "?"})`,
    };
    const slot = resolveSlot(details.day);
    if (slot) {
      request.start = slot.startIso;
      request.end = slot.endIso;
    }
    return request;
  };

  const findActiveByDay = (day) =>
    appointments.find((a) => a.day === day && !a.cancelled);

  return {
    perform(effect) {
      switch (effect.type) {
        case EFFECTS.BOOK_APPOINTMENT: {
          const record = {
            id: nextId(),
            callId: effect.callId,
            day: effect.details.day,
            cancelled: false,
            pmsAppointmentId: null,
            details: { ...effect.details, callId: effect.callId },
          };
          appointments.push(record);
          operations.push({ op: "book", record });
          queue.push({ op: "create", record, request: buildAppointment(record.details) });
          return record;
        }
        case EFFECTS.RESCHEDULE_APPOINTMENT: {
          const record = { callId: effect.callId, ...effect.details };
          const match = findActiveByDay(effect.details.day);
          if (match) {
            match.day = effect.details.newDay;
            queue.push({
              op: "update",
              record: match,
              request: buildAppointment({ ...match.details, day: effect.details.newDay }),
            });
          }
          operations.push({ op: "reschedule", record });
          return record;
        }
        case EFFECTS.CANCEL_APPOINTMENT: {
          const record = { callId: effect.callId, ...effect.details };
          const match = findActiveByDay(effect.details.day);
          if (match) {
            match.cancelled = true;
            queue.push({ op: "cancel", record: match });
          }
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
    // PMS jobs recorded by perform() awaiting flush().
    pending() {
      return queue.map((j) => ({ op: j.op }));
    },

    // flush :: () -> Promise<[{ op, id }]>
    // Execute every queued PMS operation, in order. Create results capture the
    // PMS appointment id so later update/cancel target the same appointment.
    async flush() {
      if (!client) throw new Error("dentalPms: no client configured for flush()");
      const results = [];
      while (queue.length) {
        const job = queue.shift();
        if (job.op === "create") {
          const created = await client.createAppointment(job.request);
          job.record.pmsAppointmentId = created && created.id ? created.id : null;
          results.push({ op: "create", id: job.record.pmsAppointmentId });
        } else if (job.op === "update") {
          const id = job.record.pmsAppointmentId;
          if (id) await client.updateAppointment(id, job.request);
          results.push({ op: "update", id: id || null });
        } else if (job.op === "cancel") {
          const id = job.record.pmsAppointmentId;
          if (id) await client.cancelAppointment(id);
          results.push({ op: "cancel", id: id || null });
        }
      }
      return results;
    },
  };
}

// createDentalPmsClient :: (Options) -> Client
// The real dental-PMS REST client. `apiKey` is the clinic's PMS API token
// (never hard-coded). The three methods map onto a generic dental-PMS booking
// API; a specific PMS integration swaps the paths/headers here without touching
// the adapter or the pure core.
export function createDentalPmsClient(options = {}) {
  const { baseUrl, apiKey, fetchImpl = fetch } = options;

  const requireConfig = () => {
    if (!baseUrl) throw new Error("dentalPmsClient: missing baseUrl");
    if (!apiKey) throw new Error("dentalPmsClient: missing apiKey");
  };

  const authHeaders = () => ({
    Authorization: "Bearer " + apiKey,
    "Content-Type": "application/json",
  });

  const encode = (id) => encodeURIComponent(id);

  return {
    async createAppointment(appointment) {
      requireConfig();
      const res = await fetchImpl(`${baseUrl}/appointments`, {
        method: "POST",
        headers: authHeaders(),
        body: JSON.stringify(appointment),
      });
      if (!res.ok) throw new Error(`Dental PMS create failed: ${res.status}`);
      return res.json();
    },
    async updateAppointment(appointmentId, patch) {
      requireConfig();
      const res = await fetchImpl(`${baseUrl}/appointments/${encode(appointmentId)}`, {
        method: "PATCH",
        headers: authHeaders(),
        body: JSON.stringify(patch),
      });
      if (!res.ok) throw new Error(`Dental PMS update failed: ${res.status}`);
      return res.json();
    },
    async cancelAppointment(appointmentId) {
      requireConfig();
      const res = await fetchImpl(`${baseUrl}/appointments/${encode(appointmentId)}`, {
        method: "DELETE",
        headers: authHeaders(),
      });
      // A dental PMS typically returns 200 or 204 No Content on cancellation.
      if (!res.ok && res.status !== 204) {
        throw new Error(`Dental PMS cancel failed: ${res.status}`);
      }
      return true;
    },
  };
}
