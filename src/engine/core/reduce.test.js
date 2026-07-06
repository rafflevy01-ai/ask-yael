import { describe, it, expect } from "vitest";
import { createEngine, reduce } from "./reduce.js";
import { PHASES, initialState } from "../domain/state.js";
import {
  callStarted,
  callerUtterance,
  languageSelected,
  callEnded,
} from "../domain/events.js";
import { EFFECTS } from "../domain/effects.js";
import { INTENTS } from "../domain/intents.js";
import { dentalConfig } from "../config/dental.js";

const typesOf = (effects) => effects.map((e) => e.type);
const firstOf = (effects, type) => effects.find((e) => e.type === type);

describe("reduce — call start & language selection", () => {
  it("greets and offers the language menu on CALL_STARTED", () => {
    const { state, effects } = reduce(initialState(), callStarted("call-1"));

    expect(state.phase).toBe(PHASES.LANGUAGE_SELECTION);
    expect(state.callId).toBe("call-1");
    expect(typesOf(effects)).toEqual([EFFECTS.LOG, EFFECTS.SAY, EFFECTS.SAY]);
  });

  it("sets the language from an explicit ASR-detected locale", () => {
    let { state } = reduce(initialState(), callStarted("c"));
    const res = reduce(state, callerUtterance("Bonjour", "fr"));

    expect(res.state.locale).toBe("fr");
    expect(res.state.phase).toBe(PHASES.ROUTING);
    expect(firstOf(res.effects, EFFECTS.SET_LANGUAGE).locale).toBe("fr");
  });

  it("parses a spoken language choice when ASR gives no locale", () => {
    let { state } = reduce(initialState(), callStarted("c"));
    const res = reduce(state, callerUtterance("English please"));

    expect(res.state.locale).toBe("en");
    expect(res.state.phase).toBe(PHASES.ROUTING);
  });

  it("re-offers the menu when the language cannot be determined", () => {
    let { state } = reduce(initialState(), callStarted("c"));
    const res = reduce(state, callerUtterance("mmm hello"));

    expect(res.state.locale).toBeNull();
    expect(res.state.phase).toBe(PHASES.LANGUAGE_SELECTION);
    expect(typesOf(res.effects)).toEqual([EFFECTS.SAY]);
  });

  it("supports the LANGUAGE_SELECTED event as an explicit menu pick", () => {
    let { state } = reduce(initialState(), callStarted("c"));
    const res = reduce(state, languageSelected("he"));

    expect(res.state.locale).toBe("he");
    expect(res.state.phase).toBe(PHASES.ROUTING);
  });
});

describe("reduce — intent routing", () => {
  const started = () => {
    const a = reduce(initialState(), callStarted("c"));
    return reduce(a.state, callerUtterance("English please")).state;
  };

  it("routes a booking request", () => {
    const res = reduce(started(), callerUtterance("I want to book an appointment"));
    expect(res.state.intent).toBe(INTENTS.BOOK);
    expect(firstOf(res.effects, EFFECTS.SAY)).toBeDefined();
  });

  it("emits TAKE_MESSAGE for a message intent", () => {
    const res = reduce(started(), callerUtterance("Can you call me back later?"));
    expect(res.state.intent).toBe(INTENTS.MESSAGE);
    expect(firstOf(res.effects, EFFECTS.TAKE_MESSAGE)).toBeDefined();
  });

  it("emits TRANSFER_TO_HUMAN for a handoff intent", () => {
    const res = reduce(started(), callerUtterance("I want to speak to a real person"));
    expect(res.state.intent).toBe(INTENTS.HANDOFF);
    expect(firstOf(res.effects, EFFECTS.TRANSFER_TO_HUMAN)).toBeDefined();
  });

  it("falls back gracefully on an unrecognised request", () => {
    const res = reduce(started(), callerUtterance("blah blah nonsense"));
    expect(res.state.intent).toBe(INTENTS.UNKNOWN);
    expect(firstOf(res.effects, EFFECTS.SAY)).toBeDefined();
  });
});

