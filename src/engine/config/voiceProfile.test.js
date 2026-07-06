import { describe, it, expect } from "vitest";
import {
  createVoiceProfile,
  createVoiceProfileFromEnv,
  missingVoiceRequirements,
  isVoiceProfileReady,
  assertVoiceProfileReady,
  REQUIRED_VOICE_LOCALES,
  VOICE_FINALIZATION_CHECKLIST,
} from "./voiceProfile.js";
import { DEFAULT_TTS_MODEL, DEFAULT_STT_MODEL } from "../adapters/elevenLabsTelephony.js";
import { createElevenLabsTelephony, createElevenLabsAsr } from "../adapters/elevenLabsTelephony.js";
import { say } from "../domain/effects.js";

describe("voiceProfile — finalizing voice, and reporting what is needed", () => {
  it("defaults the models and freezes the profile", () => {
    const profile = createVoiceProfile();
    expect(profile.ttsModel).toBe(DEFAULT_TTS_MODEL);
    expect(profile.sttModel).toBe(DEFAULT_STT_MODEL);
    expect(Object.isFrozen(profile)).toBe(true);
    expect(Object.isFrozen(profile.voices)).toBe(true);
  });

  it("reports every missing input on an empty profile", () => {
    const missing = missingVoiceRequirements(createVoiceProfile());
    expect(missing.some((m) => m.startsWith("apiKey"))).toBe(true);
    for (const locale of REQUIRED_VOICE_LOCALES) {
      expect(missing.some((m) => m.includes(`voices.${locale}`))).toBe(true);
    }
    expect(isVoiceProfileReady(createVoiceProfile())).toBe(false);
  });

  it("is ready once an api key and a voice per locale are provided", () => {
    const profile = createVoiceProfile({
      apiKey: "xi-key",
      voices: { he: "voice-he", fr: "voice-fr", en: "voice-en" },
    });
    expect(missingVoiceRequirements(profile)).toEqual([]);
    expect(isVoiceProfileReady(profile)).toBe(true);
    expect(assertVoiceProfileReady(profile)).toBe(profile);
  });

  it("accepts a single fallback voice as covering every locale", () => {
    const profile = createVoiceProfile({ apiKey: "k", fallbackVoiceId: "one-voice" });
    expect(isVoiceProfileReady(profile)).toBe(true);
  });

  it("throws an itemised error listing what is still needed", () => {
    const profile = createVoiceProfile({ voices: { en: "voice-en" } });
    expect(() => assertVoiceProfileReady(profile)).toThrow(/not finalized yet/);
    try {
      assertVoiceProfileReady(profile);
    } catch (err) {
      expect(err.message).toContain("apiKey");
      expect(err.message).toContain("voices.he");
      expect(err.message).toContain("voices.fr");
      expect(err.message).not.toContain("voices.en"); // already provided
    }
  });

  it("publishes the human sign-off checklist (decisions outside code)", () => {
    expect(VOICE_FINALIZATION_CHECKLIST.length).toBeGreaterThan(0);
    expect(VOICE_FINALIZATION_CHECKLIST.some((i) => /hebrew/i.test(i))).toBe(true);
  });
});

describe("voiceProfile — building from the runtime environment", () => {
  it("reads the api key, per-locale voices and model overrides from env", () => {
    const profile = createVoiceProfileFromEnv({
      ELEVENLABS_API_KEY: "xi-key",
      ELEVENLABS_VOICE_HE: "voice-he",
      ELEVENLABS_VOICE_FR: "voice-fr",
      ELEVENLABS_VOICE_EN: "voice-en",
      ELEVENLABS_TTS_MODEL: "custom-tts",
      ELEVENLABS_STT_MODEL: "custom-stt",
    });
    expect(profile.apiKey).toBe("xi-key");
    expect(profile.voices).toEqual({ he: "voice-he", fr: "voice-fr", en: "voice-en" });
    expect(profile.ttsModel).toBe("custom-tts");
    expect(profile.sttModel).toBe("custom-stt");
    expect(isVoiceProfileReady(profile)).toBe(true);
  });

  it("defaults the models and is not ready on an empty environment", () => {
    const profile = createVoiceProfileFromEnv({});
    expect(profile.ttsModel).toBe(DEFAULT_TTS_MODEL);
    expect(profile.sttModel).toBe(DEFAULT_STT_MODEL);
    expect(isVoiceProfileReady(profile)).toBe(false);
  });

  it("honours a single fallback voice from env", () => {
    const profile = createVoiceProfileFromEnv({
      ELEVENLABS_API_KEY: "k",
      ELEVENLABS_VOICE_FALLBACK: "one-voice",
    });
    expect(profile.fallbackVoiceId).toBe("one-voice");
    expect(isVoiceProfileReady(profile)).toBe(true);
  });
});

describe("voiceProfile — wiring into the ElevenLabs adapter", () => {
  it("sources apiKey, per-locale voices and model from the profile", async () => {
    const profile = createVoiceProfile({
      apiKey: "xi-key",
      voices: { he: "voice-he", fr: "voice-fr", en: "voice-en" },
    });
    const seen = [];
    const synthesize = async ({ voiceId, apiKey, modelId }) => {
      seen.push({ voiceId, apiKey, modelId });
      return "audio";
    };
    const tel = createElevenLabsTelephony({ voiceProfile: profile, synthesize });
    tel.perform(say("he", "שלום"));
    await tel.flush();
    expect(seen[0]).toEqual({ voiceId: "voice-he", apiKey: "xi-key", modelId: DEFAULT_TTS_MODEL });
  });

  it("lets the ASR side read its key and model from the profile", async () => {
    const profile = createVoiceProfile({ apiKey: "xi-key" });
    const seen = [];
    const transcribe = async ({ apiKey, modelId }) => {
      seen.push({ apiKey, modelId });
      return { text: "hi", languageCode: "en" };
    };
    const asr = createElevenLabsAsr({ voiceProfile: profile, transcribe });
    await asr.listen("<audio>");
    expect(seen[0]).toEqual({ apiKey: "xi-key", modelId: DEFAULT_STT_MODEL });
  });
});
