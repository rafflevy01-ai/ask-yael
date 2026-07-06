// Events are the *inputs* to the pure conversation core.
//
// Everything that happens to a call — the telephony layer answering, the ASR
// producing a transcript, the caller picking a language, the line dropping —
// arrives as one of these plain data objects. The core never performs I/O; it
// only folds events into new state (see core/reduce.js).

export const EVENTS = Object.freeze({
  CALL_STARTED: "CALL_STARTED",
  CALLER_UTTERANCE: "CALLER_UTTERANCE",
  LANGUAGE_SELECTED: "LANGUAGE_SELECTED",
  CALL_ENDED: "CALL_ENDED",
});

// A call has begun. `callId` uniquely identifies the conversation.
export const callStarted = (callId) => ({
  type: EVENTS.CALL_STARTED,
  callId,
});

// The caller said something. `text` is the ASR transcript. `detectedLocale`
// is the ASR/language-detection best guess (may be null when unknown).
export const callerUtterance = (text, detectedLocale = null) => ({
  type: EVENTS.CALLER_UTTERANCE,
  text,
  detectedLocale,
});

// The caller explicitly picked a language from the offered menu.
export const languageSelected = (locale) => ({
  type: EVENTS.LANGUAGE_SELECTED,
  locale,
});

// The call ended (caller hung up or line dropped).
export const callEnded = () => ({
  type: EVENTS.CALL_ENDED,
});
