// End-to-end verification suite for the LIVE pipeline.
//
// The unit tests around each adapter prove the pieces in isolation. This suite
// proves them *together*, exercising the full production path a real dental call
// travels — but deterministically, with the network I/O injected:
//
//   caller audio ──▶ ElevenLabs ASR (STT) ──▶ CALLER_UTTERANCE event
//        └▶ pure engine (reduce) ─▶ effects ─▶ ElevenLabs telephony (TTS)
//                                             └▶ dedicated dental PMS (booking)
//
// The voice side is configured through a finalized `voiceProfile`, and the
// calendar side is the dedicated dental PMS chosen for the pilot (docs/SPEC.md
// §5.2). Both flush their queued I/O through injected fakes, so a whole call —
// transcription, dialog, speech synthesis and PMS booking — is asserted without
// a real phone, API key, or clinic system.

import { describe, it, expect } from "vitest";
import { runCall } from "../core/runCall.js";
import { dentalConfig } from "../config/dental.js";
import {
  createElevenLabsTelephony,
  createElevenLabsAsr,
} from "../adapters/elevenLabsTelephony.js";
import { createDentalPms } from "../adapters/dentalPms.js";
import { createVoiceProfile, assertVoiceProfileReady } from "../config/voiceProfile.js";
import { callStarted, callEnded } from "../domain/events.js";
import { EFFECTS } from "../domain/effects.js";
import { PHASES } from "../domain/state.js";

// A finalized voice profile (with fake credentials/voices) — enough for the
// pipeline to consider voice "ready". The synthesize/transcribe fns below stand
// in for the real ElevenLabs network calls.
const VOICE_PROFILE = createVoiceProfile({
  apiKey: "test-key",
  voices: { he: "voice-he", fr: "voice-fr", en: "voice-en" },
});

// A fake dental-PMS client: records calls, hands back appointment ids.
function fakePmsClient() {
  const calls = [];
  let n = 0;
  return {
    calls,
    async createAppointment(appointment) {
      calls.push({ method: "create", appointment });
      return { id: `pms-appt-${++n}` };
    },
    async updateAppointment(id, patch) {
      calls.push({ method: "update", id, patch });
      return { id };
    },
    async cancelAppointment(id) {
      calls.push({ method: "cancel", id });
      return true;
    },
  };
}

// runLivePipeline :: ({ script }) -> Promise<result>
// Drives one full call through the live adapters. `script` is the ordered list
// of caller turns as { text, lang }; each is transcribed through the live ASR
// (so STT is part of the path) into a CALLER_UTTERANCE event before the engine
// sees it. After folding the call we flush the telephony (TTS) and PMS (booking)
// queues, exactly as a real deployment would.
async function runLivePipeline({ script }) {
  assertVoiceProfileReady(VOICE_PROFILE); // gate: voice must be finalized

  // Live TTS side — the fake `synthesize` returns deterministic audio bytes.
  const synthesized = [];
  const telephony = createElevenLabsTelephony({
    voiceProfile: VOICE_PROFILE,
    synthesize: async ({ text, voiceId, apiKey, modelId }) => {
      synthesized.push({ text, voiceId, apiKey, modelId });
      return `audio:${text}`;
    },
  });

  // Live STT side — the fake `transcribe` echoes the scripted audio payload.
  const asr = createElevenLabsAsr({
    voiceProfile: VOICE_PROFILE,
    transcribe: async ({ audio }) => ({ text: audio.text, languageCode: audio.lang }),
  });

  // Live calendar side — the dedicated dental PMS with an injected client.
  const pmsClient = fakePmsClient();
  const pms = createDentalPms({ client: pmsClient, providerId: "dr-yael", operatoryId: "chair-1" });

  // Transcribe each caller turn through the live ASR into an engine event.
  const utterances = [];
  for (const turn of script) {
    utterances.push(await asr.listen({ text: turn.text, lang: turn.lang || null }));
  }
  const events = [callStarted("live-call"), ...utterances, callEnded()];

  const { state, transcript, effects } = runCall({
    config: dentalConfig,
    telephony,
    calendar: pms,
    events,
  });

  // Flush deferred I/O, just like production after folding the call.
  const clips = await telephony.flush();
  const pmsResults = await pms.flush();

  return { state, transcript, effects, telephony, pms, pmsClient, clips, pmsResults, synthesized };
}

