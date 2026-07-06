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

  // Appointment catalogue: durations drive scheduling rules. Per-locale
  // `keywords` let the Scheduling skill recognise a requested type from free
  // speech ("I need a cleaning" / "un détartrage" / "ניקוי אבנית") — vertical
  // vocabulary lives in the config (data), not in the core.
  appointmentTypes: Object.freeze([
    Object.freeze({
      code: "checkup",
      label: "Check-up",
      minutes: 30,
      recallMonths: 6,
      keywords: Object.freeze({
        en: Object.freeze(["check-up", "checkup", "check up", "exam"]),
        fr: Object.freeze(["contrôle", "controle", "examen", "bilan"]),
        he: Object.freeze(["בדיקה", "בדיקת שיניים"]),
      }),
    }),
    Object.freeze({
      code: "cleaning",
      label: "Cleaning",
      minutes: 45,
      recallMonths: 6,
      keywords: Object.freeze({
        en: Object.freeze(["cleaning", "clean", "hygiene", "scale"]),
        fr: Object.freeze(["nettoyage", "détartrage", "detartrage", "hygiène"]),
        he: Object.freeze(["ניקוי", "ניקוי אבנית", "היגיינה"]),
      }),
    }),
    Object.freeze({
      code: "filling",
      label: "Filling",
      minutes: 45,
      keywords: Object.freeze({
        en: Object.freeze(["filling", "cavity"]),
        fr: Object.freeze(["plombage", "carie", "obturation"]),
        he: Object.freeze(["סתימה", "סתימות"]),
      }),
    }),
    Object.freeze({
      code: "root_canal",
      label: "Root canal",
      minutes: 90,
      keywords: Object.freeze({
        en: Object.freeze(["root canal", "root-canal"]),
        fr: Object.freeze(["traitement de canal", "canal radiculaire", "dévitalisation"]),
        he: Object.freeze(["טיפול שורש", "שורש"]),
      }),
    }),
    Object.freeze({
      code: "emergency",
      label: "Emergency toothache",
      minutes: 30,
      urgent: true,
      keywords: Object.freeze({
        en: Object.freeze(["toothache", "tooth ache", "emergency"]),
        fr: Object.freeze(["mal de dent", "rage de dent", "urgence"]),
        he: Object.freeze(["כאב שיניים", "כאב שן"]),
      }),
    }),
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
