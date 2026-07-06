import { describe, it, expect } from "vitest";
import { findFaqAnswer, matchFaqEntry } from "./faq.js";
import { dentalConfig } from "../config/dental.js";

describe("faq — knowledge base lookup", () => {
  it("answers an opening-hours question in English", () => {
    const answer = findFaqAnswer("what are your hours?", "en", dentalConfig);
    expect(answer).toContain("Sunday to Thursday");
  });

  it("answers a parking question in French", () => {
    const answer = findFaqAnswer("y a-t-il un parking ?", "fr", dentalConfig);
    expect(answer).toMatch(/parking/i);
  });

  it("answers a pricing question in Hebrew", () => {
    const answer = findFaqAnswer("כמה עולה בדיקה?", "he", dentalConfig);
    expect(answer).toContain("250");
  });

  it("matches on the English keyword table for an unknown locale answer", () => {
    // Ask in a locale we have no answer for; keywords still match via the
    // English fallback list, and the answer falls back to English.
    const answer = findFaqAnswer("what is the address?", "xx", dentalConfig);
    expect(answer).toContain("Herzl");
  });

  it("returns null when nothing matches", () => {
    expect(findFaqAnswer("do you speak dolphin?", "en", dentalConfig)).toBeNull();
    expect(findFaqAnswer("", "en", dentalConfig)).toBeNull();
  });

  it("exposes the matched entry id for logging/analytics", () => {
    const entry = matchFaqEntry("where are you located", "en", dentalConfig);
    expect(entry).not.toBeNull();
    expect(entry.id).toBe("address");
  });

  it("returns null with an empty knowledge base", () => {
    expect(findFaqAnswer("hours?", "en", {})).toBeNull();
  });
});
