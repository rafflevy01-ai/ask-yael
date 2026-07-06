import { describe, it, expect } from "vitest";
import { createDentalPms, createDentalPmsClient } from "./dentalPms.js";
import { bookAppointment, rescheduleAppointment, cancelAppointment, say } from "../domain/effects.js";

// A tiny fake dental-PMS client that records calls and hands back appointment ids.
function fakeClient() {
  const calls = [];
  let n = 0;
  return {
    calls,
    async createAppointment(appointment) {
      calls.push({ method: "create", appointment });
      return { id: `appt-${++n}` };
    },
    async updateAppointment(id, patch) {
      calls.push({ method: "update", id, patch });
      return { id };
    },
    async cancelAppointment(id) {
      calls.push({ method: "cancel", id });
      return true;
    },
  };
}

describe("dentalPms — appointment effects (interface parity with mock)", () => {
  it("books, reschedules and cancels in-memory just like the local calendar", () => {
    const cal = createDentalPms();
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
    const cal = createDentalPms();
    cal.perform(say("en", "hello"));
    expect(cal.appointments()).toHaveLength(0);
    expect(cal.pending()).toHaveLength(0);
  });
});

describe("dentalPms — flush() executes queued PMS operations", () => {
  it("creates an appointment and returns the PMS appointment id", async () => {
    const client = fakeClient();
    const cal = createDentalPms({ client, providerId: "dr-yael", operatoryId: "chair-1" });
    cal.perform(bookAppointment("c1", { appointmentType: "checkup", day: "monday" }));

    expect(cal.pending()).toEqual([{ op: "create" }]);
    const results = await cal.flush();

    expect(results).toEqual([{ op: "create", id: "appt-1" }]);
    expect(client.calls[0].method).toBe("create");
    expect(client.calls[0].appointment.treatment).toBe("checkup");
    expect(client.calls[0].appointment.providerId).toBe("dr-yael");
    expect(client.calls[0].appointment.operatoryId).toBe("chair-1");
    expect(cal.pending()).toHaveLength(0);
  });

  it("updates the same appointment id when a booked appointment is rescheduled", async () => {
    const client = fakeClient();
    const cal = createDentalPms({ client });
    cal.perform(bookAppointment("c1", { appointmentType: "filling", day: "monday" }));
    await cal.flush(); // create -> appt-1

    cal.perform(rescheduleAppointment("c1", { name: "R", day: "monday", newDay: "wednesday" }));
    const results = await cal.flush();

    expect(results).toEqual([{ op: "update", id: "appt-1" }]);
    const updateCall = client.calls.find((c) => c.method === "update");
    expect(updateCall.id).toBe("appt-1");
  });

  it("cancels the appointment id when a booked appointment is cancelled", async () => {
    const client = fakeClient();
    const cal = createDentalPms({ client });
    cal.perform(bookAppointment("c1", { appointmentType: "cleaning", day: "friday" }));
    await cal.flush();

    cal.perform(cancelAppointment("c1", { name: "A", day: "friday" }));
    const results = await cal.flush();

    expect(results).toEqual([{ op: "cancel", id: "appt-1" }]);
    expect(client.calls.some((c) => c.method === "cancel" && c.id === "appt-1")).toBe(true);
  });

  it("throws when flush() is called without a client", async () => {
    const cal = createDentalPms();
    cal.perform(bookAppointment("c1", { appointmentType: "checkup", day: "monday" }));
    await expect(cal.flush()).rejects.toThrow(/no client/);
  });

  it("resolves a concrete date/time slot for a weekday", async () => {
    const client = fakeClient();
    const cal = createDentalPms({ client });
    cal.perform(bookAppointment("c1", { appointmentType: "checkup", day: "tuesday" }));
    await cal.flush();
    const { appointment } = client.calls[0];
    expect(appointment.start).toBeDefined();
    expect(appointment.end).toBeDefined();
    expect(new Date(appointment.end) > new Date(appointment.start)).toBe(true);
  });
});

describe("createDentalPmsClient — REST mapping", () => {
  it("POSTs a bearer-authorised create to the appointments endpoint", async () => {
    const requests = [];
    const fetchImpl = async (url, init) => {
      requests.push({ url, init });
      return { ok: true, status: 200, json: async () => ({ id: "p1" }) };
    };
    const client = createDentalPmsClient({ baseUrl: "https://pms.example/api", apiKey: "tok", fetchImpl });
    const created = await client.createAppointment({ treatment: "checkup" });

    expect(created.id).toBe("p1");
    expect(requests[0].url).toBe("https://pms.example/api/appointments");
    expect(requests[0].init.method).toBe("POST");
    expect(requests[0].init.headers.Authorization).toBe("Bearer " + "tok");
  });

  it("throws without a baseUrl or apiKey", async () => {
    const noKey = createDentalPmsClient({ baseUrl: "https://pms.example/api", fetchImpl: async () => ({ ok: true }) });
    await expect(noKey.createAppointment({})).rejects.toThrow(/apiKey/);
    const noUrl = createDentalPmsClient({ apiKey: "tok", fetchImpl: async () => ({ ok: true }) });
    await expect(noUrl.createAppointment({})).rejects.toThrow(/baseUrl/);
  });

  it("treats a 204 cancel as success", async () => {
    const fetchImpl = async () => ({ ok: false, status: 204 });
    const client = createDentalPmsClient({ baseUrl: "https://pms.example/api", apiKey: "tok", fetchImpl });
    await expect(client.cancelAppointment("e1")).resolves.toBe(true);
  });
});
