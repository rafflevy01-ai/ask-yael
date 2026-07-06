-- Ask-Yael call store — Cloudflare D1 (SQLite) schema.
--
-- This is the "real call store the telephony worker writes" that the admin
-- dashboard reads from (replacing the demo seed). One row per handled call; the
-- transcript, appointments, and log entries are kept as JSON so the Pages
-- Function can round-trip the engine's CallRecord verbatim (see
-- src/engine/store/d1Store.js — the column list is the single source of truth
-- and MUST stay in sync with CALL_COLUMNS).

CREATE TABLE IF NOT EXISTS calls (
  id           TEXT PRIMARY KEY,          -- engine call id (e.g. "call-1001")
  locale       TEXT,                      -- he | fr | en | null
  intent       TEXT,                      -- detected intent
  phase        TEXT,                      -- final dialog phase
  outcome      TEXT,                      -- booked | emergency | handoff | ...
  contained    INTEGER NOT NULL DEFAULT 0,-- 1 = resolved without human handoff
  sms_sent     INTEGER NOT NULL DEFAULT 0,
  escalated    INTEGER NOT NULL DEFAULT 0,
  transferred  INTEGER NOT NULL DEFAULT 0,
  callback     INTEGER NOT NULL DEFAULT 0,
  started_at   TEXT,                      -- ISO 8601
  ended_at     TEXT,                      -- ISO 8601
  transcript   TEXT NOT NULL DEFAULT '[]',-- JSON: [{ locale, text }]
  appointments TEXT NOT NULL DEFAULT '[]',-- JSON: [{ type, callId, details }]
  logs         TEXT NOT NULL DEFAULT '[]',-- JSON: [string]
  created_at   TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now'))
);

-- The dashboard lists calls most-recent first.
CREATE INDEX IF NOT EXISTS idx_calls_started_at ON calls (started_at DESC);

-- Frequently filtered facets on the Overview tab.
CREATE INDEX IF NOT EXISTS idx_calls_outcome ON calls (outcome);
CREATE INDEX IF NOT EXISTS idx_calls_locale ON calls (locale);
