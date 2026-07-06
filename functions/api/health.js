// GET /api/health — liveness + D1 connectivity probe for deploy checks.

import { json } from "../../worker/http.js";

export async function onRequestGet(context) {
  const { env } = context;
  let db = "unbound";
  if (env && env.DB) {
    try {
      await env.DB.prepare("SELECT 1").first();
      db = "ok";
    } catch (err) {
      db = `error: ${(err && err.message) || "unknown"}`;
    }
  }
  return json({ ok: db === "ok", db, time: new Date().toISOString() });
}