describe("reduce — emergency short-circuit", () => {
  it("escalates an emergency even before a language is chosen", () => {
    const { state } = reduce(initialState(), callStarted("c"));
    const res = reduce(state, callerUtterance("I'm bleeding badly, help"));

    expect(res.state.intent).toBe(INTENTS.EMERGENCY);
    const esc = firstOf(res.effects, EFFECTS.ESCALATE_EMERGENCY);
    expect(esc).toBeDefined();
    expect(esc.script).toContain("911");
  });

  it("uses dental config triggers to catch a knocked-out tooth", () => {
    const engine = createEngine(dentalConfig);
    let state = engine.initialState();
    state = engine.reduce(state, callStarted("c")).state;
    state = engine.reduce(state, callerUtterance("English please")).state;

    const res = engine.reduce(state, callerUtterance("my tooth got knocked out"));
    expect(res.state.intent).toBe(INTENTS.EMERGENCY);
    expect(firstOf(res.effects, EFFECTS.ESCALATE_EMERGENCY)).toBeDefined();
  });
});

describe("reduce — booking flow (Scheduling skill)", () => {
  const engine = () => createEngine(dentalConfig);
  const started = (eng) => {
    let s = eng.initialState();
    s = eng.reduce(s, callStarted("call-book")).state;
    s = eng.reduce(s, callerUtterance("English please")).state;
    return s;
  };

  it("asks for the appointment type when a booking starts without one", () => {
    const eng = engine();
    const res = eng.reduce(started(eng), callerUtterance("I'd like to book an appointment"));
    expect(res.state.intent).toBe(INTENTS.BOOK);
    expect(res.state.phase).toBe(PHASES.BOOKING);
    expect(res.state.booking.awaiting).toBe("type");
    expect(firstOf(res.effects, EFFECTS.SAY)).toBeDefined();
  });

  it("collects type then day across turns and books with an SMS confirmation", () => {
    const eng = engine();
    let res = eng.reduce(started(eng), callerUtterance("I'd like to book an appointment"));
    expect(res.state.phase).toBe(PHASES.BOOKING);
    expect(res.state.booking.awaiting).toBe("type");

    res = eng.reduce(res.state, callerUtterance("a cleaning"));
    expect(res.state.phase).toBe(PHASES.BOOKING);
    expect(res.state.booking.appointmentType).toBe("cleaning");

    res = eng.reduce(res.state, callerUtterance("tuesday works"));
    expect(res.state.phase).toBe(PHASES.ROUTING);
    expect(res.state.booking).toBeNull();

    const booked = firstOf(res.effects, EFFECTS.BOOK_APPOINTMENT);
    expect(booked).toBeDefined();
    expect(booked.details.appointmentType).toBe("cleaning");
    expect(booked.details.day).toBe("tuesday");

    const sms = firstOf(res.effects, EFFECTS.SEND_SMS);
    expect(sms).toBeDefined();
    expect(sms.locale).toBe("en");
  });

  it("books immediately when type and day arrive together", () => {
    const eng = engine();
    const res = eng.reduce(started(eng), callerUtterance("book a filling for friday"));
    expect(res.state.phase).toBe(PHASES.ROUTING);
    expect(firstOf(res.effects, EFFECTS.BOOK_APPOINTMENT).details.appointmentType).toBe("filling");
  });

  it("still short-circuits to emergency mid-booking", () => {
    const eng = engine();
    let res = eng.reduce(started(eng), callerUtterance("I want to book"));
    expect(res.state.phase).toBe(PHASES.BOOKING);
    res = eng.reduce(res.state, callerUtterance("actually my tooth got knocked out"));
    expect(res.state.intent).toBe(INTENTS.EMERGENCY);
    expect(firstOf(res.effects, EFFECTS.ESCALATE_EMERGENCY)).toBeDefined();
  });
});

describe("reduce — purity", () => {
  it("does not mutate the input state", () => {
    const start = initialState();
    const snapshot = JSON.stringify(start);
    reduce(start, callStarted("c"));
    expect(JSON.stringify(start)).toBe(snapshot);
  });

  it("ends the call with a goodbye and END_CALL effect", () => {
    let { state } = reduce(initialState(), callStarted("c"));
    const res = reduce(state, callEnded());
    expect(res.state.phase).toBe(PHASES.ENDED);
    expect(typesOf(res.effects)).toContain(EFFECTS.END_CALL);
  });
});
