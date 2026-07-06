import { describe, it, expect } from "vitest";
import { runCall } from "./runCall.js";
import { createMockTelephony } from "../adapters/mockTelephony.js";
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
        callEnded(),
      ],
    });

    expect(state.phase).toBe(PHASES.ENDED);
    expect(state.locale).toBe("he");
    // Every spoken line should be in Hebrew once the language is set.
    const afterLang = transcript.slice(2); // skip the two pre-language greeting lines
    expect(afterLang.length).toBeGreaterThan(0);
    expect(afterLang.every((line) => line.locale === "he")).toBe(true);
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
});
