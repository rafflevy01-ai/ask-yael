// FAQ / Knowledge Base skill.
//
// Answers common caller questions (hours, address, parking, pricing, insurance,
// what to bring) from a per-clinic knowledge base that lives in the vertical
// config pack (data, not code). Pure and deterministic: it maps
// (utterance, locale) -> a localised answer, or null when nothing matches so
// the dialog manager can fall back to a generic reply.
//
// Matching mirrors the intent/scheduling keyword approach so a new language or
// a new FAQ entry is a data change in the config, never a code change here.

// findFaqAnswer :: (string, locale, Config) -> string | null
// Returns the localised answer for the first knowledge-base entry whose
// per-locale keywords match the utterance, or null when none match.
export function findFaqAnswer(text, locale, config = {}) {
  const entry = matchFaqEntry(text, locale, config);
  if (!entry) return null;
  const answers = entry.answer || {};
  return answers[locale] || answers.en || null;
}

// matchFaqEntry :: (string, locale, Config) -> Entry | null
// The matched knowledge-base entry (exposed for logging/analytics), or null.
export function matchFaqEntry(text, locale, config = {}) {
  if (typeof text !== "string" || text.trim() === "") return null;
  const haystack = text.toLowerCase();
  const kb = config.knowledgeBase || [];

  for (const entry of kb) {
    const keywords = [
      ...((entry.keywords && entry.keywords[locale]) || []),
      ...((entry.keywords && entry.keywords.en) || []),
    ];
    if (keywords.some((kw) => kw && haystack.includes(String(kw).toLowerCase()))) {
      return entry;
    }
  }
  return null;
}
