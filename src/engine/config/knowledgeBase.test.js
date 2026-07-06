import { describe, it, expect } from "vitest";
import { buildKnowledgeBase, FAQ_TOPIC_IDS } from "./knowledgeBase.js";
import { dentalConfig, dentalClinicProfile } from "./dental.js";
import { findFaqAnswer } from "../skills/faq.js";

describe("buildKnowledgeBase — generated FAQ from a single source of truth", () => {
  it("renders one entry per known topic with keywords + localised answers", () => {
    const kb = buildKnowledgeBase(dentalClinicProfile);
    expect(kb.map((e) => e.id)).toEqual(FAQ_TOPIC_IDS);
    for (const entry of kb) {
      expect(entry.keywords.en.length).toBeGreaterThan(0);
      for (const loc of ["en", "fr", "he"]) {
        expect(typeof entry.answer[loc]).toBe("string");
        expect(entry.answer[loc].length).toBeGreaterThan(0);
      }
    }
  });

  it("is the exact knowledge base the dental config ships", () => {
    // The dental config generates its knowledge base from the same profile, so
    // the two must be identical value-for-value.
    expect(dentalConfig.knowledgeBase).toEqual(buildKnowledgeBase(dentalClinicProfile));
  });

  it("propagates a new health fund into every language's insurance answer", () => {
    const profile = {
      ...dentalClinicProfile,
      healthFunds: [
        ...dentalClinicProfile.healthFunds,
        { en: "Assuta", fr: "Assuta", he: "אסותא" },
      ],
    };
    const kb = buildKnowledgeBase(profile);
    const insurance = kb.find((e) => e.id === "insurance");
    expect(insurance.answer.en).toContain("Assuta");
    expect(insurance.answer.he).toContain("אסותא");
    // The new fund is joined grammatically as the final item in each locale.
    expect(insurance.answer.en).toContain("Leumit and Assuta");
    expect(insurance.answer.he).toContain("לאומית ואסותא");
  });

  it("propagates a price change into the pricing answer", () => {
    const profile = {
      ...dentalClinicProfile,
      pricing: { ...dentalClinicProfile.pricing, basePrice: 300 },
    };
    const kb = buildKnowledgeBase(profile);
    const pricing = kb.find((e) => e.id === "pricing");
    expect(pricing.answer.en).toContain("300");
    expect(pricing.answer.he).toContain("300");
    expect(pricing.answer.en).not.toContain("250");
  });

  it("feeds the FAQ skill so the generated answers are actually reachable", () => {
    expect(findFaqAnswer("what are your hours?", "en", dentalConfig)).toContain("Sunday to Thursday");
    expect(findFaqAnswer("do you take Maccabi?", "en", dentalConfig)).toContain("Maccabi");
  });

  it("produces deep-frozen data callers cannot mutate", () => {
    const kb = buildKnowledgeBase(dentalClinicProfile);
    expect(Object.isFrozen(kb)).toBe(true);
    expect(Object.isFrozen(kb[0])).toBe(true);
    expect(Object.isFrozen(kb[0].answer)).toBe(true);
  });
});
