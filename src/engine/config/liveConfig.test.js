import { describe, it, expect } from "vitest";
import {
  createLiveReceptionist,
  describeLiveReadiness,
  missingLiveConfig,
  assertLiveConfigReady,
} from "./liveConfig.js";
import { runCall } from "../core/runCall.js";
import { callStarted, callerUtterance, callEnded } from "../domain/events.js";
import { EFFECTS } from "../domain/effects.js";
import { PHASES } from "../domain/state.js";

// A fully-configured environment (fake secrets) — enough for the live pipeline
// to consider every edge ready.
const FULL_ENV = Object.freeze({
  ELEVENLABS_API_KEY: "xi-key",
  ELEVENLABS_VOICE_HE: "voice-he",
  ELEVENLABS_VOICE_FR: "voice-fr",
  ELEVENLABS_VOICE_EN: "voice-en",
  DENTAL_PMS_BASE_URL: "https://pms.example.test",
  DENTAL_PMS_API_KEY: "pms-key",
  DENTAL_PMS_PROVIDER_ID: "dr-yael",
  DENTAL_PMS_OPERATORY_ID: "chair-1",
  TELEPHONY_CARRIER: "twilio",
  TELEPHONY_PHONE_NUMBER: "+972-3-000-0000",
});

describe("liveConfig — reporting what is still needed to go live", () => {
  it("lists every missing input on an empty environment", () => {
    const missing = missingLiveConfig({});
    expect(missing.some((m) => m.startsWith("apiKey"))).toBe(true);
    expect(missing.some((m) => m.includes("voices.he"))).toBe(true);
    expect(missing.some((m) => m.includes("DENTAL_PMS_BASE_URL"))).toBe(true);
    expect(missing.some((m) => m.includes("DENTAL_PMS_API_KEY"))).toBe(true);
    expect(missing.some((m) => m.includes("TELEPHONY_CARRIER"))).toBe(true);
    expect(missing.some((m) => m.includes("TELEPHONY_PHONE_NUMBER"))).toBe(true);
  });

  it("is empty when every edge is configured", () => {
    expect(missingLiveConfig(FULL_ENV)).toEqual([]);
  });

  it("groups readiness by edge and publishes the human checklist", () => {
    const readiness = describeLiveReadiness({
      ELEVENLABS_API_KEY: "xi-key",
      ELEVENLABS_VOICE_HE: "voice-he",
      ELEVENLABS_VOICE_FR: "voice-fr",
      ELEVENLABS_VOICE_EN: "voice-en",
    });
    expect(readiness.ready).toBe(false);
    expect(readiness.voice).toEqual([]);
    expect(readiness.pms.length).toBeGreaterThan(0);
    expect(readiness.telephony.length).toBeGreaterThan(0);
    expect(readiness.checklist.length).toBeGreaterThan(0);
  });

  it("reports ready for a fully-configured environment", () => {
    const readiness = describeLiveReadiness(FULL_ENV);
    expect(readiness.ready).toBe(true);
    expect(readiness.missing).toEqual([]);
  });

  it("assertLiveConfigReady throws an itemised error when inputs are missing", () => {
    expect(() => assertLiveConfigReady({})).toThrow(/not ready to take live calls/);
    try {
      assertLiveConfigReady({ ELEVENLABS_API_KEY: "xi-key" });
    } catch (err) {
      expect(err.message).toContain("voices.he");
      expect(err.message).toContain("DENTAL_PMS_BASE_URL");
      expect(err.message).not.toContain("apiKey"); // already provided
    }
  });
});

describe("liveConfig — wiring the live edges from runtime configuration", () => {
  it("refuses to wire a half-configured pipeline", () => {
    expect(() => createLiveReceptionist({ env: { ELEVENLABS_API_KEY: "k" } })).toThrow(
      /not ready to take live calls/,
    );
  });

  it("assembles voice profile, telephony, asr and dental PMS from env", () => {
    const receptionist = createLiveReceptionist({ env: FULL_ENV, fetchImpl: async () => ({}) });
    expect(receptionist.voiceProfile.apiKey).toBe("xi-key");
    expect(receptionist.carrier).toBe("twilio");
    expect(receptionist.phoneNumber).toBe("+972-3-000-0000");
    expect(typeof receptionist.telephony.perform).toBe("function");
    expect(typeof receptionist.asr.listen).toBe("function");
    expect(typeof receptionist.calendar.flush).toBe("function");
  });

  it("does not touch the network at construction time", () => {
    let called = 0;
    const fetchImpl = async () => {
      called += 1;
      return { ok: true, json: async () => ({}) };
    };
    createLiveReceptionist({ env: FULL_ENV, fetchImpl });
    expect(called).toBe(0);
  });

  it("threads a fake fetch through the whole live pipeline end-to-end", async () => {
    // A fake ElevenLabs + PMS backend keyed by URL, so no real network is used.
    const requests = [];
    let apptSeq = 0;
    const fetchImpl = async (url, init = {}) => {
      requests.push({ url, method: init.method });
      if (url.includes("/text-to-speech/")) {
        return { ok: true, arrayBuffer: async () => `audio-bytes` };
      }
      if (url.endsWith("/speech-to-text")) {
        return { ok: true, json: async () => ({ text: "", language_code: "he" }) };
      }
      if (url.endsWith("/appointments")) {
        return { ok: true, json: async () => ({ id: `appt-${++apptSeq}` }) };
      }
      return { ok: true, json: async () => ({}) };
    };

    const { config, telephony, calendar } = createLiveReceptionist({
      env: FULL_ENV,
      fetchImpl,
    });

    const events = [
      callStarted("live-call"),
      callerUtterance("שלום", "he"),
      callerUtterance("אני רוצה לקבוע תור", "he"),
      callerUtterance("ניקוי אבנית", "he"),
      callerUtterance("יום שלישי", "he"),
      callEnded(),
    ];

    const { state, effects } = runCall({ config, telephony, calendar, events });
    expect(state.phase).toBe(PHASES.ENDED);
    expect(effects.some((e) => e.type === EFFECTS.BOOK_APPOINTMENT)).toBe(true);

    // Flush deferred I/O — this is the only place real network calls fire.
    const clips = await telephony.flush();
    const pmsResults = await calendar.flush();

    expect(clips.length).toBeGreaterThan(0);
    expect(clips.every((c) => c.audio === "audio-bytes")).toBe(true);
    expect(pmsResults[0]).toEqual({ op: "create", id: "appt-1" });

    // The fake fetch saw both ElevenLabs TTS and the dental-PMS booking call.
    expect(requests.some((r) => r.url.includes("/text-to-speech/"))).toBe(true);
    expect(requests.some((r) => r.url.endsWith("/appointments"))).toBe(true);
  });
});
