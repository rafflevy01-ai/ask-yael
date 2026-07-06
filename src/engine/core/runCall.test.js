import { describe, it, expect } from "vitest";
import { runCall } from "./runCall.js";
import { createMockTelephony } from "../adapters/mockTelephony.js";
import { createMockCalendar } from "../adapters/mockCalendar.js";
import { callStarted, callerUtterance, callEnded } from "../domain/events.js";
import { EFFECTS } from "../domain/effects.js";
import { PHASES } from "../domain/state.js";
import { dentalConfig } from "../config/dental.js";

describe("runCall — end-to-end dental call simulation", () => {
  it("greets, selects Hebrew, books an appointment, then ends", () => {
    const telephony = createMockTelephony();
    const { state, transcript, effects } = runCall({
      config: dentalConfig,
      telephony,
      events: [
        callStarted("call-42"),
        callerUtterance("שלום", "he"), // language detected as Hebrew
        callerUtterance("אני רוצה לקבוע תור"), // "I want to book an appointment"
        callerUtterance("ניקוי אבנית"), // "cleaning" — the appointment type
        callerUtterance("יום שלישי"), // "Tuesday" — the preferred day
        callEnded(),
      ],
    });

    expect(state.phase).toBe(PHASES.ENDED);
    expect(state.locale).toBe("he");
    // Every spoken line should be in Hebrew once the language is set.
    const afterLang = transcript.slice(2); // skip the two pre-language greeting lines
    expect(afterLang.length).toBeGreaterThan(0);
    expect(afterLang.every((line) => line.locale === "he")).toBe(true);
    // The booking flow produced a real appointment + SMS confirmation.
    const booking = telephony.bookings()[0];
    expect(booking).toBeDefined();
    expect(booking.details.appointmentType).toBe("cleaning");
    expect(booking.details.day).toBe("יום שלישי");
    expect(telephony.messages()[0].locale).toBe("he");
    // The call must be properly terminated.
    expect(effects.map((e) => e.type)).toContain(EFFECTS.END_CALL);
  });

  it("escalates a French emergency to a human-safe script", () => {
    const telephony = createMockTelephony();
    const { effects } = runCall({
      config: dentalConfig,
      telephony,
      events: [
        callStarted("call-99"),
        callerUtterance("Bonjour", "fr"),
        callerUtterance("j'ai une urgence, je saigne"),
      ],
    });

    const escalation = effects.find((e) => e.type === EFFECTS.ESCALATE_EMERGENCY);
    expect(escalation).toBeDefined();
    expect(escalation.locale).toBe("fr");
    expect(escalation.script).toContain("15");
  });

  it("applies a booking to the Calendar/PMS adapter, then cancels it", () => {
    const telephony = createMockTelephony();
    const calendar = createMockCalendar();
    const { state } = runCall({
      config: dentalConfig,
      telephony,
      calendar,
      events: [
        callStarted("call-cal"),
        callerUtterance("English please"),
        callerUtterance("book a cleaning for monday"),
        // Now cancel the same appointment.
        callerUtterance("I need to cancel"),
        callerUtterance("Dana Cohen"),
        callerUtterance("monday"),
        callEnded(),
      ],
    });

    expect(state.phase).toBe(PHASES.ENDED);
    // The calendar saw a book then a cancel; the appointment is no longer active.
    expect(calendar.operations().map((o) => o.op)).toEqual(["book", "cancel"]);
    expect(calendar.appointments()).toHaveLength(0);
  });
});
