import React from "react";

const ITEMS = [
  "Appointment booking, modification, and cancellation",
  "Emergency triage with same-day fee disclosure",
  "New patient registration — name, date of birth, HMO, and reason collected during the call",
  "Returning patient recognition by phone number",
  "Missed call recovery — calls back patients who didn't leave a message",
  "Price and treatment inquiries",
  "HMO and health insurance questions",
  "Real-time SMS to staff for every action Yael takes",
  "Automatic language detection — Hebrew, French, English",
  "24/7 availability — no voicemail, no missed calls",
];

export default function CapabilitiesSection() {
  return (
    <section data-capabilities style={{ background: "#fdfcfc", padding: "100px 48px" }}>
      <div style={{ maxWidth: "720px", margin: "0 auto" }}>

        {/* Label */}
        <span style={{
          fontFamily: "Inter, sans-serif",
          fontWeight: 500,
          fontSize: "10px",
          textTransform: "uppercase",
          letterSpacing: "0.12em",
          color: "#a59f97",
          display: "block",
          marginBottom: "16px",
        }}>
          Capabilities
        </span>

        {/* Headline */}
        <h2 style={{
          fontFamily: "'DM Sans', sans-serif",
          fontWeight: 300,
          fontSize: "36px",
          color: "#000000",
          letterSpacing: "-0.72px",
          lineHeight: 1.15,
          margin: "0 0 36px 0",
        }}>
          Everything your front desk handles.{" "}
          <br style={{ display: "none" }} />
          Automated.
        </h2>

        {/* Bullet list */}
        <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
          {ITEMS.map((item, i) => (
            <li
              key={i}
              style={{
                fontFamily: "Inter, sans-serif",
                fontWeight: 400,
                fontSize: "16px",
                color: "#000000",
                lineHeight: 1.7,
                paddingLeft: "18px",
                marginBottom: "14px",
                position: "relative",
              }}>
              <span style={{
                position: "absolute",
                left: 0,
                top: "0.55em",
                width: "5px",
                height: "5px",
                borderRadius: "50%",
                background: "#000000",
                display: "block",
              }} />
              {item}
            </li>
          ))}
        </ul>

        {/* Closing line */}
        <p style={{
          fontFamily: "Inter, sans-serif",
          fontWeight: 400,
          fontStyle: "italic",
          fontSize: "14px",
          color: "#777169",
          lineHeight: 1.6,
          margin: "32px 0 0 0",
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