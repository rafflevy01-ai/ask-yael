// Dashboard data source.
//
// The admin dashboard is designed to "swap the demo source for the real call
// store the telephony worker writes" (see src/pages/Admin.jsx). In a Cloudflare
// deployment that store is D1, exposed through the Pages Functions API. This
// module fetches the real records and DEGRADES GRACEFULLY to the engine's demo
// records when the API is unavailable (e.g. local `npm run dev`, or before the
// first live call). Either way the dashboard components receive the same
// CallRecord shape, so nothing downstream changes.

import { demoCallRecords } from "@/engine";

// fetchCallRecords :: ({ signal?, limit? }) -> Promise<{ records, source }>
// `source` is "api" when the live store answered, or "demo" on fallback — handy
// for surfacing a small "demo data" hint in the UI.
export async function fetchCallRecords({ signal, limit = 200 } = {}) {
  try {
    const res = await fetch(`/api/calls?limit=${encodeURIComponent(limit)}`, {
      signal,
      headers: { Accept: "application/json" },
    });
    if (!res.ok) throw new Error(`/api/calls responded ${res.status}`);
    const data = await res.json();
    const records = Array.isArray(data.records) ? data.records : [];
    // An empty live store still means "live" — but there is nothing to show yet,
    // so fall back to demo data to keep the dashboard illustrative.
    if (records.length === 0) return { records: demoCallRecords(), source: "demo" };
    return { records, source: "api" };
  } catch {
    return { records: demoCallRecords(), source: "demo" };
  }
}
