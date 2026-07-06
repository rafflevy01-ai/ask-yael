// Live Calendar / PMS adapter backed by Google Calendar.
//
// This is the production sibling of `mockCalendar` (the *local* option). It
// implements the same tiny interface the core relies on — `perform(effect)`
// plus `appointments()` / `operations()` — so it drops into `runCall` unchanged.
//
// The pure core emits `BOOK_APPOINTMENT` / `RESCHEDULE_APPOINTMENT` /
// `CANCEL_APPOINTMENT` as *data*; this adapter is the seam that carries them out
// against Google Calendar. Following the effects-as-data philosophy, `perform`
// only records the intended operation (keeping `runCall` synchronous), and the
// async `flush()` executes the queued Google Calendar REST calls in order.
//
// All I/O is injected through a small `client` ({ insertEvent, patchEvent,
// deleteEvent }), so the adapter is deterministically unit-testable without a
// network or OAuth token. `createGoogleCalendarClient` builds the real client.

import { EFFECTS } from "../domain/effects.js";

export const GOOGLE_CALENDAR_API_BASE = "https://www.googleapis.com/calendar/v3";
export const DEFAULT_TIME_ZONE = "Asia/Jerusalem";

// Weekday name -> index (Sunday = 0), matching the day keywords the scheduling
// skill collects. Used by the default date resolver.
const WEEKDAYS = Object.freeze({
  sunday: 0,
  monday: 1,
  tuesday: 2,
  wednesday: 3,
  thursday: 4,
  friday: 5,
  saturday: 6,
});

// defaultResolveDateTime :: (day, opts) -> { startIso, endIso } | null
// Turns a spoken weekday ("tuesday") into the next upcoming date at a default
// time slot. A real deployment injects a resolver bound to provider
// availability; this keeps the adapter self-contained and testable.
function defaultResolveDateTime(day, { now = new Date(), hour = 9, durationMinutes = 30 } = {}) {
  const target = WEEKDAYS[String(day || "").toLowerCase()];
  if (target === undefined) return null;

  const start = new Date(now);
  start.setHours(hour, 0, 0, 0);
  const diff = (target - start.getDay() + 7) % 7 || 7; // next upcoming occurrence
  start.setDate(start.getDate() + diff);
  const end = new Date(start.getTime() + durationMinutes * 60 * 1000);
  return { startIso: start.toISOString(), endIso: end.toISOString() };
}

// createGoogleCalendar :: (Options) -> Calendar
// Options:
//   - calendarId:      target calendar (defaults to "primary").
//   - client:          { insertEvent, patchEvent, deleteEvent } — injected I/O.
//   - timeZone:        IANA time zone for created events.
//   - resolveDateTime: (day) -> { startIso, endIso } | null slot resolver.
export function createGoogleCalendar(options = {}) {
  const {
    calendarId = "primary",
    client = null,
    timeZone = DEFAULT_TIME_ZONE,
    resolveDateTime = (day) => defaultResolveDateTime(day),
  } = options;

  const appointments = []; // [{ id, callId, day, cancelled, googleEventId, details }]
  const operations = []; // ordered audit trail
  const queue = []; // pending Google Calendar jobs awaiting flush()
  let seq = 0;
  const nextId = () => `gcal-${++seq}`;

  // Build a Google Calendar event resource from the collected slots.
  const buildEvent = (details) => {
    const label = details.appointmentType || details.name || "Appointment";
    const summary = `Yael — ${label}`;
    const event = { summary, description: `Booked by Yael (call ${details.callId || "?"})` };
    const slot = resolveDateTime(details.day);
    if (slot) {
      event.start = { dateTime: slot.startIso, timeZone };
      event.end = { dateTime: slot.endIso, timeZone };
    }
    return event;
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
            googleEventId: null,
            details: { ...effect.details, callId: effect.callId },
          };
          appointments.push(record);
          operations.push({ op: "book", record });
          queue.push({ op: "insert", record, event: buildEvent(record.details) });
          return record;
        }
        case EFFECTS.RESCHEDULE_APPOINTMENT: {
          const record = { callId: effect.callId, ...effect.details };
          const match = findActiveByDay(effect.details.day);
          if (match) {
            match.day = effect.details.newDay;
            queue.push({ op: "patch", record: match, event: buildEvent({ ...match.details, day: effect.details.newDay }) });
          }
          operations.push({ op: "reschedule", record });
          return record;
        }
        case EFFECTS.CANCEL_APPOINTMENT: {
          const record = { callId: effect.callId, ...effect.details };
          const match = findActiveByDay(effect.details.day);
          if (match) {
            match.cancelled = true;
            queue.push({ op: "delete", record: match });
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
    // Google Calendar jobs recorded by perform() awaiting flush().
    pending() {
      return queue.map((j) => ({ op: j.op }));
    },

    // flush :: () -> Promise<[{ op, id }]>
    // Execute every queued Google Calendar operation, in order. Insert results
    // capture the Google event id so later patch/delete target the same event.
    async flush() {
      if (!client) throw new Error("googleCalendar: no client configured for flush()");
      const results = [];
      while (queue.length) {
        const job = queue.shift();
        if (job.op === "insert") {
          const created = await client.insertEvent(calendarId, job.event);
          job.record.googleEventId = created && created.id ? created.id : null;
          results.push({ op: "insert", id: job.record.googleEventId });
        } else if (job.op === "patch") {
          const id = job.record.googleEventId;
          if (id) await client.patchEvent(calendarId, id, job.event);
          results.push({ op: "patch", id: id || null });
        } else if (job.op === "delete") {
          const id = job.record.googleEventId;
          if (id) await client.deleteEvent(calendarId, id);
          results.push({ op: "delete", id: id || null });
        }
      }
      return results;
    },
  };
}

// createGoogleCalendarClient :: (Options) -> Client
// The real Google Calendar REST client. `accessToken` is an OAuth2 bearer token
// obtained by the host app (never hard-coded). All three methods map directly to
// the Google Calendar Events API.
export function createGoogleCalendarClient(options = {}) {
  const { accessToken, fetchImpl = fetch, apiBase = GOOGLE_CALENDAR_API_BASE } = options;

  const authHeaders = () => {
    if (!accessToken) throw new Error("googleCalendarClient: missing accessToken");
    const authorization = "Bearer " + accessToken;
    return { Authorization: authorization, "Content-Type": "application/json" };
  };

  const encode = (id) => encodeURIComponent(id);

  return {
    async insertEvent(calendarId, event) {
      const res = await fetchImpl(`${apiBase}/calendars/${encode(calendarId)}/events`, {
        method: "POST",
        headers: authHeaders(),
        body: JSON.stringify(event),
      });
      if (!res.ok) throw new Error(`Google Calendar insert failed: ${res.status}`);
      return res.json();
    },
    async patchEvent(calendarId, eventId, patch) {
      const res = await fetchImpl(
        `${apiBase}/calendars/${encode(calendarId)}/events/${encode(eventId)}`,
        { method: "PATCH", headers: authHeaders(), body: JSON.stringify(patch) },
      );
      if (!res.ok) throw new Error(`Google Calendar patch failed: ${res.status}`);
      return res.json();
    },
    async deleteEvent(calendarId, eventId) {
      const res = await fetchImpl(
        `${apiBase}/calendars/${encode(calendarId)}/events/${encode(eventId)}`,
        { method: "DELETE", headers: authHeaders() },
      );
      // Google returns 204 No Content on a successful delete.
      if (!res.ok && res.status !== 204) {
        throw new Error(`Google Calendar delete failed: ${res.status}`);
      }
      return true;
    },
  };
}
