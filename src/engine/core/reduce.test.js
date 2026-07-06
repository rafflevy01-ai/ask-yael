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

describe("reduce — reschedule flow (Amendment skill)", () => {
  const engine = () => createEngine(dentalConfig);
  const started = (eng) => {
    let s = eng.initialState();
    s = eng.reduce(s, callStarted("call-resc")).state;
    s = eng.reduce(s, callerUtterance("English please")).state;
    return s;
  };

  it("collects name, current day and new day, then reschedules with an SMS", () => {
    const eng = engine();
    let res = eng.reduce(started(eng), callerUtterance("I need to reschedule my appointment"));
    expect(res.state.intent).toBe(INTENTS.RESCHEDULE);
    expect(res.state.phase).toBe(PHASES.RESCHEDULING);
    expect(res.state.amendment.awaiting).toBe("name");

    res = eng.reduce(res.state, callerUtterance("Dana Cohen"));
    expect(res.state.amendment.awaiting).toBe("day");

    res = eng.reduce(res.state, callerUtterance("tuesday"));
    expect(res.state.amendment.awaiting).toBe("new_day");

    res = eng.reduce(res.state, callerUtterance("friday"));
    expect(res.state.phase).toBe(PHASES.ROUTING);
    expect(res.state.amendment).toBeNull();

    const moved = firstOf(res.effects, EFFECTS.RESCHEDULE_APPOINTMENT);
    expect(moved).toBeDefined();
    expect(moved.details.day).toBe("tuesday");
    expect(moved.details.newDay).toBe("friday");
    expect(firstOf(res.effects, EFFECTS.SEND_SMS)).toBeDefined();
  });
});

describe("reduce — cancel flow (Amendment skill)", () => {
  const engine = () => createEngine(dentalConfig);
  const started = (eng) => {
    let s = eng.initialState();
    s = eng.reduce(s, callStarted("call-cancel")).state;
    s = eng.reduce(s, callerUtterance("English please")).state;
    return s;
  };

  it("collects name and day, then cancels with an SMS confirmation", () => {
    const eng = engine();
    let res = eng.reduce(started(eng), callerUtterance("I want to cancel"));
    expect(res.state.intent).toBe(INTENTS.CANCEL);
    expect(res.state.phase).toBe(PHASES.CANCELLING);

    res = eng.reduce(res.state, callerUtterance("Avi Levi"));
    res = eng.reduce(res.state, callerUtterance("wednesday"));
    expect(res.state.phase).toBe(PHASES.ROUTING);

    const cancelled = firstOf(res.effects, EFFECTS.CANCEL_APPOINTMENT);
    expect(cancelled).toBeDefined();
    expect(cancelled.details.day).toBe("wednesday");
    expect(firstOf(res.effects, EFFECTS.SEND_SMS)).toBeDefined();
  });
});

describe("reduce — FAQ flow (Knowledge Base skill)", () => {
  const engine = () => createEngine(dentalConfig);
  const started = (eng) => {
    let s = eng.initialState();
    s = eng.reduce(s, callStarted("call-faq")).state;
    s = eng.reduce(s, callerUtterance("English please")).state;
    return s;
  };

  it("answers a known question from the knowledge base", () => {
    const eng = engine();
    const res = eng.reduce(started(eng), callerUtterance("what are your opening hours?"));
    expect(res.state.intent).toBe(INTENTS.ASK);
    const said = firstOf(res.effects, EFFECTS.SAY);
    expect(said.text).toContain("Sunday to Thursday");
  });

  it("answers an address question from the knowledge base", () => {
    const eng = engine();
    const res = eng.reduce(started(eng), callerUtterance("where are you located?"));
    expect(res.state.intent).toBe(INTENTS.ASK);
    const said = firstOf(res.effects, EFFECTS.SAY);
    expect(said.text).toContain("Herzl");
  });
});

describe("reduce — message-taking + callback", () => {
  const engine = () => createEngine(dentalConfig);
  const started = (eng) => {
    let s = eng.initialState();
    s = eng.reduce(s, callStarted("call-msg")).state;
    s = eng.reduce(s, callerUtterance("English please")).state;
    return s;
  };

  it("prompts for a message then captures it and requests a callback", () => {
    const eng = engine();
    let res = eng.reduce(started(eng), callerUtterance("can you have someone call me back?"));
    expect(res.state.intent).toBe(INTENTS.MESSAGE);
    expect(res.state.phase).toBe(PHASES.MESSAGE);
    expect(firstOf(res.effects, EFFECTS.TAKE_MESSAGE)).toBeDefined();

    res = eng.reduce(res.state, callerUtterance("Please tell Dr. Levi the crown fell off."));
    expect(res.state.phase).toBe(PHASES.ROUTING);
    const callback = firstOf(res.effects, EFFECTS.REQUEST_CALLBACK);
    expect(callback).toBeDefined();
    expect(callback.message).toContain("crown fell off");
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
