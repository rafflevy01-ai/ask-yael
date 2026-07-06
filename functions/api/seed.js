// POST /api/seed — populate the store with the engine's demo call records.
//
// Convenience for a fresh deployment / demo environment. Guarded: it only runs
// when the store is empty, OR when the request carries the `x-seed-token` header
// matching the `SEED_TOKEN` secret. This prevents a public endpoint from
// clobbering a real clinic's data. Returns how many records were written.

import { json, error, requireDb } from "../../worker/http.js";
import { listCalls, insertCalls } from "../../worker/db.js";
import { demoCallRecords } from "../../src/engine/admin/demoCalls.js";

export async function onRequestPost(context) {
  const db = requireDb(context.env);
  const token = context.env && context.env.SEED_TOKEN;
  const provided = context.request.headers.get("x-seed-token");

  const existing = await listCalls(db, 1);
  const authorized = token ? provided === token : existing.length === 0;
  if (!authorized) {
    return error("seeding is only allowed on an empty store or with a valid x-seed-token", 403);
  }

  const records = demoCallRecords();
  const stored = await insertCalls(db, records);
  return json({ seeded: stored }, 201);
}
