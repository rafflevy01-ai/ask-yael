// Dental vertical config pack (Phase 1 prototype).
//
// This is DATA, not code. It parameterises the same generic conversation core
// for a dental clinic: the appointment catalogue, the bookable resource (the
// chair / operatory), dental-specific emergency red-flags, and the new-patient
// intake schema. Physical-therapy and future professions ship as sibling packs
// (see docs/SPEC.md, Phases 2–3) without changing the core.

export const dentalConfig = Object.freeze({
  id: "dental",
  displayName: "Dental clinic",

  // Bookable resource type — a dental chair / operatory.
  resource: Object.freeze({ type: "chair", label: "Operatory" }),

  // Appointment catalogue: durations drive scheduling rules.
  appointmentTypes: Object.freeze([
    Object.freeze({ code: "checkup", label: "Check-up", minutes: 30, recallMonths: 6 }),
    Object.freeze({ code: "cleaning", label: "Cleaning", minutes: 45, recallMonths: 6 }),
    Object.freeze({ code: "filling", label: "Filling", minutes: 45 }),
    Object.freeze({ code: "root_canal", label: "Root canal", minutes: 90 }),
    Object.freeze({ code: "emergency", label: "Emergency toothache", minutes: 30, urgent: true }),
  ]),

  // Extra emergency triggers merged into the baseline triage set. Dental red
  // flags are time-critical (a knocked-out tooth has a short viability window).
  emergencyTriggers: Object.freeze([
    "knocked out",
    "knocked-out tooth",
    "broken tooth",
    "tooth fell out",
    "face swelling",
    "dent cassée", // FR: broken tooth
    "dent tombée", // FR: tooth fell out
    "שן נשברה", // HE: broken tooth
    "שן נפלה", // HE: tooth fell out
  ]),

  // New-patient intake schema (localised labels live in the UI/phrase book).
  intakeSchema: Object.freeze([
    Object.freeze({ field: "fullName", required: true }),
    Object.freeze({ field: "nationalId", required: true }), // Teudat Zehut in IL
    Object.freeze({ field: "dateOfBirth", required: true }),
    Object.freeze({ field: "phone", required: true }),
    Object.freeze({ field: "healthFund", required: false }), // Clalit/Maccabi/…
  ]),
});
