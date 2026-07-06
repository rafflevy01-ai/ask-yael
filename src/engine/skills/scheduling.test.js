import { describe, it, expect } from "vitest";
import {
  BOOKING_STATUS,
  emptyBooking,
  advanceBooking,
  detectAppointmentType,
  detectDay,
  appointmentLabel,
} from "./scheduling.js";
import { dentalConfig } from "../config/dental.js";

describe("scheduling — appointment type detection", () => {
  it("matches a localized keyword (English)", () => {
    expect(detectAppointmentType("I need a cleaning", "en", dentalConfig)).toBe("cleaning");
  });

  it("matches a localized keyword (French)", () => {
    expect(detectAppointmentType("je voudrais un détartrage", "fr", dentalConfig)).toBe("cleaning");
  });

  it("matches a localized keyword (Hebrew)", () => {
    expect(detectAppointmentType("אני צריך טיפול שורש", "he", dentalConfig)).toBe("root_canal");
  });

  it("returns null when nothing matches", () => {
    expect(detectAppointmentType("hello there", "en", dentalConfig)).toBeNull();
    expect(detectAppointmentType("", "en", dentalConfig)).toBeNull();
  });
});

describe("scheduling — day detection", () => {
  it("recognises a weekday token", () => {
    expect(detectDay("can we do tuesday", "en")).toBe("tuesday");
    expect(detectDay("plutôt mardi", "fr")).toBe("mardi");
  });

  it("recognises relative day tokens", () => {
    expect(detectDay("tomorrow please", "en")).toBe("tomorrow");
  });

  it("returns null with no recognisable day", () => {
    expect(detectDay("whenever you like", "en")).toBeNull();
  });
});

describe("scheduling — slot-filling machine", () => {
  it("asks for the appointment type first when nothing is known", () => {
    const { booking, status } = advanceBooking(emptyBooking(), dentalConfig, "en", "I want to book");
    expect(status).toBe(BOOKING_STATUS.ASK_TYPE);
    expect(booking.appointmentType).toBeNull();
    expect(booking.awaiting).toBe("type");
  });

  it("asks for the day once the type is known", () => {
    const { booking, status } = advanceBooking(emptyBooking(), dentalConfig, "en", "I need a filling");
    expect(status).toBe(BOOKING_STATUS.ASK_DAY);
    expect(booking.appointmentType).toBe("filling");
    expect(booking.awaiting).toBe("day");
  });

  it("completes when both type and day are provided in one utterance", () => {
    const { booking, status } = advanceBooking(
      emptyBooking(),
      dentalConfig,
      "en",
      "book a cleaning for tuesday",
    );
    expect(status).toBe(BOOKING_STATUS.COMPLETE);
    expect(booking.appointmentType).toBe("cleaning");
    expect(booking.day).toBe("tuesday");
  });

  it("carries a filled slot across turns", () => {
    const first = advanceBooking(emptyBooking(), dentalConfig, "en", "a cleaning");
    expect(first.status).toBe(BOOKING_STATUS.ASK_DAY);
    const second = advanceBooking(first.booking, dentalConfig, "en", "friday");
    expect(second.status).toBe(BOOKING_STATUS.COMPLETE);
    expect(second.booking.appointmentType).toBe("cleaning");
    expect(second.booking.day).toBe("friday");
  });

  it("accepts free-text as the day when it was the awaited slot", () => {
    const asked = advanceBooking(emptyBooking(), dentalConfig, "en", "a checkup");
    expect(asked.booking.awaiting).toBe("day");
    const answered = advanceBooking(asked.booking, dentalConfig, "en", "sometime next week");
    expect(answered.status).toBe(BOOKING_STATUS.COMPLETE);
    expect(answered.booking.day).toBe("sometime next week");
  });

  it("is pure — does not mutate the previous booking", () => {
    const prev = emptyBooking();
    const snapshot = JSON.stringify(prev);
    advanceBooking(prev, dentalConfig, "en", "a cleaning on monday");
    expect(JSON.stringify(prev)).toBe(snapshot);
  });
});

describe("scheduling — appointmentLabel", () => {
  it("returns the catalogue label for a code", () => {
    expect(appointmentLabel("root_canal", dentalConfig)).toBe("Root canal");
  });

  it("falls back to the code when unknown", () => {
    expect(appointmentLabel("mystery", dentalConfig)).toBe("mystery");
  });
});
