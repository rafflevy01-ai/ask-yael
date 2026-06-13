import { useState } from "react";

const GROUPS = [
  {
    label: "PATIENT JOURNEY",
    items: [
      {
        text: "Appointment booking, modification, and cancellation",
        example: "\u201cJe vous r\u00e9serve le jeudi 12 \u00e0 9h. On confirme?\u201d \u2014 Yael books it, sends the SMS, and closes the call.",
      },
      {
        text: "Emergency triage with same-day fee disclosure",
        example: "\u201cUn cr\u00e9neau urgent inclut un suppl\u00e9ment de 1\u00a0000\u00a0\u20aa. J\u2019ai 10h30 de libre \u2014 \u00e7a vous va?\u201d",
      },
      {
        text: "New patient registration \u2014 name, date of birth, HMO, and reason collected during the call",
        example: "Yael collects all 5 details \u2014 name, date of birth, HMO, ID, reason \u2014 and registers the patient before hanging up.",
      },
      {
        text: "Returning patient recognition by phone number",
        example: "\u201cShalom Leah \u2014 I can see your last appointment was in March. What can I do for you today?\u201d",
      },
      {
        text: "Missed call recovery \u2014 calls back patients who didn\u2019t leave a message",
        example: "Yael calls back within minutes. No voicemail. No callback request needed from the patient.",
      },
    ],
  },
  {
    label: "LIVE ASSISTANCE",
    items: [
      {
        text: "Price and treatment inquiries",
        example: "\u201cA crown at our clinic is typically between \u20aa2,500 and \u20aa3,500 depending on the case.\u201d",
      },
      {
        text: "HMO and health insurance questions",
        example: "\u201cThe clinic is private \u2014 we\u2019ll give you an invoice so you can file with your health fund.\u201d",
      },
      {
        text: "Real-time SMS to staff for every action Yael takes",
        example: "Staff receives a summary SMS the moment any booking, intake, or transfer completes.",
      },
    ],
  },
  {
    label: "ALWAYS ON",
    items: [
      {
        text: "Automatic language detection \u2014 Hebrew, French, English",
        example: "Yael opens in Hebrew and switches to French the moment she hears \u201cbonjour.\u201d",
      },
      {
        text: "24/7 availability \u2014 no voicemail, no missed calls",
        example: "A patient calls at 21:00. Yael answers instantly. An appointment is booked before midnight.",
      },
    ],
  },
];

function ExpandableItem({ text, example }) {
  const [open, setOpen] = useState(false);

  return (
    <div style={{ marginBottom: "12px" }}>
      <button
        onClick={() => setOpen(!open)}
        style={{
          display: "flex",
          alignItems: "flex-start",
          gap: "10px",
          width: "100%",
          textAlign: "left",
          background: "none",
          border: "none",
          padding: 0,
          cursor: "pointer",
          font: "inherit",
          color: "inherit",
        }}
      >
        <span style={{
          fontFamily: "Inter, sans-serif",
          fontWeight: 400,
          fontSize: "16px",
          color: "#a59f97",
          lineHeight: 1.7,
          flexShrink: 0,
          userSelect: "none",
        }}>
          &#x2713;
        </span>
        <span style={{
          fontFamily: "Inter, sans-serif",
          fontWeight: 400,
          fontSize: "16px",
          color: "#000000",
          lineHeight: 1.7,
        }}>
          {text}
        </span>
      </button>

      <div
        style={{
          overflow: "hidden",
          maxHeight: open ? "80px" : "0",
          opacity: open ? 1 : 0,
          transition: "max-height 200ms ease, opacity 200ms ease",
          paddingLeft: "28px",
        }}
      >
        <p style={{
          fontFamily: "Inter, sans-serif",
          fontWeight: 400,
          fontStyle: "italic",
          fontSize: "13px",
          color: "#777169",
          lineHeight: 1.6,
          margin: "6px 0 0 0",
        }}>
          {example}
        </p>
      </div>
    </div>
  );
}

export default function CapabilitiesSection() {
  return (
    <section data-capabilities style={{ background: "#fdfcfc", padding: "100px 48px" }}>
      <div style={{ maxWidth: "780px", margin: "0 auto" }}>

        {/* Label */}
        <span style={{
          fontFamily: "Inter, sans-serif", fontWeight: 500, fontSize: "10px",
          textTransform: "uppercase", letterSpacing: "0.12em", color: "#a59f97",
          display: "block", marginBottom: "14px", textAlign: "center",
        }}>
          Capabilities
        </span>

        {/* Headline */}
        <h2 style={{
          fontFamily: "'DM Sans', sans-serif", fontWeight: 300, fontSize: "36px",
          color: "#000000", letterSpacing: "-0.72px", lineHeight: 1.15,
          margin: "0 auto 48px auto", textAlign: "center", maxWidth: "480px",
        }}>
          Everything your front desk handles. Automated.
        </h2>

        {/* Grouped checklist cards */}
        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          {GROUPS.map((group) => (
            <div
              key={group.label}
              style={{
                background: "#f5f0eb",
                borderRadius: "12px",
                padding: "32px",
              }}
            >
              <span style={{
                fontFamily: "Inter, sans-serif",
                fontWeight: 500,
                fontSize: "10px",
                textTransform: "uppercase",
                letterSpacing: "0.08em",
                color: "#a59f97",
                display: "block",
                marginBottom: "24px",
              }}>
                {group.label}
              </span>

              <div>
                {group.items.map((item) => (
                  <ExpandableItem
                    key={item.text}
                    text={item.text}
                    example={item.example}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Closing line */}
        <p style={{
          fontFamily: "Inter, sans-serif", fontWeight: 400, fontStyle: "italic",
          fontSize: "14px", color: "#777169", lineHeight: 1.6,
          margin: "36px auto 0 auto", textAlign: "center",
        }}>
          All of this in one call, in the patient's language, 24 hours a day.
        </p>
      </div>

      <style>{`
        @media (max-width: 768px) {
          [data-capabilities] { padding: 48px 16px !important; }
        }
        @media (max-width: 1024px) {
          [data-capabilities] { padding: 64px 24px !important; }
        }
      `}</style>
    </section>
  );
}