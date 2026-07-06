// The conversation state and pure helpers for evolving it immutably.
//
// State is a plain, serialisable object. Every helper returns a *new* state
// object rather than mutating the input, so the reducer can be reasoned about
// as a pure function and states can be snapshotted for audit/replay.

// The phases a call moves through. The dialog manager is a small state machine.
export const PHASES = Object.freeze({
  GREETING: "greeting",
  LANGUAGE_SELECTION: "language_selection",
  ROUTING: "routing",
  BOOKING: "booking",
  RESCHEDULING: "rescheduling",
  CANCELLING: "cancelling",
  MESSAGE: "message",
  ENDED: "ended",
});

// initialState :: () -> State
export function initialState() {
  return Object.freeze({
    phase: PHASES.GREETING,
    callId: null,
    locale: null, // unknown until detected or selected
    intent: null,
    booking: null, // in-progress appointment slots (see skills/scheduling.js)
    amendment: null, // in-progress reschedule/cancel slots (see skills/amendment.js)
    transcript: [], // [{ role: "caller" | "yael", text }]
  });
}

// A shallow, immutable update helper. Returns a frozen copy.
export function patch(state, changes) {
  return Object.freeze({ ...state, ...changes });
}

// appendTranscript :: (State, role, text) -> State
export function appendTranscript(state, role, text) {
  const entry = Object.freeze({ role, text });
  return patch(state, { transcript: Object.freeze([...state.transcript, entry]) });
}
