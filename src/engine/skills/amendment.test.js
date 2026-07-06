import { describe, it, expect } from "vitest";
import {
  AMENDMENT_KINDS,
  AMENDMENT_STATUS,
  emptyAmendment,
  advanceAmendment,
} from "./amendment.js";

describe("amendment — reschedule slot-filling", () => {
  const start = () => emptyAmendment(AMENDMENT_KINDS.RESCHEDULE);

  it("asks for the name first (does not treat the routing utterance as a name)", () => {
    const { amendment, status } = advanceAmendment(start(), "en", "I want to reschedule");
    expect(status).toBe(AMENDMENT_STATUS.ASK_NAME);
    expect(amendment.name).toBeNull();
    expect(amendment.awaiting).toBe("name");
  });

  it("captures a free-text name once asked, then asks for the current day", () => {
    let res = advanceAmendment(start(), "en", "reschedule please");
    res = advanceAmendment(res.amendment, "en", "John Smith");
    expect(res.status).toBe(AMENDMENT_STATUS.ASK_DAY);
    expect(res.amendment.name).toBe("John Smith");
    expect(res.amendment.awaiting).toBe("day");
  });

  it("collects name, current day, then new day and completes", () => {
    let res = advanceAmendment(start(), "en", "reschedule");
    res = advanceAmendment(res.amendment, "en", "Dana Cohen");
    res = advanceAmendment(res.amendment, "en", "my appointment is on tuesday");
    expect(res.status).toBe(AMENDMENT_STATUS.ASK_NEW_DAY);
    expect(res.amendment.day).toBe("tuesday");
    res = advanceAmendment(res.amendment, "en", "move it to friday");
    expect(res.status).toBe(AMENDMENT_STATUS.COMPLETE);
    expect(res.amendment.newDay).toBe("friday");
  });

  it("does not mistake the current-day answer for the new day", () => {
    let res = advanceAmendment(start(), "en", "reschedule");
    res = advanceAmendment(res.amendment, "en", "Ruth");
    res = advanceAmendment(res.amendment, "en", "tuesday");
    // Still needs the new day — the day just given is the current one.
    expect(res.status).toBe(AMENDMENT_STATUS.ASK_NEW_DAY);
    expect(res.amendment.day).toBe("tuesday");
    expect(res.amendment.newDay).toBeNull();
  });

  it("works in French and Hebrew", () => {
    let fr = advanceAmendment(emptyAmendment(AMENDMENT_KINDS.RESCHEDULE), "fr", "reprogrammer");
    fr = advanceAmendment(fr.amendment, "fr", "Marie");
    fr = advanceAmendment(fr.amendment, "fr", "lundi");
    fr = advanceAmendment(fr.amendment, "fr", "jeudi");
    expect(fr.status).toBe(AMENDMENT_STATUS.COMPLETE);
    expect(fr.amendment.day).toBe("lundi");
    expect(fr.amendment.newDay).toBe("jeudi");

    let he = advanceAmendment(emptyAmendment(AMENDMENT_KINDS.RESCHEDULE), "he", "לשנות תור");
    he = advanceAmendment(he.amendment, "he", "יעל");
    he = advanceAmendment(he.amendment, "he", "יום שני");
    he = advanceAmendment(he.amendment, "he", "יום חמישי");
    expect(he.status).toBe(AMENDMENT_STATUS.COMPLETE);
    expect(he.amendment.day).toBe("יום שני");
    expect(he.amendment.newDay).toBe("יום חמישי");
  });
});

describe("amendment — cancel slot-filling", () => {
  const start = () => emptyAmendment(AMENDMENT_KINDS.CANCEL);

  it("collects name then day and completes (no new day)", () => {
    let res = advanceAmendment(start(), "en", "cancel my appointment");
    expect(res.status).toBe(AMENDMENT_STATUS.ASK_NAME);
    res = advanceAmendment(res.amendment, "en", "Avi Levi");
    expect(res.status).toBe(AMENDMENT_STATUS.ASK_DAY);
    res = advanceAmendment(res.amendment, "en", "wednesday");
    expect(res.status).toBe(AMENDMENT_STATUS.COMPLETE);
    expect(res.amendment.kind).toBe(AMENDMENT_KINDS.CANCEL);
    expect(res.amendment.name).toBe("Avi Levi");
    expect(res.amendment.day).toBe("wednesday");
    expect(res.amendment.newDay).toBeNull();
  });

  it("picks up a day mentioned in the opening utterance", () => {
    let res = advanceAmendment(start(), "en", "cancel my appointment on monday");
    expect(res.status).toBe(AMENDMENT_STATUS.ASK_NAME);
    expect(res.amendment.day).toBe("monday");
    res = advanceAmendment(res.amendment, "en", "Sara");
    expect(res.status).toBe(AMENDMENT_STATUS.COMPLETE);
    expect(res.amendment.day).toBe("monday");
  });
});

describe("amendment — purity", () => {
  it("does not mutate the previous amendment", () => {
    const prev = emptyAmendment(AMENDMENT_KINDS.CANCEL);
    const snapshot = JSON.stringify(prev);
    advanceAmendment(prev, "en", "Dana on friday");
    expect(JSON.stringify(prev)).toBe(snapshot);
  });
});
