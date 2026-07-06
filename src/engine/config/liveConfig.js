// Live production wiring — the seam between "adapters written" and "edges wired
// to real providers" (docs/SPEC.md §5.1 / §5.2, Phase-1 immediate focus).
//
// The individual live adapters (elevenLabsTelephony, dentalPms, googleCalendar)
// are implemented and unit-tested against injected fakes. What was still missing
// was a single place that assembles them from *runtime configuration* — the
// ElevenLabs voice secret + per-locale voices, and the dental-PMS credentials —
// gates on voice being finalized, and reports exactly which inputs are still
// outstanding. That is what this module provides.
//
// Nothing here performs network I/O: `createLiveReceptionist` only *wires* the
// adapters (the deferred `flush()` on each adapter is where real calls happen),
// so the whole thing stays deterministically testable without a phone, an API
// key, or a clinic PMS. Secrets are read from the environment, never committed.

import { dentalConfig } from "./dental.js";
import {
  createVoiceProfileFromEnv,
  missingVoiceRequirements,
  VOICE_FINALIZATION_CHECKLIST,
} from "./voiceProfile.js";
import {
  createElevenLabsTelephony,
  createElevenLabsAsr,
} from "../adapters/elevenLabsTelephony.js";
import { createDentalPms, createDentalPmsClient } from "../adapters/dentalPms.js";

// The environment variables that configure the dental PMS booking backend and
// the pilot telephony carrier (the Twilio/Vonage decision + pilot number).
//   - DENTAL_PMS_BASE_URL       base URL of the clinic's PMS booking API
//   - DENTAL_PMS_API_KEY        the clinic's PMS API token (runtime secret)
//   - DENTAL_PMS_PROVIDER_ID    the dentist/provider to book against
//   - DENTAL_PMS_OPERATORY_ID   the chair/operatory resource id
//   - TELEPHONY_CARRIER         the chosen carrier (e.g. "twilio" | "vonage")
//   - TELEPHONY_PHONE_NUMBER    the pilot clinic's phone number

// missingPmsConfig :: (env) -> [string]
function missingPmsConfig(env) {
  const missing = [];
  if (!env.DENTAL_PMS_BASE_URL) {
    missing.push("DENTAL_PMS_BASE_URL — base URL of the dental PMS booking API");
  }
  if (!env.DENTAL_PMS_API_KEY) {
    missing.push("DENTAL_PMS_API_KEY — the clinic PMS API token (runtime secret)");
  }
  return missing;
}

// missingTelephonyConfig :: (env) -> [string]
function missingTelephonyConfig(env) {
  const missing = [];
  if (!env.TELEPHONY_CARRIER) {
    missing.push("TELEPHONY_CARRIER — the chosen telephony carrier (twilio | vonage)");
  }
  if (!env.TELEPHONY_PHONE_NUMBER) {
    missing.push("TELEPHONY_PHONE_NUMBER — the pilot clinic phone number");
  }
  return missing;
}

// missingLiveConfig :: (env) -> [string]
// Every runtime input still needed before Yael can take a real call, across all
// three edges (voice, PMS, telephony). An empty array means fully configured.
export function missingLiveConfig(env = {}) {
  const source = env || {};
  const voiceProfile = createVoiceProfileFromEnv(source);
  return [
    ...missingVoiceRequirements(voiceProfile),
    ...missingPmsConfig(source),
    ...missingTelephonyConfig(source),
  ];
}

// describeLiveReadiness :: (env) -> Readiness
// A structured, human-friendly report of what is configured and what is still
// outstanding — grouped by edge — plus the human sign-off checklist. Surface
// this in a deploy preflight so going live is a checklist, not a guess.
export function describeLiveReadiness(env = {}) {
  const source = env || {};
  const voiceProfile = createVoiceProfileFromEnv(source);
  const voice = missingVoiceRequirements(voiceProfile);
  const pms = missingPmsConfig(source);
  const telephony = missingTelephonyConfig(source);
  const missing = [...voice, ...pms, ...telephony];
  return {
    ready: missing.length === 0,
    missing,
    voice,
    pms,
    telephony,
    checklist: VOICE_FINALIZATION_CHECKLIST,
  };
}

// assertLiveConfigReady :: (env) -> env
// Fail fast at the deployment boundary with an itemised checklist when any live
// input is still missing. Kept out of the pure core.
export function assertLiveConfigReady(env = {}) {
  const missing = missingLiveConfig(env);
  if (missing.length > 0) {
    throw new Error(
      "liveConfig: not ready to take live calls — still needed:\n  - " +
        missing.join("\n  - "),
    );
  }
  return env;
}

// createLiveReceptionist :: (Options) -> Receptionist
// Assemble the full live edge set from runtime configuration:
//   - a finalized ElevenLabs voice profile (from env secrets),
//   - the live ElevenLabs telephony (TTS) + ASR (STT) adapters,
//   - the dedicated dental PMS calendar adapter backed by its real REST client.
// The result drops straight into `runCall` ({ config, telephony, calendar })
// and exposes `asr` for the media gateway to transcribe caller audio. Returns
// { config, voiceProfile, telephony, asr, calendar, carrier, phoneNumber }.
//
// Options:
//   - env:       the environment (defaults to an empty object; pass process.env
//                or an object of the variables documented above).
//   - config:    the vertical config pack (defaults to dentalConfig).
//   - fetchImpl: injectable fetch, threaded into every live client (defaults to
//                global fetch), so tests never touch the network.
//   - resolveSlot: optional PMS slot resolver bound to real chair availability.
export function createLiveReceptionist(options = {}) {
  const {
    env = {},
    config = dentalConfig,
    fetchImpl = typeof fetch !== "undefined" ? fetch : undefined,
    resolveSlot,
  } = options;

  // Gate: refuse to wire a half-configured pipeline; fail fast with a checklist.
  assertLiveConfigReady(env);

  const voiceProfile = createVoiceProfileFromEnv(env);

  const telephony = createElevenLabsTelephony({ voiceProfile, fetchImpl });
  const asr = createElevenLabsAsr({ voiceProfile, fetchImpl });

  const client = createDentalPmsClient({
    baseUrl: env.DENTAL_PMS_BASE_URL,
    apiKey: env.DENTAL_PMS_API_KEY,
    fetchImpl,
  });
  const calendar = createDentalPms({
    client,
    providerId: env.DENTAL_PMS_PROVIDER_ID || null,
    operatoryId: env.DENTAL_PMS_OPERATORY_ID || null,
    ...(resolveSlot ? { resolveSlot } : {}),
  });

  return {
    config,
    voiceProfile,
    telephony,
    asr,
    calendar,
    carrier: env.TELEPHONY_CARRIER || null,
    phoneNumber: env.TELEPHONY_PHONE_NUMBER || null,
  };
}
