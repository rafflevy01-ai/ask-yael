# Ask-Yael conversation engine (Phase 1)

A **pure, framework-agnostic, test-driven** conversation core for Yael, the
multilingual AI receptionist. See [`docs/SPEC.md`](../../docs/SPEC.md) for the
full spec and development path.

## Design

The heart of the engine is a single pure function:

```
reduce(State, Event, Config) -> { State, [Effect] }
```

- **No I/O in the core.** Decisions come out as **effects (data)** — `SAY`,
  `SET_LANGUAGE`, `ESCALATE_EMERGENCY`, `TRANSFER_TO_HUMAN`, `TAKE_MESSAGE`,
  `BOOK_APPOINTMENT`, `SEND_SMS`, `LOG`, `END_CALL` — which an edge adapter
  interprets.
- **Immutable state.** Helpers return frozen copies; the reducer never mutates
  its input.
- **Verticals are data.** A profession (dental, PT, …) is a config object passed
  to `createEngine(config)`; the core code is unchanged between verticals.
- **Multilingual by data.** Locales and phrases are tables keyed by language;
  adding a language is a data change, not a code change.

## Layout

```
domain/    locales · events · effects · intents · state   (data + pure helpers)
core/      reduce · phrases · runCall                      (pure dialog core + edge runner)
skills/    triage · scheduling                             (emergency detection · booking)
adapters/  mockTelephony                                   (in-memory telephony + ASR)
config/    dental                                          (vertical config pack — data)
index.js   public API
```

## Usage

```js
import { runCall, createMockTelephony, dentalConfig,
         callStarted, callerUtterance, callEnded } from "@/engine";

const telephony = createMockTelephony();
const { state, transcript, effects } = runCall({
  config: dentalConfig,
  telephony,
  events: [
    callStarted("call-1"),
    callerUtterance("Bonjour", "fr"),
    callerUtterance("Je voudrais prendre rendez-vous"),
    callEnded(),
  ],
});
```

## Tests

```
npm test          # run once
npm run test:watch
```

Test files live next to the code they cover (`*.test.js`). New behaviour is
added test-first (Red → Green → Refactor).
