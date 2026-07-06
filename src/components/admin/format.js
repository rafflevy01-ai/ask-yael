// Shared presentation helpers for the admin dashboard.
//
// Small, dependency-light utilities so the tab components stay focused on
// layout. Nothing here touches the engine — it only formats already-aggregated
// call records for display.

export const LOCALE_LABELS = { en: "English", fr: "Français", he: "עברית" };

export const OUTCOME_META = {
  booked: { label: "Booked", variant: "default" },
  rescheduled: { label: "Rescheduled", variant: "secondary" },
  cancelled: { label: "Cancelled", variant: "secondary" },
  emergency: { label: "Emergency", variant: "destructive" },
  callback: { label: "Callback", variant: "outline" },
  handoff: { label: "Handoff", variant: "outline" },
  answered: { label: "Answered", variant: "secondary" },
  unresolved: { label: "Unresolved", variant: "outline" },
};

export function localeLabel(locale) {
  return LOCALE_LABELS[locale] || locale || "—";
}

export function outcomeLabel(outcome) {
  return (OUTCOME_META[outcome] && OUTCOME_META[outcome].label) || outcome;
}

export function outcomeVariant(outcome) {
  return (OUTCOME_META[outcome] && OUTCOME_META[outcome].variant) || "outline";
}

// A human "x minutes/hours ago" from an ISO timestamp, relative to `now`.
export function timeAgo(iso, now = new Date()) {
  if (!iso) return "—";
  const mins = Math.round((now.getTime() - new Date(iso).getTime()) / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins} min ago`;
  const hours = Math.round(mins / 60);
  if (hours < 24) return `${hours} hr ago`;
  const days = Math.round(hours / 24);
  return `${days} d ago`;
}

export function formatPercent(fraction) {
  return `${Math.round((fraction || 0) * 100)}%`;
}

// Capitalise a single word (day / type labels come through lower-cased).
export function titleCase(value) {
  if (!value) return "—";
  return String(value).charAt(0).toUpperCase() + String(value).slice(1);
}
