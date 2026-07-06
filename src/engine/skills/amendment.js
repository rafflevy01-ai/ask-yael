// Amendment skill — reschedule and cancel an existing appointment.
//
// Like the Scheduling skill this is a pure, deterministic multi-turn slot
// filler. It performs NO I/O: it only folds (amendment, utterance) -> next
// amendment, and the edge runs the resulting RESCHEDULE_APPOINTMENT /
// CANCEL_APPOINTMENT + SEND_SMS effects.
//
// Both flows first identify the caller's existing appointment (patient *name*
// and its *day*); reschedule then additionally collects the *new day*. Keeping
// the two flows in one small machine (parameterised by `kind`) mirrors the
// dialog manager and keeps every turn exhaustively unit-testable.

import { detectDay } from "./scheduling.js";

// The kinds of amendment this skill drives.
export const AMENDMENT_KINDS = Object.freeze({
  RESCHEDULE: "reschedule",
  CANCEL: "cancel",
});

// The slots we still need before an amendment can be confirmed, plus completion.
export const AMENDMENT_STATUS = Object.freeze({
  ASK_NAME: "ask_name",
  ASK_DAY: "ask_day",
  ASK_NEW_DAY: "ask_new_day",
  COMPLETE: "complete",
});

// emptyAmendment :: (kind) -> Amendment
// The initial, empty slot bag for a reschedule/cancel. `awaiting` records which
// slot Yael last asked for, so a free-text answer (a name, or a day we couldn't
// tokenise) can be accepted verbatim rather than looping on the same question.
export function emptyAmendment(kind) {
  return Object.freeze({ kind, name: null, day: null, newDay: null, awaiting: null });
}

// advanceAmendment :: (Amendment, locale, string) -> { amendment, status }
// Folds one caller utterance into the amendment, filling any slots it can, then
// reports which slot is still missing (name / day / new day) or COMPLETE.
export function advanceAmendment(prev, locale, text) {
  const current = prev || emptyAmendment(AMENDMENT_KINDS.RESCHEDULE);
  const kind = current.kind;
  const utterance = typeof text === "string" ? text : "";
  const trimmed = utterance.trim();

  // Name has no reliable token; accept free text only when we asked for it, so
  // the initial "I'd like to reschedule" routing utterance isn't taken as a name.
  let name = current.name;
  if (!name && current.awaiting === "name" && trimmed !== "") {
    name = trimmed;
  }

  // Current appointment day: recognise a day token, else accept free text when
  // it was the awaited slot.
  let day = current.day;
  if (!day) {
    day = detectDay(utterance, locale);
    if (!day && current.awaiting === "day" && trimmed !== "") {
      day = trimmed;
    }
  }

  // Reschedule only: the new day. Only fill it once we asked, so the current-day
  // answer isn't mistaken for the new day.
  let newDay = current.newDay;
  if (kind === AMENDMENT_KINDS.RESCHEDULE && !newDay && current.awaiting === "new_day") {
    newDay = detectDay(utterance, locale) || (trimmed !== "" ? trimmed : null);
  }

  if (!name) {
    return {
      amendment: Object.freeze({ kind, name: null, day, newDay, awaiting: "name" }),
      status: AMENDMENT_STATUS.ASK_NAME,
    };
  }
  if (!day) {
    return {
      amendment: Object.freeze({ kind, name, day: null, newDay, awaiting: "day" }),
      status: AMENDMENT_STATUS.ASK_DAY,
    };
  }
  if (kind === AMENDMENT_KINDS.RESCHEDULE && !newDay) {
    return {
      amendment: Object.freeze({ kind, name, day, newDay: null, awaiting: "new_day" }),
      status: AMENDMENT_STATUS.ASK_NEW_DAY,
    };
  }
  return {
    amendment: Object.freeze({ kind, name, day, newDay, awaiting: null }),
    status: AMENDMENT_STATUS.COMPLETE,
  };
}
