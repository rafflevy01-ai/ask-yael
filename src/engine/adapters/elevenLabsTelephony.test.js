import { describe, it, expect } from "vitest";
import {
  createElevenLabsTelephony,
  createElevenLabsAsr,
  DEFAULT_TTS_MODEL,
} from "./elevenLabsTelephony.js";
import { say, sendSms, bookAppointment, log } from "../domain/effects.js";
import { EVENTS } from "../domain/events.js";
import { runCall } from "../core/runCall.js";
import { dentalConfig } from "../config/dental.js";
import { callStarted, callerUtterance, callEnded } from "../domain/events.js";

describe("elevenLabsTelephony — telephony interface parity", () => {
  it("records spoken lines, SMS, bookings and the full effect trace like the mock", () => {
    const tel = createElevenLabsTelephony({ apiKey: "k", voiceId: "v" });
    tel.perform(say("fr", "Bonjour"));
    tel.perform(sendSms("fr", "Confirmé"));
    tel.perform(bookAppointment("call-1", { appointmentType: "cleaning", day: "tuesday" }));
    tel.perform(log({ kind: "call_started" }));

    expect(tel.transcript()).toEqual([{ locale: "fr", text: "Bonjour" }]);
    expect(tel.messages()).toEqual([{ locale: "fr", text: "Confirmé" }]);
    expect(tel.bookings()).toEqual([{ callId: "call-1", details: { appointmentType: "cleaning", day: "tuesday" } }]);
    expect(tel.effects()).toHaveLength(4);
  });

  it("queues a TTS job for every SAY and defers I/O until flush()", async () => {
    const calls = [];
    const synthesize = async ({ text, voiceId, modelId, locale }) => {
      calls.push({ text, voiceId, modelId, locale });
      return `audio:${text}`;
    };
    const tel = createElevenLabsTelephony({
      apiKey: "k",
      voices: { he: "voice-he", en: "voice-en" },
      synthesize,
    });

    tel.perform(say("he", "שלום"));
    tel.perform(say("en", "Hello"));

    // Nothing synthesised yet — perform stays pure/synchronous.
    expect(calls).toHaveLength(0);
    expect(tel.pendingSpeech()).toHaveLength(2);

    const clips = await tel.flush();
    expect(calls).toEqual([
      { text: "שלום", voiceId: "voice-he", modelId: DEFAULT_TTS_MODEL, locale: "he" },
      { text: "Hello", voiceId: "voice-en", modelId: DEFAULT_TTS_MODEL, locale: "en" },
    ]);
    expect(clips).toEqual([
      { locale: "he", text: "שלום", audio: "audio:שלום" },
      { locale: "en", text: "Hello", audio: "audio:Hello" },
    ]);
    expect(tel.pendingSpeech()).toHaveLength(0);
    expect(tel.audioClips()).toHaveLength(2);
  });

  it("falls back to the single configured voice when no per-locale voice is set", async () => {
    const seen = [];
    const synthesize = async ({ voiceId }) => {
      seen.push(voiceId);
      return "a";
    };
    const tel = createElevenLabsTelephony({ apiKey: "k", voiceId: "fallback", synthesize });
    tel.perform(say("fr", "Salut"));
    await tel.flush();
    expect(seen).toEqual(["fallback"]);
  });

  it("drives an end-to-end call through runCall and synthesises every reply", async () => {
    const tel = createElevenLabsTelephony({
      apiKey: "k",
      voiceId: "v",
      synthesize: async ({ text }) => `audio:${text}`,
    });
    const { transcript } = runCall({
      config: dentalConfig,
      telephony: tel,
      events: [callStarted("c1"), callerUtterance("English", "en"), callEnded()],
    });
    expect(transcript.length).toBeGreaterThan(0);

    const clips = await tel.flush();
    expect(clips).toHaveLength(transcript.length);
    expect(clips.every((c) => c.audio.startsWith("audio:"))).toBe(true);
  });

  it("surfaces synthesis errors from flush()", async () => {
    const tel = createElevenLabsTelephony({
      apiKey: "k",
      voiceId: "v",
      synthesize: async () => {
        throw new Error("boom");
      },
    });
    tel.perform(say("en", "Hi"));
    await expect(tel.flush()).rejects.toThrow("boom");
  });
});

describe("elevenLabsAsr — speech-to-text", () => {
  it("produces a CALLER_UTTERANCE with detected supported locale", async () => {
    const asr = createElevenLabsAsr({
      apiKey: "k",
      transcribe: async () => ({ text: "Bonjour", languageCode: "fr" }),
    });
    const event = await asr.listen("<audio-bytes>");
    expect(event.type).toBe(EVENTS.CALLER_UTTERANCE);
    expect(event.text).toBe("Bonjour");
    expect(event.detectedLocale).toBe("fr");
  });

  it("drops an unsupported detected language to null", async () => {
    const asr = createElevenLabsAsr({
      apiKey: "k",
      transcribe: async () => ({ text: "Hola", languageCode: "es" }),
    });
    const event = await asr.listen("<audio>");
    expect(event.detectedLocale).toBeNull();
    expect(asr.fallbackLocale()).toBe("en");
  });
});
