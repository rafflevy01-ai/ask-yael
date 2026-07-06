import { describe, it, expect } from "vitest";
import {
  buildCallRecord,
  summarize,
  upcomingAppointments,
  CALL_OUTCOMES,
} from "./callLog.js";
import { demoCallRecords } from "./demoCalls.js";
import * as Fx from "../domain/effects.js";
import { INTENTS } from "../domain/intents.js";

const state = (over = {}) => ({
  callId: "c1",
  locale: "en",
  intent: null,
  phase: "ended",
  transcript: [{ role: "caller", text: "hi" }],
  ...over,
});

describe("buildCallRecord — folds a finished call into a flat record", () => {
  it("classifies a booking and captures appointment + SMS details", () => {
    const effects = [
      Fx.log({ kind: "call_started", callId: "c1" }),
      Fx.bookAppointment("c1", { appointmentType: "cleaning", day: "tuesday", locale: "en" }),
      Fx.sendSms("en", "confirmed"),
    ];
    const rec = buildCallRecord({ id: "c1", state: state({ intent: INTENTS.BOOK }), effects });
    expect(rec.outcome).toBe(CALL_OUTCOMES.BOOKED);
    expect(rec.contained).toBe(true);
    expect(rec.smsSent).toBe(1);
    expect(rec.appointments).toHaveLength(1);
    expect(rec.appointments[0].details.day).toBe("tuesday");
  });

  it("classifies an emergency escalation and marks it contained", () => {
    const effects = [Fx.escalateEmergency("en", "Call 911")];
    const rec = buildCallRecord({ id: "c2", state: state({ intent: INTENTS.EMERGENCY }), effects });
    expect(rec.outcome).toBe(CALL_OUTCOMES.EMERGENCY);
    expect(rec.escalated).toBe(true);
    expect(rec.contained).toBe(true);
  });

  it("classifies a human handoff as not contained", () => {
    const effects = [Fx.transferToHuman("caller_requested")];
    const rec = buildCallRecord({ id: "c3", state: state({ intent: INTENTS.HANDOFF }), effects });
    expect(rec.outcome).toBe(CALL_OUTCOMES.HANDOFF);
    expect(rec.transferred).toBe(true);
    expect(rec.contained).toBe(false);
  });

  it("classifies an answered FAQ", () => {
    const rec = buildCallRecord({ id: "c4", state: state({ intent: INTENTS.ASK }), effects: [Fx.say("en", "We are open 8-6")] });
    expect(rec.outcome).toBe(CALL_OUTCOMES.ANSWERED);
  });
});

describe("summarize — analytics rollup", () => {
  const records = [
    buildCallRecord({ id: "a", state: state({ intent: INTENTS.BOOK }), effects: [Fx.bookAppointment("a", { day: "mon" }), Fx.sendSms("en", "x")] }),
    buildCallRecord({ id: "b", state: state({ locale: "fr", intent: INTENTS.BOOK }), effects: [Fx.bookAppointment("b", { day: "tue" }), Fx.sendSms("fr", "x")] }),
    buildCallRecord({ id: "c", state: state({ locale: "he", intent: INTENTS.HANDOFF }), effects: [Fx.transferToHuman("r")] }),
  ];

  it("counts totals, locales, outcomes and SMS", () => {
    const s = summarize(records);
    expect(s.total).toBe(3);
    expect(s.bookings).toBe(2);
    expect(s.handoffs).toBe(1);
    expect(s.smsSent).toBe(2);
    expect(s.byLocale).toEqual({ en: 1, fr: 1, he: 1 });
  });

  it("computes containment rate (resolved without handoff)", () => {
    const s = summarize(records);
    expect(s.containmentRate).toBeCloseTo(2 / 3);
  });

  it("handles an empty set safely", () => {
    const s = summarize([]);
    expect(s.total).toBe(0);
    expect(s.containmentRate).toBe(0);
  });
});

describe("upcomingAppointments", () => {
  it("flattens booked and rescheduled appointments across calls", () => {
    const records = [
      buildCallRecord({ id: "a", state: state(), effects: [Fx.bookAppointment("a", { appointmentType: "cleaning", day: "monday", locale: "en" })] }),
      buildCallRecord({ id: "b", state: state(), effects: [Fx.rescheduleAppointment("b", { day: "monday", newDay: "friday", locale: "fr" })] }),
      buildCallRecord({ id: "c", state: state(), effects: [Fx.cancelAppointment("c", { day: "tuesday" })] }),
    ];
    const appts = upcomingAppointments(records);
    expect(appts).toHaveLength(2);
    expect(appts[1].day).toBe("friday"); // reschedule uses the new day
  });
});

describe("demoCallRecords — seed data integration", () => {
  const now = new Date("2026-01-01T12:00:00.000Z");
  const records = demoCallRecords({ now });

  it("produces one record per script, most recent first", () => {
    expect(records.length).toBeGreaterThanOrEqual(5);
    for (let i = 1; i < records.length; i += 1) {
      expect(new Date(records[i - 1].startedAt) >= new Date(records[i].startedAt)).toBe(true);
    }
  });

  it("exercises a spread of real outcomes through the engine", () => {
    const outcomes = new Set(records.map((r) => r.outcome));
    expect(outcomes.has(CALL_OUTCOMES.BOOKED)).toBe(true);
    expect(outcomes.has(CALL_OUTCOMES.EMERGENCY)).toBe(true);
    expect(outcomes.has(CALL_OUTCOMES.HANDOFF)).toBe(true);
  });

  it("summarizes into non-trivial analytics", () => {
    const s = summarize(records);
    expect(s.total).toBe(records.length);
    expect(s.containmentRate).toBeGreaterThan(0);
    expect(s.containmentRate).toBeLessThanOrEqual(1);
  });
});
