// A tiny call runner that wires the pure core to (mock) adapters.
//
// This is the "edge" that the pure reducer deliberately avoids being: it folds
// a sequence of events through the engine, running the returned effects via a
// telephony adapter as it goes. It is the seam an end-to-end call simulation
// (Phase 0 deliverable) plugs into.

import { createEngine } from "./reduce.js";

// runCall :: ({ config, telephony, calendar?, events }) -> { state, transcript, effects }
// - config:    a vertical config pack (e.g. dentalConfig)
// - telephony: an adapter exposing perform(effect) (see mockTelephony)
// - calendar:  an optional Calendar/PMS adapter exposing perform(effect); when
//              provided, appointment effects are also applied to it (see
//              mockCalendar). This is the seam a real PMS plugs into.
// - events:    ordered list of input events (CALL_STARTED, utterances, …)
export function runCall({ config = {}, telephony, calendar = null, events = [] }) {
  const engine = createEngine(config);

  let state = engine.initialState();
  for (const event of events) {
    const result = engine.reduce(state, event);
    state = result.state;
    for (const effect of result.effects) {
      telephony.perform(effect);
      if (calendar) calendar.perform(effect);
    }
  }

  return {
    state,
    transcript: telephony.transcript(),
    effects: telephony.effects(),
  };
}
