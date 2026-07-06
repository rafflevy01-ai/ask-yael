// Dental vertical config pack (Phase 1 prototype).
//
// This is DATA, not code. It parameterises the same generic conversation core
// for a dental clinic: the appointment catalogue, the bookable resource (the
// chair / operatory), dental-specific emergency red-flags, and the new-patient
// intake schema. Physical-therapy and future professions ship as sibling packs
// (see docs/SPEC.md, Phases 2–3) without changing the core.

import { buildKnowledgeBase } from "./knowledgeBase.js";

// The clinic profile is the single source of truth for the FAQ knowledge base.
// Every clinic fact (hours, address, prices, accepted health funds, required
// documents) lives here once; `buildKnowledgeBase` renders the localised FAQ
// entries from it, so editing a fact — a new health fund, a price change, a new
// address — updates every language's answer with no prose to keep in sync.
export const dentalClinicProfile = Object.freeze({
  hours: Object.freeze({
    openDay: Object.freeze({ en: "Sunday", fr: "dimanche", he: "ראשון" }),
    closeDay: Object.freeze({ en: "Thursday", fr: "jeudi", he: "חמישי" }),
    openTime: Object.freeze({ en: "8am", fr: "8h", he: "8:00" }),
    closeTime: Object.freeze({ en: "6pm", fr: "18h", he: "18:00" }),
    closedDays: Object.freeze({
      en: "Friday and Saturday",
      fr: "vendredi et le samedi",
      he: "בשישי ושבת",
    }),
  }),
  address: Object.freeze({
    street: Object.freeze({ en: "12 Herzl Street", fr: "12 rue Herzl", he: "רחוב הרצל 12" }),
    city: Object.freeze({ en: "Tel Aviv", fr: "Tel Aviv", he: "תל אביב" }),
    floor: Object.freeze({ en: "second floor", fr: "deuxième étage", he: "קומה השנייה" }),
  }),
  parking: Object.freeze({
    en: "There's a paid parking garage next door, and free street parking after 7pm.",
    fr: "Il y a un parking payant à côté, et un stationnement gratuit dans la rue après 19h.",
    he: "יש חניון בתשלום ליד, וחניה חופשית ברחוב אחרי 19:00.",
  }),
  pricing: Object.freeze({
    basePrice: 250,
    currency: Object.freeze({ en: "shekels", fr: "shekels", he: "שקלים" }),
    service: Object.freeze({
      en: "A check-up and cleaning",
      fr: "Un contrôle avec détartrage",
      he: "בדיקה וניקוי אבנית",
    }),
  }),
  // The health funds the clinic works with — the source of truth for the
  // insurance FAQ answer in every language.
  healthFunds: Object.freeze([
    Object.freeze({ en: "Clalit", fr: "Clalit", he: "כללית" }),
    Object.freeze({ en: "Maccabi", fr: "Maccabi", he: "מכבי" }),
    Object.freeze({ en: "Meuhedet", fr: "Meuhedet", he: "מאוחדת" }),
    Object.freeze({ en: "Leumit", fr: "Leumit", he: "לאומית" }),
  ]),
  // What a caller should bring to their visit — the source of truth for the
  // "what to bring" FAQ answer in every language.
  documents: Object.freeze([
    Object.freeze({
      en: "a photo ID",
      fr: "une pièce d'identité",
      he: "תעודה מזהה",
    }),
    Object.freeze({
      en: "your health-fund card",
      fr: "votre carte de caisse maladie",
      he: "כרטיס קופת חולים",
    }),
    Object.freeze({
      en: "a list of any medications you take",
      fr: "la liste de vos médicaments",
      he: "רשימה של תרופות שאתם נוטלים",
    }),
  ]),
});

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

  // Per-clinic knowledge base for the FAQ skill (see skills/faq.js). Generated
  // from `dentalClinicProfile` above (the single source of truth) by
  // `buildKnowledgeBase`, so adding an FAQ fact or a language is a data change
  // in the profile, not hand-edited prose. Each entry carries per-locale
  // `keywords` (to recognise the question) and a localised `answer`.
  knowledgeBase: buildKnowledgeBase(dentalClinicProfile),
});
