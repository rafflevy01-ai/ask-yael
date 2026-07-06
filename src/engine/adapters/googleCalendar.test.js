import { describe, it, expect } from "vitest";
import { createGoogleCalendar, createGoogleCalendarClient } from "./googleCalendar.js";
import { bookAppointment, rescheduleAppointment, cancelAppointment, say } from "../domain/effects.js";

// A tiny fake Google Calendar client that records calls and hands back event ids.
function fakeClient() {
  const calls = [];
  let n = 0;
  return {
    calls,
    async insertEvent(calendarId, event) {
      calls.push({ method: "insert", calendarId, event });
      return { id: `evt-${++n}` };
    },
    async patchEvent(calendarId, id, patch) {
      calls.push({ method: "patch", calendarId, id, patch });
      return { id };
    },
    async deleteEvent(calendarId, id) {
      calls.push({ method: "delete", calendarId, id });
      return true;
    },
  };
}

describe("googleCalendar — appointment effects (interface parity with mock)", () => {
  it("books, reschedules and cancels in-memory just like the local calendar", () => {
    const cal = createGoogleCalendar();
    const record = cal.perform(bookAppointment("c1", { appointmentType: "cleaning", day: "tuesday" }));
    expect(record.id).toBeDefined();
    expect(cal.appointments()).toHaveLength(1);

    cal.perform(rescheduleAppointment("c1", { name: "Dana", day: "tuesday", newDay: "thursday" }));
    expect(cal.appointments()[0].day).toBe("thursday");

    cal.perform(cancelAppointment("c1", { name: "Dana", day: "thursday" }));
    expect(cal.appointments()).toHaveLength(0);
    expect(cal.operations().map((o) => o.op)).toEqual(["book", "reschedule", "cancel"]);
  });

  it("ignores non-appointment effects", () => {
    const cal = createGoogleCalendar();
    cal.perform(say("en", "hello"));
    expect(cal.appointments()).toHaveLength(0);
    expect(cal.pending()).toHaveLength(0);
  });
});

describe("googleCalendar — flush() executes queued Google Calendar operations", () => {
  it("inserts an event and returns the Google event id", async () => {
    const client = fakeClient();
    const cal = createGoogleCalendar({ client, calendarId: "clinic@group.calendar.google.com" });
    cal.perform(bookAppointment("c1", { appointmentType: "checkup", day: "monday" }));

    expect(cal.pending()).toEqual([{ op: "insert" }]);
    const results = await cal.flush();

    expect(results).toEqual([{ op: "insert", id: "evt-1" }]);
    expect(client.calls[0].method).toBe("insert");
    expect(client.calls[0].calendarId).toBe("clinic@group.calendar.google.com");
    expect(client.calls[0].event.summary).toContain("checkup");
    expect(cal.pending()).toHaveLength(0);
  });

  it("patches the same event id when a booked appointment is rescheduled", async () => {
    const client = fakeClient();
    const cal = createGoogleCalendar({ client });
    cal.perform(bookAppointment("c1", { appointmentType: "filling", day: "monday" }));
    await cal.flush(); // insert -> evt-1

    cal.perform(rescheduleAppointment("c1", { name: "R", day: "monday", newDay: "wednesday" }));
    const results = await cal.flush();

    expect(results).toEqual([{ op: "patch", id: "evt-1" }]);
    const patchCall = client.calls.find((c) => c.method === "patch");
    expect(patchCall.id).toBe("evt-1");
  });

  it("deletes the event id when a booked appointment is cancelled", async () => {
    const client = fakeClient();
    const cal = createGoogleCalendar({ client });
    cal.perform(bookAppointment("c1", { appointmentType: "cleaning", day: "friday" }));
    await cal.flush();

    cal.perform(cancelAppointment("c1", { name: "A", day: "friday" }));
    const results = await cal.flush();

    expect(results).toEqual([{ op: "delete", id: "evt-1" }]);
    expect(client.calls.some((c) => c.method === "delete" && c.id === "evt-1")).toBe(true);
  });

  it("throws when flush() is called without a client", async () => {
    const cal = createGoogleCalendar();
    cal.perform(bookAppointment("c1", { appointmentType: "checkup", day: "monday" }));
    await expect(cal.flush()).rejects.toThrow(/no client/);
  });

  it("resolves a concrete date/time slot for a weekday", async () => {
    const client = fakeClient();
    const cal = createGoogleCalendar({ client });
    cal.perform(bookAppointment("c1", { appointmentType: "checkup", day: "tuesday" }));
    await cal.flush();
    const { event } = client.calls[0];
    expect(event.start.dateTime).toBeDefined();
    expect(event.end.dateTime).toBeDefined();
    expect(new Date(event.end.dateTime) > new Date(event.start.dateTime)).toBe(true);
  });
});

describe("createGoogleCalendarClient — REST mapping", () => {
  it("POSTs a bearer-authorised insert to the events endpoint", async () => {
    const requests = [];
    const fetchImpl = async (url, init) => {
      requests.push({ url, init });
      return { ok: true, status: 200, json: async () => ({ id: "g1" }) };
    };
    const client = createGoogleCalendarClient({ accessToken: "tok", fetchImpl });
    const created = await client.insertEvent("primary", { summary: "x" });

    expect(created.id).toBe("g1");
    expect(requests[0].url).toContain("/calendars/primary/events");
    expect(requests[0].init.method).toBe("POST");
    expect(requests[0].init.headers.Authorization).toBe("Bearer " + "tok");
  });

  it("throws without an access token", async () => {
    const client = createGoogleCalendarClient({ fetchImpl: async () => ({ ok: true }) });
    await expect(client.insertEvent("primary", {})).rejects.toThrow(/accessToken/);
  });

  it("treats a 204 delete as success", async () => {
    const fetchImpl = async () => ({ ok: false, status: 204 });
    const client = createGoogleCalendarClient({ accessToken: "tok", fetchImpl });
    await expect(client.deleteEvent("primary", "e1")).resolves.toBe(true);
  });
});
