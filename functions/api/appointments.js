// GET /api/appointments — upcoming booked/rescheduled appointments for the
// Calendar tab, flattened by the engine's pure `upcomingAppointments`.

import { json, requireDb } from "../../worker/http.js";
import { listCalls } from "../../worker/db.js";
import { upcomingAppointments } from "../../src/engine/admin/callLog.js";

export async function onRequestGet(context) {
  const db = requireDb(context.env);
  const records = await listCalls(db);
  const appointments = upcomingAppointments(records);
  return json({ appointments, count: appointments.length });
}
