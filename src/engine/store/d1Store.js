// D1 call store — pure (de)serialization between the engine's CallRecord and a
// flat SQLite row, plus the SQL the Cloudflare edge uses to persist them.
//
// The admin dashboard is designed to "swap the demo source for the real call
// store the telephony worker writes" (see src/pages/Admin.jsx). That store is a
// Cloudflare D1 (SQLite) database. Keeping the row<->record mapping *here*, in
// the pure engine, means it is framework-agnostic and unit-testable without a
// database — the Cloudflare Pages Function is then a thin I/O shell that binds
// these statements to `env.DB`. This mirrors the engine's effects-as-data
// philosophy: decide/shape data in the pure core, do I/O at the edge.

// The ordered column list for the `calls` table. A single source of truth so the
// migration, INSERT statement, and row mappers never drift apart.
export const CALL_COLUMNS = Object.freeze([
  "id",
  "locale",
  "intent",
  "phase",
  "outcome",
  "contained",
  "sms_sent",
  "escalated",
  "transferred",
  "callback",
  "started_at",
  "ended_at",
  "transcript",
  "appointments",
  "logs",
]);

// Parameterised INSERT (upsert) for one call record. `?` order matches
// `serializeCallRecord`. ON CONFLICT keeps ingestion idempotent — re-posting the
// same call id updates the row rather than erroring, so retries are safe.
export const INSERT_CALL_SQL = `INSERT INTO calls (${CALL_COLUMNS.join(", ")})
VALUES (${CALL_COLUMNS.map(() => "?").join(", ")})
ON CONFLICT(id) DO UPDATE SET
  locale = excluded.locale,
  intent = excluded.intent,
  phase = excluded.phase,
  outcome = excluded.outcome,
  contained = excluded.contained,
  sms_sent = excluded.sms_sent,
  escalated = excluded.escalated,
  transferred = excluded.transferred,
  callback = excluded.callback,
  started_at = excluded.started_at,
  ended_at = excluded.ended_at,
  transcript = excluded.transcript,
  appointments = excluded.appointments,
  logs = excluded.logs`;

// Newest-first listing used by the dashboard's call log.
export const SELECT_CALLS_SQL = `SELECT ${CALL_COLUMNS.join(", ")} FROM calls
ORDER BY (started_at IS NULL), started_at DESC, id DESC
LIMIT ?`;

const asFlag = (v) => (v ? 1 : 0);
const parseJson = (value, fallback) => {
  if (value == null) return fallback;
  if (typeof value !== "string") return value; // already parsed (e.g. tests)
  try {
    return JSON.parse(value);
  } catch {
    return fallback;
  }
};

// serializeCallRecord :: (CallRecord) -> [bindValues]
// Flatten a record into the ordered positional bind values for INSERT_CALL_SQL.
// Arrays/objects are JSON-encoded; booleans become 0/1 for SQLite.
export function serializeCallRecord(record = {}) {
  return [
    record.id || null,
    record.locale || null,
    record.intent || null,
    record.phase || null,
    record.outcome || null,
    asFlag(record.contained),
    Number.isFinite(record.smsSent) ? record.smsSent : 0,
    asFlag(record.escalated),
    asFlag(record.transferred),
    asFlag(record.callback),
    record.startedAt || null,
    record.endedAt || null,
    JSON.stringify(record.transcript || []),
    JSON.stringify(record.appointments || []),
    JSON.stringify(record.logs || []),
  ];
}

// deserializeCallRow :: (Row) -> CallRecord
// Rebuild a dashboard-shaped CallRecord from a D1 row. The inverse of
// `serializeCallRecord`, tolerant of already-parsed JSON so it round-trips in
// tests without a real database.
export function deserializeCallRow(row = {}) {
  return Object.freeze({
    id: row.id || null,
    locale: row.locale || null,
    intent: row.intent || null,
    phase: row.phase || null,
    outcome: row.outcome || null,
    contained: !!row.contained,
    smsSent: Number(row.sms_sent) || 0,
    escalated: !!row.escalated,
    transferred: !!row.transferred,
    callback: !!row.callback,
    transcript: parseJson(row.transcript, []),
    appointments: parseJson(row.appointments, []),
    logs: parseJson(row.logs, []),
    startedAt: row.started_at || null,
    endedAt: row.ended_at || null,
  });
}
