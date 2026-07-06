// Global middleware for every /functions route: handle CORS preflight and turn
// thrown errors into clean JSON responses (with the status an error carries).
// CORS is applied centrally here so individual handlers stay CORS-agnostic.

import { corsHeaders, json } from "../worker/http.js";

export async function onRequest(context) {
  const cors = corsHeaders(context.env, context.request);

  if (context.request.method === "OPTIONS") {
    return new Response(null, { status: 204, headers: cors });
  }

  let response;
  try {
    response = await context.next();
  } catch (err) {
    const status = err && err.status ? err.status : 500;
    response = json({ error: (err && err.message) || "Internal error" }, status);
  }

  // Append CORS headers to whatever the route (or static asset) returned.
  const headers = new Headers(response.headers);
  for (const [k, v] of Object.entries(cors)) headers.set(k, v);
  return new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers,
  });
}
