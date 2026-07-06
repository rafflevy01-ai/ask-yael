import { describe, it, expect } from "vitest";
import { createMockCalendar } from "./mockCalendar.js";
import { bookAppointment, rescheduleAppointment, cancelAppointment, say } from "../domain/effects.js";

describe("mockCalendar — appointment effects", () => {
  it("books an appointment and returns a record with an id", () => {
    const cal = createMockCalendar();
    const record = cal.perform(bookAppointment("call-1", { appointmentType: "cleaning", day: "tuesday" }));
    expect(record.id).toBeDefined();
    expect(record.day).toBe("tuesday");
    expect(cal.appointments()).toHaveLength(1);
    expect(cal.appointments()[0].appointmentType).toBe("cleaning");
  });

  it("reschedules a known appointment to the new day", () => {
    const cal = createMockCalendar();
    cal.perform(bookAppointment("c", { appointmentType: "checkup", day: "monday" }));
    cal.perform(rescheduleAppointment("c", { name: "Dana", day: "monday", newDay: "thursday" }));
    const active = cal.appointments();
    expect(active).toHaveLength(1);
    expect(active[0].day).toBe("thursday");
  });

  it("cancels a known appointment so it is no longer active", () => {
    const cal = createMockCalendar();
    cal.perform(bookAppointment("c", { appointmentType: "filling", day: "friday" }));
    cal.perform(cancelAppointment("c", { name: "Avi", day: "friday" }));
    expect(cal.appointments()).toHaveLength(0);
  });

  it("records an ordered audit trail of operations", () => {
    const cal = createMockCalendar();
    cal.perform(bookAppointment("c", { appointmentType: "cleaning", day: "monday" }));
    cal.perform(rescheduleAppointment("c", { name: "R", day: "monday", newDay: "tuesday" }));
    cal.perform(cancelAppointment("c", { name: "R", day: "tuesday" }));
    expect(cal.operations().map((o) => o.op)).toEqual(["book", "reschedule", "cancel"]);
  });

  it("ignores non-appointment effects", () => {
    const cal = createMockCalendar();
    cal.perform(say("en", "hello"));
    expect(cal.appointments()).toHaveLength(0);
    expect(cal.operations()).toHaveLength(0);
  });
});
