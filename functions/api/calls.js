// /api/calls
//   GET  — newest-first call records for the admin dashboard (?limit=N).
//   POST — ingest one call record (or an array), upserted idempotently. This is
//          the endpoint the telephony worker calls after folding each live call.

import { json, error, requireDb, isValidCallRecord } from "../../worker/http.js";
import { listCalls, insertCall, insertCalls } from "../../worker/db.js";

export async function onRequestGet(context) {
  const db = requireDb(context.env);
  const url = new URL(context.request.url);
  const limit = url.searchParams.get("limit");
  const records = await listCalls(db, limit);
  return json({ records, count: records.length });
}

export async function onRequestPost(context) {
  const db = requireDb(context.env);

  let payload;
  try {
    payload = await context.request.json();
  } catch {
    return error("invalid JSON body", 400);
  }

  const records = Array.isArray(payload) ? payload : [payload];
  const invalid = records.filter((r) => !isValidCallRecord(r));
  if (invalid.length > 0) {
    return error("each record needs a string `id` and array transcript/appointments/logs", 422);
  }

  if (records.length === 1) {
    await insertCall(db, records[0]);
  } else {
    await insertCalls(db, records);
  }
  return json({ stored: records.length }, 201);
}
