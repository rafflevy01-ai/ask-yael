import { describe, it, expect } from "vitest";
import {
  CALL_COLUMNS,
  INSERT_CALL_SQL,
  SELECT_CALLS_SQL,
  serializeCallRecord,
  deserializeCallRow,
} from "./d1Store.js";
import { demoCallRecords } from "../admin/demoCalls.js";
import { summarize, upcomingAppointments } from "../admin/callLog.js";

describe("d1Store — SQL is built from the single column source of truth", () => {
  it("binds exactly one placeholder per column", () => {
    const placeholders = INSERT_CALL_SQL.match(/VALUES \(([^)]*)\)/)[1].split(",");
    expect(placeholders).toHaveLength(CALL_COLUMNS.length);
    for (const col of CALL_COLUMNS) {
      expect(INSERT_CALL_SQL).toContain(col);
    }
  });

  it("selects the same columns it inserts and takes a LIMIT", () => {
    for (const col of CALL_COLUMNS) {
      expect(SELECT_CALLS_SQL).toContain(col);
    }
    expect(SELECT_CALLS_SQL).toContain("LIMIT ?");
  });

  it("upserts on conflicting id (idempotent ingestion)", () => {
    expect(INSERT_CALL_SQL).toContain("ON CONFLICT(id) DO UPDATE");
  });
});

describe("d1Store — serialize produces positional binds", () => {
  it("orders values to match the columns and encodes flags/JSON", () => {
    const record = {
      id: "c1",
      locale: "he",
      intent: "book",
      phase: "ended",
      outcome: "booked",
      contained: true,
      smsSent: 2,
      escalated: false,
      transferred: false,
      callback: false,
      startedAt: "2026-01-01T00:00:00.000Z",
      endedAt: "2026-01-01T00:01:00.000Z",
      transcript: [{ locale: "he", text: "שלום" }],
      appointments: [{ type: "BOOK_APPOINTMENT", callId: "c1", details: { day: "tuesday" } }],
      logs: ["greeted"],
    };
    const values = serializeCallRecord(record);
    expect(values).toHaveLength(CALL_COLUMNS.length);
    expect(values[CALL_COLUMNS.indexOf("id")]).toBe("c1");
    expect(values[CALL_COLUMNS.indexOf("contained")]).toBe(1);
    expect(values[CALL_COLUMNS.indexOf("escalated")]).toBe(0);
    expect(values[CALL_COLUMNS.indexOf("sms_sent")]).toBe(2);
    expect(JSON.parse(values[CALL_COLUMNS.indexOf("transcript")])).toEqual(record.transcript);
    expect(JSON.parse(values[CALL_COLUMNS.indexOf("appointments")])).toEqual(record.appointments);
  });

  it("defaults missing fields safely", () => {
    const values = serializeCallRecord({});
    expect(values[CALL_COLUMNS.indexOf("sms_sent")]).toBe(0);
    expect(values[CALL_COLUMNS.indexOf("contained")]).toBe(0);
    expect(values[CALL_COLUMNS.indexOf("transcript")]).toBe("[]");
  });
});

describe("d1Store — deserialize rebuilds a CallRecord from a row", () => {
  it("parses JSON strings and coerces flags back to booleans", () => {
    const row = {
      id: "c1",
      locale: "en",
      intent: "book",
      phase: "ended",
      outcome: "booked",
      contained: 1,
      sms_sent: 3,
      escalated: 0,
      transferred: 0,
      callback: 0,
      started_at: "2026-01-01T00:00:00.000Z",
      ended_at: null,
      transcript: JSON.stringify([{ locale: "en", text: "hi" }]),
      appointments: JSON.stringify([{ type: "BOOK_APPOINTMENT", callId: "c1", details: {} }]),
      logs: JSON.stringify(["greeted"]),
    };
    const record = deserializeCallRow(row);
    expect(record.id).toBe("c1");
    expect(record.contained).toBe(true);
    expect(record.smsSent).toBe(3);
    expect(record.transcript).toEqual([{ locale: "en", text: "hi" }]);
    expect(record.appointments[0].type).toBe("BOOK_APPOINTMENT");
  });

  it("tolerates malformed JSON by falling back to empty arrays", () => {
    const record = deserializeCallRow({ id: "c1", transcript: "not-json" });
    expect(record.transcript).toEqual([]);
  });
});

describe("d1Store — round-trips real engine output through the dashboard aggregators", () => {
  it("serialize→deserialize preserves the metrics summarize computes", () => {
    const original = demoCallRecords({ now: new Date("2026-01-01T12:00:00.000Z") });
    const roundTripped = original.map((r) => deserializeCallRow({
      // simulate a D1 row: JSON columns arrive as strings
      ...Object.fromEntries(CALL_COLUMNS.map((c, i) => [c, serializeCallRecord(r)[i]])),
    }));

    const before = summarize(original);
    const after = summarize(roundTripped);
    expect(after.total).toBe(before.total);
    expect(after.byOutcome).toEqual(before.byOutcome);
    expect(after.byLocale).toEqual(before.byLocale);
    expect(after.containmentRate).toBeCloseTo(before.containmentRate);
    expect(upcomingAppointments(roundTripped)).toEqual(upcomingAppointments(original));
  });
});
