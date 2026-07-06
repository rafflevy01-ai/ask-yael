import { describe, it, expect } from "vitest";
import { isEmergency, emergencyScript } from "./triage.js";
import { dentalConfig } from "../config/dental.js";

describe("isEmergency", () => {
  it("flags baseline medical emergencies per locale", () => {
    expect(isEmergency("I am bleeding a lot", "en")).toBe(true);
    expect(isEmergency("je saigne beaucoup", "fr")).toBe(true);
    expect(isEmergency("אני מדמם", "he")).toBe(true);
  });

  it("does not flag routine requests", () => {
    expect(isEmergency("I'd like to book a cleaning", "en")).toBe(false);
  });

  it("returns false for empty input", () => {
    expect(isEmergency("", "en")).toBe(false);
  });

  it("supports vertical-specific triggers from a config pack", () => {
    // Without dental triggers this is not caught; with them it is.
    expect(isEmergency("my tooth got knocked out", "en")).toBe(false);
    expect(
      isEmergency("my tooth got knocked out", "en", dentalConfig.emergencyTriggers),
    ).toBe(true);
  });
});

describe("emergencyScript", () => {
  it("interpolates the locale-correct emergency number", () => {
    expect(emergencyScript("he")).toContain("101");
    expect(emergencyScript("fr")).toContain("15");
    expect(emergencyScript("en")).toContain("911");
  });
});
