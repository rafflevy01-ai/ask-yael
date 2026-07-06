# Ask-Yael — Automated Multilingual Receptionist

Spec sheet & development path for **Yael**, an AI voice receptionist that answers
calls in **Hebrew, French, English, and any other language**. This document is
the source of truth for the phased build: **dental → physical therapy →
profession platform**.

> Status: **Phase 1 (dental prototype) — in progress**. The pure, TDD
> conversation engine (Phase 0) lives in [`src/engine`](../src/engine). The
> Phase-1 skills now drive real multi-turn conversations: **Scheduling**
> (booking), **Amendment** (reschedule/cancel), **FAQ/Knowledge-Base**,
> emergency **Triage**, **message-taking + callback**, and human handoff — each
> emitting effects-as-data (`BOOK_APPOINTMENT`, `RESCHEDULE_APPOINTMENT`,
> `CANCEL_APPOINTMENT`, `SEND_SMS`, `REQUEST_CALLBACK`, …) that edge adapters
> execute. The edges now include **live providers**: an **ElevenLabs**
> telephony/voice adapter (TTS + speech-to-text) and a **Google Calendar**
> adapter, alongside the local mock calendar. An **admin dashboard MVP**
> (`/admin`) in the marketing app visualises call logs, transcripts, the booked
> calendar, analytics, and the vertical config. Full HE/FR/EN throughout. The
> React/Vite site is otherwise unchanged.

---

## 0. Research — what a receptionist actually does

Synthesised from medical-office receptionist job descriptions, dental
front-desk workflows, and physical-therapy intake practices. Duties cluster
into six domains:

**A. Call & contact handling** — answer inbound calls promptly, greet, identify
caller and reason; route/transfer, take and relay messages; handle voicemail
overflow and return missed calls (callback); manage multi-channel contact
(phone, SMS, WhatsApp, email, web form).

**B. Scheduling** — book / reschedule / cancel against provider availability;
enforce booking rules (duration by appointment type, provider, room/chair);
waitlist management and gap-filling on cancellations; send confirmations and
reminders to reduce no-shows.

**C. Patient intake & records** — collect/verify demographics and contact
details; capture reason for visit / chief complaint; insurance / health-fund
verification (Israel: Kupot Holim — Clalit, Maccabi, Meuhedet, Leumit; France:
Sécurité sociale + mutuelle; US: PPO/HMO); new-patient forms, consent, history.

**D. Triage & information** — answer FAQs (hours, address, parking, pricing,
what to bring); distinguish routine vs. urgent vs. emergency and escalate with a
clear locale-correct script; de-escalate frustrated/anxious callers.

**E. Billing & administrative** — quote prices, explain coverage, collect
deposits/co-pays via payment link; follow-up calls (post-treatment check-ins,
recall reminders).

**F. Compliance & handoff** — privacy (HIPAA-US / GDPR-EU / Israel PPL); accurate
logging, audit trail, and clean handoff to human staff.

### Domain deltas across the three verticals

- **Dental (prototype)** — chair/operatory as a resource; appointment types
  (cleaning, filling, root canal, emergency toothache); recall cycles (6-month
  cleanings); dental triage (broken tooth, swelling, knocked-out tooth =
  time-critical).
- **Physical therapy** — referral/prescription tracking; insurance session caps;
  recurring multi-session plans (e.g. 10 sessions); progress-tied rebooking;
  therapist-specialisation matching.
- **Generic platform** — the above generalised into a **profession template**:
  resource types, appointment catalogue, triage rules, intake fields, and
  glossary/prompt pack per vertical.

**Key architectural insight:** ~80% is shared (telephony, ASR/TTS, dialog
manager, scheduling, notifications, logging); ~20% is vertical-specific
*configuration and data*. Build the generic core once; **ship verticals as
config packs.** This is the backbone of the phased plan below.

---

## 1. Multilingual strategy (Hebrew, French, English, + any)

- **Language detection on first utterance**, with an explicit fallback greeting
  offering a choice ("Hebrew / French / English?").
- **RTL-aware** everywhere. Hebrew already uses `isRtl` in the codebase — the
  engine's locale metadata mirrors `LanguageContext`.
