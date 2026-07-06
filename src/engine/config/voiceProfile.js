// Voice profile — the single place that finalizes Yael's production voice.
//
// The ElevenLabs telephony/ASR adapter (see adapters/elevenLabsTelephony.js) is
// implemented and injectable, but "finalizing voice" is partly a set of human
// decisions and secrets that cannot live in code: an API key, the specific
// per-locale voice ids chosen after listening to candidates, the TTS/STT model,
// and sign-off on Hebrew quality. This module centralizes the *data* side of
// that decision and — crucially — makes explicit **what is still needed** so the
// gap between "adapter written" and "voice finalized" is validated, not guessed.
//
// `createVoiceProfile` builds a profile; `missingVoiceRequirements` /
// `assertVoiceProfileReady` report exactly which inputs are still outstanding.
// The adapter accepts a profile so the whole voice configuration is chosen once.

import { OFFERED_LOCALES } from "../domain/locales.js";
import { DEFAULT_TTS_MODEL, DEFAULT_STT_MODEL } from "../adapters/elevenLabsTelephony.js";

// The locales that MUST have a chosen voice before we can go live (HE/FR/EN —
// the languages Yael offers, see docs/SPEC.md Phase 1 "multilingual").
export const REQUIRED_VOICE_LOCALES = OFFERED_LOCALES;

// createVoiceProfile :: (Options) -> VoiceProfile
// Options:
//   - apiKey:   ElevenLabs API key (a secret — inject at runtime, never commit).
//   - voices:   { [locale]: voiceId } — the chosen native voice per language.
//   - fallbackVoiceId: voice used when a locale has no explicit mapping.
//   - ttsModel/sttModel: model ids (default to the multilingual + scribe models).
export function createVoiceProfile(options = {}) {
  const {
    apiKey = null,
    voices = {},
    fallbackVoiceId = null,
    ttsModel = DEFAULT_TTS_MODEL,
    sttModel = DEFAULT_STT_MODEL,
  } = options;

  return Object.freeze({
    apiKey,
    voices: Object.freeze({ ...voices }),
    fallbackVoiceId,
    ttsModel,
    sttModel,
  });
}

// createVoiceProfileFromEnv :: (env) -> VoiceProfile
// Build a voice profile from runtime environment variables, keeping the secret
// (the API key) and the human-chosen voice ids OUT of source control. This is
// the deployment-time counterpart to `createVoiceProfile`: production passes the
// process environment, tests pass a plain object. Recognised variables:
//   - ELEVENLABS_API_KEY        the ElevenLabs API key (runtime secret)
//   - ELEVENLABS_VOICE_HE/FR/EN the chosen native voice id per locale
//   - ELEVENLABS_VOICE_FALLBACK a single voice used when a locale is unset
//   - ELEVENLABS_TTS_MODEL      TTS model override (defaults to the multilingual model)
//   - ELEVENLABS_STT_MODEL      STT model override (defaults to the scribe model)
export function createVoiceProfileFromEnv(env = {}) {
  const source = env || {};
  const voices = {};
  for (const locale of REQUIRED_VOICE_LOCALES) {
    const value = source[`ELEVENLABS_VOICE_${locale.toUpperCase()}`];
    if (value) voices[locale] = value;
  }
  return createVoiceProfile({
    apiKey: source.ELEVENLABS_API_KEY || null,
    voices,
    fallbackVoiceId: source.ELEVENLABS_VOICE_FALLBACK || null,
    ttsModel: source.ELEVENLABS_TTS_MODEL || DEFAULT_TTS_MODEL,
    sttModel: source.ELEVENLABS_STT_MODEL || DEFAULT_STT_MODEL,
  });
}

// missingVoiceRequirements :: (VoiceProfile) -> [string]
// The concrete inputs still needed before the voice can be finalized, as
// human-readable items. An empty array means the profile is production-ready.
export function missingVoiceRequirements(profile = {}) {
  const missing = [];
  if (!profile.apiKey) {
    missing.push("apiKey — an ElevenLabs API key (provided at runtime as a secret)");
  }
  const voices = profile.voices || {};
  for (const locale of REQUIRED_VOICE_LOCALES) {
    if (!voices[locale] && !profile.fallbackVoiceId) {
      missing.push(`voices.${locale} — the chosen ElevenLabs voice id for "${locale}"`);
    }
  }
  return missing;
}

// isVoiceProfileReady :: (VoiceProfile) -> boolean
export function isVoiceProfileReady(profile) {
  return missingVoiceRequirements(profile).length === 0;
}

// assertVoiceProfileReady :: (VoiceProfile) -> VoiceProfile
// Throw a helpful, itemised error when the profile is not yet ready, otherwise
// return it unchanged. Call this at the deployment boundary (not in the pure
// core) so a half-configured voice fails fast with a clear checklist.
export function assertVoiceProfileReady(profile) {
  const missing = missingVoiceRequirements(profile);
  if (missing.length > 0) {
    throw new Error(
      "voiceProfile: voice is not finalized yet — still needed:\n  - " + missing.join("\n  - "),
    );
  }
  return profile;
}

// The finalization checklist that lives *outside* code — decisions and sign-offs
// a human must make before flipping voice to production. Surfaced here (and in
// docs/SPEC.md §5.1) so "what is needed" is explicit rather than tribal
// knowledge. These are intentionally NOT defaulted to placeholder values.
export const VOICE_FINALIZATION_CHECKLIST = Object.freeze([
  "ElevenLabs API key provisioned for the pilot account (runtime secret).",
  "A native-sounding voice id chosen per locale (he, fr, en) after auditioning candidates.",
  "TTS model confirmed for Hebrew/French/English (default: eleven_multilingual_v2).",
  "STT model confirmed (default: scribe_v1) and Hebrew transcription accuracy validated.",
  "Hebrew voice-quality + latency + cost spike signed off end-to-end.",
  "Telephony carrier + phone number for the pilot clinic (Twilio/Vonage) decided.",
]);