describe("live pipeline — Hebrew booking, STT → dialog → TTS → dental PMS", () => {
  it("books a cleaning and carries it all the way to the PMS, speaking Hebrew", async () => {
    const { state, transcript, telephony, pms, pmsClient, clips, pmsResults } =
      await runLivePipeline({
        script: [
          { text: "שלום", lang: "he" }, // language detected as Hebrew via STT
          { text: "אני רוצה לקבוע תור" }, // "I want to book an appointment"
          { text: "ניקוי אבנית" }, // "cleaning"
          { text: "יום שלישי" }, // "Tuesday"
        ],
      });

    expect(state.phase).toBe(PHASES.ENDED);
    expect(state.locale).toBe("he");

    // Everything Yael said after the language was set is Hebrew.
    const afterLang = transcript.slice(2);
    expect(afterLang.length).toBeGreaterThan(0);
    expect(afterLang.every((line) => line.locale === "he")).toBe(true);

    // TTS: every spoken line was synthesised, in order.
    expect(clips).toHaveLength(transcript.length);
    expect(clips.every((c) => c.audio.startsWith("audio:"))).toBe(true);

    // Booking reached the telephony trace and the PMS.
    expect(telephony.bookings()[0].details.appointmentType).toBe("cleaning");
    expect(pms.operations().map((o) => o.op)).toContain("book");
    expect(pmsResults).toEqual([{ op: "create", id: "pms-appt-1" }]);
    expect(pmsClient.calls[0].appointment.treatment).toBe("cleaning");
    expect(pmsClient.calls[0].appointment.providerId).toBe("dr-yael");
  });
});

describe("live pipeline — French emergency escalates safely", () => {
  it("short-circuits to a locale-correct emergency script", async () => {
    const { effects } = await runLivePipeline({
      script: [
        { text: "Bonjour", lang: "fr" },
        { text: "j'ai une urgence, je saigne" },
      ],
    });

    const escalation = effects.find((e) => e.type === EFFECTS.ESCALATE_EMERGENCY);
    expect(escalation).toBeDefined();
    expect(escalation.locale).toBe("fr");
    expect(escalation.script).toContain("15"); // French emergency number
  });
});

describe("live pipeline — English book then cancel round-trips through the PMS", () => {
  it("creates then cancels the same appointment against the PMS", async () => {
    const { state, pms, pmsClient } = await runLivePipeline({
      script: [
        { text: "English please" },
        { text: "book a cleaning for monday" },
        { text: "I need to cancel" },
        { text: "Dana Cohen" },
        { text: "monday" },
      ],
    });

    expect(state.phase).toBe(PHASES.ENDED);
    expect(pms.operations().map((o) => o.op)).toEqual(["book", "cancel"]);
    expect(pms.appointments()).toHaveLength(0);
    // The PMS client saw a create and a cancel targeting the same appointment id.
    expect(pmsClient.calls.map((c) => c.method)).toEqual(["create", "cancel"]);
    expect(pmsClient.calls[1].id).toBe("pms-appt-1");
  });
});

describe("live pipeline — FAQ answered from the generated knowledge base", () => {
  it("answers a pricing question end-to-end and synthesises the reply", async () => {
    const { transcript, clips } = await runLivePipeline({
      script: [
        { text: "English please" },
        { text: "how much is a cleaning?" },
      ],
    });

    const spoken = transcript.map((t) => t.text).join(" ");
    expect(spoken).toContain("250"); // generated pricing answer
    expect(clips.some((c) => c.text.includes("250"))).toBe(true);
  });
});

describe("live pipeline — multilingual STT round-trip (HE / FR / EN)", () => {
  it("detects each supported language and drops unsupported ones to null", async () => {
    const asr = createElevenLabsAsr({
      voiceProfile: VOICE_PROFILE,
      transcribe: async ({ audio }) => ({ text: audio.text, languageCode: audio.lang }),
    });

    const he = await asr.listen({ text: "שלום", lang: "he" });
    const fr = await asr.listen({ text: "Bonjour", lang: "fr" });
    const en = await asr.listen({ text: "Hello", lang: "en" });
    const es = await asr.listen({ text: "Hola", lang: "es" }); // unsupported

    expect(he.detectedLocale).toBe("he");
    expect(fr.detectedLocale).toBe("fr");
    expect(en.detectedLocale).toBe("en");
    expect(es.detectedLocale).toBeNull();
    expect(asr.fallbackLocale()).toBe("en");
  });
});