- **Speech pipeline** supports each language natively: ASR → NLU (intent +
  entities) → NLG → TTS, configured per locale. Hebrew is the hardest (limited
  high-quality voices, rich morphology) → **validate Hebrew ASR/TTS quality
  first** as a risk-buster.
- **"Any other language"** via a language-agnostic LLM layer + a configurable
  voice per locale. A new language is a **data/config addition**, not a code
  change (see [`src/engine/domain/locales.js`](../src/engine/domain/locales.js)
  and [`src/engine/core/phrases.js`](../src/engine/core/phrases.js)).
- **Localisation of content**, not just translation: dates, currency,
  health-fund/insurance vocabulary, and emergency numbers
  (**101** IL / **15** FR / **911** US) per locale.

---

## 2. System spec sheet

### 2.1 Functional requirements

| ID  | Requirement |
| --- | --- |
| F1  | Answer inbound calls 24/7; greet and detect/confirm language |
| F2  | Understand caller intent (book/reschedule/cancel/ask/emergency/message) |
| F3  | Check real availability and book/modify/cancel appointments |
| F4  | Verify caller identity and capture/verify intake data |
| F5  | Answer FAQs from a per-clinic knowledge base |
| F6  | Detect emergencies and escalate with locale-correct scripts |
| F7  | Send SMS/WhatsApp/email confirmations & reminders |
| F8  | Take messages and trigger callbacks when it can't resolve |
| F9  | Graceful human handoff / warm transfer |
| F10 | Full transcript + structured event log per call (audit) |
| F11 | Admin dashboard: config, calendar, call logs, analytics |
| F12 | Per-profession configuration packs (dental/PT/…) |

### 2.2 Non-functional requirements

- **Latency:** end-to-end voice turn < ~1.2 s for natural conversation.
- **Availability:** 99.9%; telephony fallback to voicemail/human if engine down.
- **Privacy/compliance:** GDPR + Israel PPL + (US path) HIPAA; PII encryption at
  rest/in transit; configurable data retention; consent capture.
- **Observability:** structured logs, per-call tracing, dashboards, alerting.
- **Scalability:** stateless dialog workers; concurrent-call capacity target.
- **Safety:** never give medical advice; deterministic emergency escalation.

### 2.3 High-level architecture

```
Telephony (SIP/Twilio/Vonage)
  → Media gateway (streaming audio)
    → ASR (per-locale) → NLU (intent+entities, LLM-assisted)
      → Dialog Manager (state machine, pure/functional core)
        → Skills: Scheduling | Intake | FAQ/KB | Triage | Messaging | Handoff
          → Integrations: Calendar/PMS, SMS/WhatsApp, Payment, CRM
      → NLG → TTS (per-locale voice) → caller
  → Event log / Audit store → Admin dashboard (this React/Vite app)
```

- **Conversation core = pure functions:** `reduce(State, Event) → { State, [Effect] }`.
  Effects (I/O) are **data**, executed at the edges. This is the functional-idioms
  backbone and makes the core exhaustively unit-testable without telephony.
- **Profession packs are data** (config objects) loaded into the same engine.

### 2.4 Data model (core entities)

Clinic, Profession/VerticalConfig, Provider, Resource (chair/room),
AppointmentType, Availability/Schedule, Appointment, Patient/Caller,
InsuranceProfile, IntakeForm, Call (transcript + events), Message, TriageRule,
KnowledgeBaseEntry.

### 2.5 Engineering principles

- **TDD** — every feature starts with a failing test (Red → Green → Refactor).
  Behaviour-level tests on the pure dialog core + contract tests on integration
  adapters. Coverage priority: **dialog core → skills → adapters (mocked) → e2e
  call simulation.**
- **Functional idioms** — immutable state, pure reducers, effects-as-data,
  composition over inheritance, no hidden side effects in the core, adapters
  isolate all I/O.
- **3R rules** — *Red-Green-Refactor* (the TDD loop) combined with the *Rule of
  Three* refactoring discipline: don't abstract on first use, tolerate a second
  duplication, extract on the third. Applied especially when generalising
  dental-specific code during the PT phase.

