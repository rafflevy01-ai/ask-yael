// Live telephony / voice adapter backed by ElevenLabs.
//
// This is the production sibling of `mockTelephony`. It implements the very same
// tiny interface the pure core relies on — `perform(effect)` plus the accessors
// `transcript()` / `messages()` / `bookings()` / `effects()` — so it drops into
// `runCall` unchanged. The difference is what happens at the edge: every `SAY`
// effect is turned into speech through the ElevenLabs Text-to-Speech API, and
// caller audio is transcribed through ElevenLabs Speech-to-Text.
//
// Effects-as-data keeps the pure core pure, and keeping I/O deferred keeps
// `runCall` synchronous: `perform` only *records* what should be spoken (and
// enqueues a TTS job); the actual network call happens in the async `flush()`.
// All I/O is injectable (`synthesize` / `fetchImpl`), so the whole adapter is
// deterministically unit-testable without a network or an API key.

import { callerUtterance } from "../domain/events.js";
import { EFFECTS } from "../domain/effects.js";
import { isSupportedLocale, DEFAULT_LOCALE } from "../domain/locales.js";

// Public ElevenLabs REST base + sensible model defaults.
export const ELEVENLABS_API_BASE = "https://api.elevenlabs.io/v1";
export const DEFAULT_TTS_MODEL = "eleven_multilingual_v2"; // covers HE/FR/EN + more
export const DEFAULT_STT_MODEL = "scribe_v1";

// defaultSynthesize :: (opts) -> Promise<ArrayBuffer>
// The real TTS call. Streams `text` through the chosen voice and returns the
// raw audio bytes for the telephony layer to play back to the caller.
async function defaultSynthesize({
  text,
  voiceId,
  modelId = DEFAULT_TTS_MODEL,
  apiKey,
  fetchImpl = fetch,
  apiBase = ELEVENLABS_API_BASE,
}) {
  if (!voiceId) throw new Error("elevenLabsTelephony: missing voiceId for TTS");
  if (!apiKey) throw new Error("elevenLabsTelephony: missing apiKey for TTS");

  const res = await fetchImpl(`${apiBase}/text-to-speech/${voiceId}`, {
    method: "POST",
    headers: {
      "xi-api-key": apiKey,
      "Content-Type": "application/json",
      Accept: "audio/mpeg",
    },
    body: JSON.stringify({ text, model_id: modelId }),
  });
  if (!res.ok) {
    throw new Error(`ElevenLabs TTS failed: ${res.status} ${res.statusText}`);
  }
  return res.arrayBuffer();
}

// createElevenLabsTelephony :: (Options) -> Telephony
// Options:
//   - apiKey:     ElevenLabs API key (required for real calls; never hard-coded).
//   - voiceId:    fallback voice used when no per-locale voice is configured.
//   - voices:     { [locale]: voiceId } — pick a native-sounding voice per language.
//   - modelId:    TTS model (defaults to the multilingual model).
//   - synthesize: injectable async TTS fn (defaults to the real ElevenLabs call).
//   - fetchImpl:  injectable fetch (defaults to global fetch).
export function createElevenLabsTelephony(options = {}) {
  const {
    apiKey,
    voiceId = null,
    voices = {},
    modelId = DEFAULT_TTS_MODEL,
    synthesize = defaultSynthesize,
    fetchImpl = fetch,
    apiBase = ELEVENLABS_API_BASE,
  } = options;

  const spoken = []; // [{ locale, text }]
  const texts = []; // [{ locale, text }] — outbound SMS/WhatsApp confirmations
  const bookings = []; // [{ callId, details }]
  const events = []; // full effect trace
  const queue = []; // TTS jobs awaiting synthesis
  const clips = []; // synthesised { locale, text, audio } clips

  // The best voice for a locale: an explicit per-locale mapping wins, otherwise
  // fall back to the single configured voice.
  const voiceFor = (locale) => voices[locale] || voiceId;

  return {
    perform(effect) {
      events.push(effect);
      if (effect.type === EFFECTS.SAY) {
        spoken.push({ locale: effect.locale, text: effect.text });
        // Defer the network call; record the job for flush().
        queue.push({ locale: effect.locale, text: effect.text });
      } else if (effect.type === EFFECTS.SEND_SMS) {
        texts.push({ locale: effect.locale, text: effect.text });
      } else if (effect.type === EFFECTS.BOOK_APPOINTMENT) {
        bookings.push({ callId: effect.callId, details: effect.details });
      }
      return effect;
    },

    // Everything Yael said, in order.
    transcript() {
      return spoken.slice();
    },
    // Outbound SMS/WhatsApp messages sent during the call.
    messages() {
      return texts.slice();
    },
    // Appointments booked against the calendar/PMS during the call.
    bookings() {
      return bookings.slice();
    },
    // The raw effect trace (SAY, LOG, ESCALATE_EMERGENCY, …).
    effects() {
      return events.slice();
    },

    // TTS jobs recorded by perform() that have not yet been synthesised.
    pendingSpeech() {
      return queue.slice();
    },
    // Audio clips produced so far by flush().
    audioClips() {
      return clips.slice();
    },

    // flush :: () -> Promise<[{ locale, text, audio }]>
    // Synthesise every queued SAY through ElevenLabs, in order. This is the only
    // method that performs network I/O; call it after folding a call's events.
    async flush() {
      const produced = [];
      while (queue.length) {
        const job = queue.shift();
        const audio = await synthesize({
          text: job.text,
          voiceId: voiceFor(job.locale),
          modelId,
          locale: job.locale,
          apiKey,
          fetchImpl,
          apiBase,
        });
        const clip = { locale: job.locale, text: job.text, audio };
        clips.push(clip);
        produced.push(clip);
      }
      return produced;
    },
  };
}

// defaultTranscribe :: (opts) -> Promise<{ text, languageCode }>
// The real STT call: send caller audio to ElevenLabs and get back a transcript
// plus the detected language.
async function defaultTranscribe({
  audio,
  modelId = DEFAULT_STT_MODEL,
  apiKey,
  fetchImpl = fetch,
  apiBase = ELEVENLABS_API_BASE,
}) {
  if (!apiKey) throw new Error("elevenLabsAsr: missing apiKey for STT");

  const form = new FormData();
  form.append("model_id", modelId);
  form.append("file", audio);

  const res = await fetchImpl(`${apiBase}/speech-to-text`, {
    method: "POST",
    headers: { "xi-api-key": apiKey },
    body: form,
  });
  if (!res.ok) {
    throw new Error(`ElevenLabs STT failed: ${res.status} ${res.statusText}`);
  }
  const data = await res.json();
  return { text: data.text || "", languageCode: data.language_code || null };
}

// createElevenLabsAsr :: (Options) -> Asr
// The live counterpart to `createMockAsr`. `listen(audio)` transcribes caller
// audio through ElevenLabs and produces the CALLER_UTTERANCE event the core
// consumes, carrying the detected locale when it is one we support.
export function createElevenLabsAsr(options = {}) {
  const {
    apiKey,
    modelId = DEFAULT_STT_MODEL,
    transcribe = defaultTranscribe,
    fetchImpl = fetch,
    apiBase = ELEVENLABS_API_BASE,
  } = options;

  return {
    async listen(audio) {
      const { text, languageCode } = await transcribe({
        audio,
        modelId,
        apiKey,
        fetchImpl,
        apiBase,
      });
      const detected = isSupportedLocale(languageCode) ? languageCode : null;
      return callerUtterance(text, detected);
    },
    // The locale we default to when ElevenLabs cannot detect a supported one.
    fallbackLocale() {
      return DEFAULT_LOCALE;
    },
  };
}
