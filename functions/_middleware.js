// Global middleware for every /functions route: handle CORS preflight and turn
// thrown errors into clean JSON responses (with the status an error carries).

import { CORS_HEADERS, json } from "../worker/http.js";

export async function onRequest(context) {
  if (context.request.method === "OPTIONS") {
    return new Response(null, { status: 204, headers: CORS_HEADERS });
  }
  try {
    return await context.next();
  } catch (err) {
    const status = err && err.status ? err.status : 500;
    return json({ error: (err && err.message) || "Internal error" }, status);
  }
}
