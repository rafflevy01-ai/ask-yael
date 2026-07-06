import { describe, it, expect } from "vitest";
import { detectIntent, INTENTS } from "../domain/intents.js";

describe("detectIntent", () => {
  it("returns UNKNOWN for empty or blank input", () => {
    expect(detectIntent("", "en")).toBe(INTENTS.UNKNOWN);
    expect(detectIntent("   ", "en")).toBe(INTENTS.UNKNOWN);
    expect(detectIntent(null, "en")).toBe(INTENTS.UNKNOWN);
  });

  it("detects booking intent in English", () => {
    expect(detectIntent("I'd like to book an appointment", "en")).toBe(INTENTS.BOOK);
  });

  it("detects booking intent in French", () => {
    expect(detectIntent("Je voudrais prendre rendez-vous", "fr")).toBe(INTENTS.BOOK);
  });

  it("detects booking intent in Hebrew", () => {
    expect(detectIntent("אני רוצה לקבוע תור", "he")).toBe(INTENTS.BOOK);
  });

  it("detects cancel and reschedule distinctly", () => {
    expect(detectIntent("I need to cancel", "en")).toBe(INTENTS.CANCEL);
    expect(detectIntent("Can I reschedule my appointment?", "en")).toBe(INTENTS.RESCHEDULE);
  });

  it("detects a request for a human", () => {
    expect(detectIntent("Can I speak to a real person?", "en")).toBe(INTENTS.HANDOFF);
  });

  it("prioritises emergency over any other matching intent", () => {
    // Mentions both "appointment" (BOOK) and "bleeding" (EMERGENCY).
    expect(detectIntent("I have an appointment but I'm bleeding badly", "en")).toBe(
      INTENTS.EMERGENCY,
    );
  });

  it("falls back to English keywords for an unknown locale", () => {
    expect(detectIntent("I want to book", "xx")).toBe(INTENTS.BOOK);
  });
});
