// Thin D1 access layer for the Cloudflare Pages Functions.
//
// This is the only place that touches the D1 binding (`env.DB`). It reuses the
// engine's PURE store (src/engine/store/d1Store.js) for all row<->record shaping,
// so this file stays a small, boring I/O shell — exactly the effects-at-the-edge
// split the rest of the codebase follows. Everything interesting (and tested)
// lives in the engine; here we only bind statements and run them.

import {
  INSERT_CALL_SQL,
  SELECT_CALLS_SQL,
  serializeCallRecord,
  deserializeCallRow,
} from "../src/engine/store/d1Store.js";

export const DEFAULT_LIST_LIMIT = 200;

// listCalls :: (D1Database, number) -> Promise<[CallRecord]>
// Newest-first call records for the dashboard.
export async function listCalls(db, limit = DEFAULT_LIST_LIMIT) {
  const bounded = Math.min(Math.max(Number(limit) || DEFAULT_LIST_LIMIT, 1), 1000);
  const { results } = await db.prepare(SELECT_CALLS_SQL).bind(bounded).all();
  return (results || []).map(deserializeCallRow);
}

// insertCall :: (D1Database, CallRecord) -> Promise<void>
// Idempotent upsert of a single call record (safe to retry).
export async function insertCall(db, record) {
  await db.prepare(INSERT_CALL_SQL).bind(...serializeCallRecord(record)).run();
}

// insertCalls :: (D1Database, [CallRecord]) -> Promise<number>
// Batch upsert used by the seed endpoint. Uses D1's `batch` for a single
// round-trip when available, falling back to sequential inserts.
export async function insertCalls(db, records = []) {
  if (records.length === 0) return 0;
  const stmt = db.prepare(INSERT_CALL_SQL);
  const bound = records.map((r) => stmt.bind(...serializeCallRecord(r)));
  if (typeof db.batch === "function") {
    await db.batch(bound);
  } else {
    for (const b of bound) await b.run();
  }
  return records.length;
}
