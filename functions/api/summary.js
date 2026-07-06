// GET /api/summary — the Overview analytics, computed by the engine's pure
// `summarize` over whatever the store currently holds.

import { json, requireDb } from "../../worker/http.js";
import { listCalls } from "../../worker/db.js";
import { summarize } from "../../src/engine/admin/callLog.js";

export async function onRequestGet(context) {
  const db = requireDb(context.env);
  const records = await listCalls(db);
  return json({ summary: summarize(records) });
}
