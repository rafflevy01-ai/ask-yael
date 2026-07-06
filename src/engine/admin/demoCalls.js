// Seed data for the admin dashboard.
//
// The dashboard consumes real engine output, not hand-written JSON: each demo
// call is a scripted sequence of events folded through the pure core by
// `runCall` against the dental config, then aggregated with `buildCallRecord`.
// This keeps the sample data honest — it exercises the same booking / FAQ /
// emergency / handoff paths a live call would — and doubles as an integration
// smoke test of the whole pipeline.

import { runCall } from "../core/runCall.js";
import { createMockTelephony } from "../adapters/mockTelephony.js";
import { dentalConfig } from "../config/dental.js";
import { callStarted, callerUtterance, callEnded } from "../domain/events.js";
import { buildCallRecord } from "./callLog.js";

// A scripted call: an id, the caller's turns, and a coarse timestamp offset (in
// minutes ago) so the dashboard can show a plausible recent-activity ordering.
const SCRIPTS = Object.freeze([
  {
    id: "call-1001",
    minutesAgo: 8,
    turns: [callerUtterance("English", "en"), callerUtterance("I'd like to book a cleaning"), callerUtterance("Tuesday")],
  },
  {
    id: "call-1002",
    minutesAgo: 26,
    turns: [callerUtterance("Bonjour", "fr"), callerUtterance("Je voudrais un contrôle"), callerUtterance("jeudi")],
  },
  {
    id: "call-1003",
    minutesAgo: 52,
    turns: [callerUtterance("עברית", "he"), callerUtterance("מה השעות שלכם")],
  },
  {
    id: "call-1004",
    minutesAgo: 74,
    turns: [callerUtterance("English", "en"), callerUtterance("I need to reschedule my appointment"), callerUtterance("Dana"), callerUtterance("Monday"), callerUtterance("Wednesday")],
  },
  {
    id: "call-1005",
    minutesAgo: 96,
    turns: [callerUtterance("English", "en"), callerUtterance("My tooth got knocked out!")],
  },
  {
    id: "call-1006",
    minutesAgo: 120,
    turns: [callerUtterance("English", "en"), callerUtterance("I want to speak to a real person")],
  },
  {
    id: "call-1007",
    minutesAgo: 143,
    turns: [callerUtterance("Bonjour", "fr"), callerUtterance("Je veux annuler mon rendez-vous"), callerUtterance("Avi"), callerUtterance("vendredi")],
  },
]);

// runScript :: (Script) -> CallRecord
function runScript(script, now) {
  const telephony = createMockTelephony();
  const events = [callStarted(script.id), ...script.turns, callEnded()];
  const { state, effects } = runCall({ config: dentalConfig, telephony, events });
  const startedAt = new Date(now.getTime() - script.minutesAgo * 60 * 1000).toISOString();
  return buildCallRecord({ id: script.id, state, effects, startedAt, endedAt: startedAt });
}

// demoCallRecords :: (opts?) -> [CallRecord]
// Generates the seed call records, most-recent first. `now` is injectable so
// timestamps are deterministic in tests.
export function demoCallRecords({ now = new Date() } = {}) {
  return SCRIPTS.map((script) => runScript(script, now)).sort(
    (a, b) => new Date(b.startedAt) - new Date(a.startedAt),
  );
}
