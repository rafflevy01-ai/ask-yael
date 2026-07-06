// Small HTTP helpers shared by the Pages Functions. Kept out of /functions so
// it is never mistaken for a route (only files exporting onRequest* under
// /functions become endpoints).

export const CORS_HEADERS = Object.freeze({
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, x-seed-token",
  "Access-Control-Max-Age": "86400",
});

// corsHeaders :: (env, request) -> object
// Secure by default: no wildcard. The dashboard is served from the SAME origin
// as the API (both on the Pages project), so no `Access-Control-Allow-Origin`
// header is needed for it. Cross-origin access is opt-in via the
// `CORS_ALLOW_ORIGIN` var — a comma-separated allowlist, or the literal "*" to
// allow any origin. The request's Origin is echoed back only when allowlisted.
export function corsHeaders(env, request) {
  const raw = (env && env.CORS_ALLOW_ORIGIN) || "";
  const allow = raw.split(",").map((s) => s.trim()).filter(Boolean);
  if (allow.includes("*")) {
    return { ...CORS_HEADERS, "Access-Control-Allow-Origin": "*" };
  }
  const origin = request && request.headers.get("Origin");
  if (origin && allow.includes(origin)) {
    return { ...CORS_HEADERS, "Access-Control-Allow-Origin": origin, Vary: "Origin" };
  }
  // Same-origin (or disallowed cross-origin): emit no ACAO header.
  return { ...CORS_HEADERS };
}

// json :: (data, status?, extraHeaders?) -> Response
// CORS is applied centrally by the middleware, not here.
export function json(data, status = 200, extraHeaders = {}) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "Cache-Control": "no-store",
      ...extraHeaders,
    },
  });
}

// error :: (message, status?) -> Response
export function error(message, status = 400) {
  return json({ error: message }, status);
}

// requireDb :: (env) -> D1Database  (throws a 500-mapped error when unbound)
export function requireDb(env) {
  if (!env || !env.DB) {
    const err = new Error("D1 binding `DB` is not configured");
    err.status = 500;
    throw err;
  }
  return env.DB;
}

// isValidCallRecord :: (any) -> boolean
// Minimal shape guard for ingested records: an id plus the JSON-ish fields we
// persist. Keeps malformed payloads out of the store.
export function isValidCallRecord(record) {
  if (!record || typeof record !== "object") return false;
  if (typeof record.id !== "string" || record.id.length === 0) return false;
  if (record.transcript != null && !Array.isArray(record.transcript)) return false;
  if (record.appointments != null && !Array.isArray(record.appointments)) return false;
  if (record.logs != null && !Array.isArray(record.logs)) return false;
  return true;
}