---

## 3. Development path (phased)

### Phase 0 — Foundations & risk-busting *(current)*

- Choose telephony + ASR/TTS providers; **validate Hebrew voice quality**
  end-to-end.
- Stand up test tooling (Vitest), CI, and the pure `reduce(State, Event)`
  skeleton with TDD from day one.
- **Deliverable:** a "hello, choose language" call that greets in HE/FR/EN.
- **Implemented here:** [`src/engine`](../src/engine) — pure core, language
  selection + intent routing, locale-aware emergency triage, mocked
  telephony/ASR adapters, an end-to-end call runner, and the dental config pack,
  all under passing Vitest tests (`npm test`).

### Phase 1 — Dental prototype (vertical #1)

- Dental config pack: appointment catalogue, chair resource, dental triage
  rules, intake schema, and a per-clinic knowledge base *(seed in
  [`src/engine/config/dental.js`](../src/engine/config/dental.js); appointment
  types carry per-locale keywords for speech recognition, and the knowledge base
  is generated from a single-source-of-truth clinic profile by
  [`buildKnowledgeBase`](../src/engine/config/knowledgeBase.js) so a fact change
  updates every language's FAQ answer)*.
- Skills: **Scheduling — booking (done: multi-turn type+day slot-filling →
  `BOOK_APPOINTMENT` + SMS confirmation, see
  [`src/engine/skills/scheduling.js`](../src/engine/skills/scheduling.js))**;
  **reschedule/cancel (done: multi-turn name+day(+new day) slot-filling →
  `RESCHEDULE_APPOINTMENT` / `CANCEL_APPOINTMENT` + SMS, see
  [`src/engine/skills/amendment.js`](../src/engine/skills/amendment.js))**;
  **FAQ/KB (done: knowledge-base lookup with locale-aware answers, see
  [`src/engine/skills/faq.js`](../src/engine/skills/faq.js))**; emergency triage
  (done), SMS/WhatsApp confirmations (done), **message-taking + callback (done:
  captures the message → `REQUEST_CALLBACK`)**, human handoff (done).
- Calendar/PMS integration behind an adapter interface — *the core emits
  `BOOK_APPOINTMENT` / `RESCHEDULE_APPOINTMENT` / `CANCEL_APPOINTMENT` as data;
  the pilot books against a **dedicated dental PMS** via the live adapter
  ([`src/engine/adapters/dentalPms.js`](../src/engine/adapters/dentalPms.js))
  behind an injectable client. A mock adapter
  ([`src/engine/adapters/mockCalendar.js`](../src/engine/adapters/mockCalendar.js))
  is the local option, and a **Google Calendar** adapter
  ([`src/engine/adapters/googleCalendar.js`](../src/engine/adapters/googleCalendar.js))
  maps the same effects onto the Google Calendar Events API. All wire through
  `runCall` (decision §5.2 resolved: dental PMS).*
- Live telephony/voice provider behind the same telephony interface — an
  **ElevenLabs** adapter
  ([`src/engine/adapters/elevenLabsTelephony.js`](../src/engine/adapters/elevenLabsTelephony.js))
  turns each `SAY` effect into speech via ElevenLabs Text-to-Speech and
  transcribes caller audio via ElevenLabs Speech-to-Text; I/O is deferred
  (async `flush()`) and injectable so the core stays pure (open decision §5.1).
- Admin dashboard MVP in this app (**done**, at `/admin`): call logs +
  transcripts, calendar view, analytics, and a config view. *It consumes the
  engine's aggregation helpers
  ([`src/engine/admin/callLog.js`](../src/engine/admin/callLog.js)) fed by the
  engine's `LOG` / booking effects.*
- Multilingual HE/FR/EN fully working.
- **Exit criteria:** pilot in one dental clinic; measured no-show reduction &
  containment rate.

### Phase 2 — Physical therapy (vertical #2)

- New PT config pack: referrals/prescriptions, session-cap insurance logic,
  multi-session plans, therapist-specialisation matching, recurring rebooking.
- Generalise any duplicated dental-specific code (**Rule of Three → extract to
  core**).
- **Exit criteria:** PT pilot; validate the config-pack abstraction held (little
  or no core change needed).

### Phase 3 — Profession platform

- **Self-serve vertical builder:** resources, appointment types, triage rules,
  intake fields, glossary/prompt pack, languages — all as data.
- Template presets / marketplace; onboarding wizard; billing/subscription
  (Stripe already in dependencies).
- Analytics: containment rate, booking conversion, language mix, escalation
  reasons.
- Compliance hardening (HIPAA path for US), multi-tenant isolation.

**Cross-cutting throughout:** observability, privacy/consent, security review,
and continuous TDD/refactor discipline.

---

## 4. The Phase-0 engine (what's in `src/engine`)

Pure, framework-agnostic, and fully tested. Run `npm test`.

```
src/engine/
  domain/      locales · events · effects · intents · state   (data + pure helpers)
  core/        reduce · phrases · runCall                      (pure dialog core + edge runner)
  skills/      triage · scheduling · amendment · faq           (emergency · booking · reschedule/cancel · knowledge base)
  adapters/    mockTelephony · mockCalendar                    (in-memory telephony/ASR + Calendar/PMS)
  config/      dental                                          (vertical config pack — data)
  index.js     public API
```

Core contract:

```js
import { createEngine, dentalConfig, callStarted, callerUtterance } from "@/engine";

const engine = createEngine(dentalConfig);
let state = engine.initialState();

const started = engine.reduce(state, callStarted("call-1"));
// started.effects: [LOG, SAY(greeting), SAY(language menu)]

const res = engine.reduce(started.state, callerUtterance("Bonjour", "fr"));
// res.state.locale === "fr"; res.effects include SET_LANGUAGE + SAY(howCanIHelp)
```

Everything the engine decides is returned as **effects (data)** — `SAY`,
`SET_LANGUAGE`, `ESCALATE_EMERGENCY`, `TRANSFER_TO_HUMAN`, `TAKE_MESSAGE`,
`REQUEST_CALLBACK`, `BOOK_APPOINTMENT`, `RESCHEDULE_APPOINTMENT`,
`CANCEL_APPOINTMENT`, `SEND_SMS`, `LOG`, `END_CALL` — which the edge (telephony
and Calendar/PMS adapters) interprets. This keeps the core pure and every
decision unit-testable.

---

## 5. Open decisions

1. **Telephony/voice providers** — Twilio/Vonage for telephony; **ElevenLabs**
   for TTS + speech-to-text (adapter implemented in
   [`src/engine/adapters/elevenLabsTelephony.js`](../src/engine/adapters/elevenLabsTelephony.js)).
   The voice configuration is centralized in a
   [`voiceProfile`](../src/engine/config/voiceProfile.js) that also reports
   **what is still needed** to finalize voice (`missingVoiceRequirements` /
   `assertVoiceProfileReady`, plus the human `VOICE_FINALIZATION_CHECKLIST`):
   an API key, a chosen voice id per locale (he/fr/en), model confirmation, and
   sign-off on the Hebrew quality + cost spike.
2. **Calendar/PMS** — **resolved: a dedicated dental PMS** is the pilot booking
   backend (adapter implemented in
   [`src/engine/adapters/dentalPms.js`](../src/engine/adapters/dentalPms.js);
   the core emits the same `BOOK_APPOINTMENT` / `RESCHEDULE_APPOINTMENT` /
   `CANCEL_APPOINTMENT` effects). The Google Calendar adapter
   ([`src/engine/adapters/googleCalendar.js`](../src/engine/adapters/googleCalendar.js))
   and the local mock remain available for offline/dev use behind the same
   interface.
3. **Knowledge base** — **resolved: generated from a single source of truth.**
   The FAQ knowledge base is rendered from a structured per-clinic profile
   ([`dentalClinicProfile`](../src/engine/config/dental.js)) by
   [`buildKnowledgeBase`](../src/engine/config/knowledgeBase.js); editing a fact
   (hours, address, price, accepted health funds, required documents) updates
   every language's answer, with no prose to keep in sync by hand.
