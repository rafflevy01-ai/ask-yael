// FAQ knowledge-base generator.
//
// The FAQ/knowledge-base skill (see skills/faq.js) answers callers from a list
// of entries carrying per-locale `keywords` + `answer`. Historically those
// entries were hand-written prose duplicated across three languages, so keeping
// them correct meant editing the same fact in many places.
//
// This module makes the knowledge base *generated from a single source of
// truth*: a structured `clinicProfile` holds the clinic's facts once (opening
// hours, address, price list, the health funds it works with, required
// documents, …) and `buildKnowledgeBase(profile)` renders the localised FAQ
// entries from them. Update the profile — add a health fund, change the base
// price, move to a new address — and every language's answer updates with it,
// with no prose to keep in sync by hand.
//
// The matching `keywords` per topic are stable recognition vocabulary and live
// here with the templates; only the *values* come from the profile.

// joinList :: ([string], string) -> string
// Grammatically join a list: "a, b and c" (the final separator is localised, so
// English uses " and ", French " et ", Hebrew " ו").
function joinList(items, lastSep) {
  if (!items || items.length === 0) return "";
  if (items.length === 1) return items[0];
  return items.slice(0, -1).join(", ") + lastSep + items[items.length - 1];
}

// The FAQ topics. Each descriptor is stable recognition vocabulary plus a pure
// `answer(profile) -> { en, fr, he }` renderer that reads the source of truth.
const TOPICS = Object.freeze([
  {
    id: "hours",
    keywords: {
      en: ["hours", "open", "opening", "close", "closing"],
      fr: ["horaires", "ouvert", "ouverture", "fermé", "fermeture"],
      he: ["שעות", "פתוח", "פתיחה", "סגור", "סגירה"],
    },
    answer: ({ hours }) => ({
      en: `We're open ${hours.openDay.en} to ${hours.closeDay.en}, ${hours.openTime.en} to ${hours.closeTime.en}, and closed on ${hours.closedDays.en}.`,
      fr: `Nous sommes ouverts du ${hours.openDay.fr} au ${hours.closeDay.fr}, de ${hours.openTime.fr} à ${hours.closeTime.fr}, et fermés le ${hours.closedDays.fr}.`,
      he: `אנחנו פתוחים ${hours.openDay.he} עד ${hours.closeDay.he}, מ-${hours.openTime.he} עד ${hours.closeTime.he}, וסגורים ${hours.closedDays.he}.`,
    }),
  },
  {
    id: "address",
    keywords: {
      en: ["where", "address", "located", "location", "directions"],
      fr: ["où", "adresse", "situé", "emplacement", "itinéraire"],
      he: ["איפה", "כתובת", "ממוקם", "מיקום", "הגעה"],
    },
    answer: ({ address }) => ({
      en: `We're at ${address.street.en}, ${address.city.en}, on the ${address.floor.en}.`,
      fr: `Nous sommes au ${address.street.fr}, ${address.city.fr}, au ${address.floor.fr}.`,
      he: `אנחנו ב${address.street.he}, ${address.city.he}, ב${address.floor.he}.`,
    }),
  },
  {
    id: "parking",
    keywords: {
      en: ["parking", "park", "garage"],
      fr: ["parking", "stationnement", "garer"],
      he: ["חניה", "חנייה", "לחנות"],
    },
    // Parking guidance is free prose per clinic, so the profile carries the
    // full localised sentence for this topic.
    answer: ({ parking }) => ({ en: parking.en, fr: parking.fr, he: parking.he }),
  },
  {
    id: "pricing",
    keywords: {
      en: ["how much", "price", "cost", "fee", "pay"],
      fr: ["combien", "prix", "coût", "tarif", "payer"],
      he: ["כמה עולה", "מחיר", "עלות", "תעריף", "לשלם"],
    },
    answer: ({ pricing }) => ({
      en: `${pricing.service.en} starts at ${pricing.basePrice} ${pricing.currency.en}; other treatments are quoted after the exam.`,
      fr: `${pricing.service.fr} commence à ${pricing.basePrice} ${pricing.currency.fr} ; les autres soins sont chiffrés après l'examen.`,
      he: `${pricing.service.he} מתחילים ב-${pricing.basePrice} ${pricing.currency.he}; טיפולים אחרים מתומחרים לאחר הבדיקה.`,
    }),
  },
  {
    id: "insurance",
    keywords: {
      en: ["insurance", "health fund", "kupah", "clalit", "maccabi", "coverage"],
      fr: ["assurance", "mutuelle", "caisse", "couverture"],
      he: ["ביטוח", "קופת חולים", "כללית", "מכבי", "כיסוי"],
    },
    // The list of accepted health funds is the source of truth; each locale's
    // sentence is generated from it, so adding a fund updates all languages.
    answer: ({ healthFunds }) => ({
      en: `We work with ${joinList(healthFunds.map((f) => f.en), " and ")}; bring your health-fund card to your visit.`,
      fr: `Nous travaillons avec ${joinList(healthFunds.map((f) => f.fr), " et ")} ; apportez votre carte de caisse maladie.`,
      he: `אנחנו עובדים עם ${joinList(healthFunds.map((f) => f.he), " ו")}; הביאו את כרטיס קופת החולים לביקור.`,
    }),
  },
  {
    id: "what_to_bring",
    keywords: {
      en: ["what to bring", "bring", "documents", "id", "prepare"],
      fr: ["quoi apporter", "apporter", "documents", "pièce", "préparer"],
      he: ["מה להביא", "להביא", "מסמכים", "תעודה", "להתכונן"],
    },
    // The documents a caller should bring are the source of truth; each locale's
    // sentence is generated from the list.
    answer: ({ documents }) => ({
      en: `Please bring ${joinList(documents.map((d) => d.en), ", and ")}.`,
      fr: `Merci d'apporter ${joinList(documents.map((d) => d.fr), " et ")}.`,
      he: `אנא הביאו ${joinList(documents.map((d) => d.he), ", ו")}.`,
    }),
  },
]);

// buildKnowledgeBase :: (ClinicProfile) -> [Entry]
// Render the localised FAQ entries from the clinic's source-of-truth profile.
// The result is the exact `knowledgeBase` shape the FAQ skill consumes, and it
// is deep-frozen so callers cannot mutate the generated data.
export function buildKnowledgeBase(profile = {}) {
  return Object.freeze(
    TOPICS.map((topic) =>
      Object.freeze({
        id: topic.id,
        keywords: Object.freeze({
          en: Object.freeze([...topic.keywords.en]),
          fr: Object.freeze([...topic.keywords.fr]),
          he: Object.freeze([...topic.keywords.he]),
        }),
        answer: Object.freeze(topic.answer(profile)),
      }),
    ),
  );
}

// The FAQ topic ids this generator knows how to render, exposed for tests and
// tooling that want to assert coverage without depending on the array order.
export const FAQ_TOPIC_IDS = Object.freeze(TOPICS.map((t) => t.id));
