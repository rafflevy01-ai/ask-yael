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

  // Per-clinic knowledge base for the FAQ skill (see skills/faq.js). Each entry
  // carries per-locale `keywords` (to recognise the question from free speech)
  // and a localised `answer`. Adding an FAQ or a language is a data change here.
  knowledgeBase: Object.freeze([
    Object.freeze({
      id: "hours",
      keywords: Object.freeze({
        en: Object.freeze(["hours", "open", "opening", "close", "closing"]),
        fr: Object.freeze(["horaires", "ouvert", "ouverture", "fermé", "fermeture"]),
        he: Object.freeze(["שעות", "פתוח", "פתיחה", "סגור", "סגירה"]),
      }),
      answer: Object.freeze({
        en: "We're open Sunday to Thursday, 8am to 6pm, and closed on Friday and Saturday.",
        fr: "Nous sommes ouverts du dimanche au jeudi, de 8h à 18h, et fermés le vendredi et le samedi.",
        he: "אנחנו פתוחים ראשון עד חמישי, מ-8:00 עד 18:00, וסגורים בשישי ושבת.",
      }),
    }),
    Object.freeze({
      id: "address",
      keywords: Object.freeze({
        en: Object.freeze(["where", "address", "located", "location", "directions"]),
        fr: Object.freeze(["où", "adresse", "situé", "emplacement", "itinéraire"]),
        he: Object.freeze(["איפה", "כתובת", "ממוקם", "מיקום", "הגעה"]),
      }),
      answer: Object.freeze({
        en: "We're at 12 Herzl Street, Tel Aviv, on the second floor.",
        fr: "Nous sommes au 12 rue Herzl, Tel Aviv, au deuxième étage.",
        he: "אנחנו ברחוב הרצל 12, תל אביב, בקומה השנייה.",
      }),
    }),
    Object.freeze({
      id: "parking",
      keywords: Object.freeze({
        en: Object.freeze(["parking", "park", "garage"]),
        fr: Object.freeze(["parking", "stationnement", "garer"]),
        he: Object.freeze(["חניה", "חנייה", "לחנות"]),
      }),
      answer: Object.freeze({
        en: "There's a paid parking garage next door, and free street parking after 7pm.",
        fr: "Il y a un parking payant à côté, et un stationnement gratuit dans la rue après 19h.",
        he: "יש חניון בתשלום ליד, וחניה חופשית ברחוב אחרי 19:00.",
      }),
    }),
    Object.freeze({
      id: "pricing",
      keywords: Object.freeze({
        en: Object.freeze(["how much", "price", "cost", "fee", "pay"]),
        fr: Object.freeze(["combien", "prix", "coût", "tarif", "payer"]),
        he: Object.freeze(["כמה עולה", "מחיר", "עלות", "תעריף", "לשלם"]),
      }),
      answer: Object.freeze({
        en: "A check-up and cleaning starts at 250 shekels; other treatments are quoted after the exam.",
        fr: "Un contrôle avec détartrage commence à 250 shekels ; les autres soins sont chiffrés après l'examen.",
        he: "בדיקה וניקוי אבנית מתחילים ב-250 שקלים; טיפולים אחרים מתומחרים לאחר הבדיקה.",
      }),
    }),
    Object.freeze({
      id: "insurance",
      keywords: Object.freeze({
        en: Object.freeze(["insurance", "health fund", "kupah", "clalit", "maccabi", "coverage"]),
        fr: Object.freeze(["assurance", "mutuelle", "caisse", "couverture"]),
        he: Object.freeze(["ביטוח", "קופת חולים", "כללית", "מכבי", "כיסוי"]),
      }),
      answer: Object.freeze({
        en: "We work with Clalit, Maccabi, Meuhedet and Leumit; bring your health-fund card to your visit.",
        fr: "Nous travaillons avec Clalit, Maccabi, Meuhedet et Leumit ; apportez votre carte de caisse maladie.",
        he: "אנחנו עובדים עם כללית, מכבי, מאוחדת ולאומית; הביאו את כרטיס קופת החולים לביקור.",
      }),
    }),
    Object.freeze({
      id: "what_to_bring",
      keywords: Object.freeze({
        en: Object.freeze(["what to bring", "bring", "documents", "id", "prepare"]),
        fr: Object.freeze(["quoi apporter", "apporter", "documents", "pièce", "préparer"]),
        he: Object.freeze(["מה להביא", "להביא", "מסמכים", "תעודה", "להתכונן"]),
      }),
      answer: Object.freeze({
        en: "Please bring a photo ID, your health-fund card, and a list of any medications you take.",
        fr: "Merci d'apporter une pièce d'identité, votre carte de caisse maladie et la liste de vos médicaments.",
        he: "אנא הביאו תעודה מזהה, כרטיס קופת חולים, ורשימה של תרופות שאתם נוטלים.",
      }),
    }),
  ]),
});
