import React from "react";

const STEPS = [
  {
    number: "01",
    title: "Call Received",
    description: "Yael answers instantly in the caller's language. No menu, no hold music, no voicemail.",
  },
  {
    number: "02",
    title: "Patient Identified",
    description: "Returning patients are recognized by phone number before they speak. New patients are registered on the spot.",
  },
  {
    number: "03",
    title: "Request Handled",
    description: "Booking, triage, intake, modification, or cancellation — resolved in one call. Every action writes directly to the booking system.",
  },
  {
    number: "04",
    title: "Team Notified",
    description: "Your staff gets an SMS for every action Yael takes. If she can't handle it, she transfers the call with a full summary.",
  },
];

export default function HowItWorksSection() {
  return (
    <section style={{ background: "#f5f3f1" }}>
      <div style={{ maxWidth: "1100px", margin: "0 auto", padding: "100px 48px 0" }}>
        {/* Headline */}
        <h2 style={{
          fontFamily: "'DM Sans', sans-serif",
          fontWeight: 300,
          fontSize: "clamp(1.5rem, 2.8vw, 2.25rem)",
          color: "#000000",
          letterSpacing: "-0.72px",
          margin: "0 0 64px 0",
        }}>
          How Yael works.
        </h2>

        {/* Steps row */}
        <div className="how-it-works-steps">
          {STEPS.map((step, i) => (
            <React.Fragment key={step.number}>
              <div className="how-it-works-step">
                <div style={{
                  fontFamily: "'Geist Mono', monospace",
                  fontWeight: 400,
                  fontSize: "2rem",
                  color: "#a59f97",
                  marginBottom: "16px",
                  lineHeight: 1,
                }}>
                  {step.number}
                </div>
                <div style={{
                  fontFamily: "Inter, sans-serif",
                  fontWeight: 500,
                  fontSize: "16px",
                  color: "#000000",
                  marginBottom: "10px",
                }}>
                  {step.title}
                </div>
                <div style={{
                  fontFamily: "Inter, sans-serif",
                  fontWeight: 400,
                  fontSize: "14px",
                  color: "#777169",
                  lineHeight: 1.7,
                }}>
                  {step.description}
                </div>
              </div>

              {/* Connector line between steps (desktop only) */}
              {i < STEPS.length - 1 && (
                <div className="how-it-works-connector" />
              )}
            </React.Fragment>
          ))}
        </div>
      </div>

      {/* Callout strip */}
      <div style={{
        marginTop: "80px",
        background: "#fdfcfc",
        borderTop: "1px solid #e5e5e5",
        borderBottom: "1px solid #e5e5e5",
        padding: "20px 48px",
        textAlign: "center",
      }}>
        <p style={{
          fontFamily: "Inter, sans-serif",
          fontWeight: 400,
          fontSize: "15px",
          color: "#000000",
          margin: 0,
        }}>
          <span style={{ fontFamily: "'Geist Mono', monospace", fontWeight: 400 }}>2–4 weeks</span>
          {" "}— Live. We handle everything.
        </p>
      </div>

      <style>{`
        .how-it-works-steps {
          display: flex;
          flex-direction: row;
          align-items: flex-start;
          gap: 0;
        }
        .how-it-works-step {
          flex: 1;
          padding-right: 32px;
        }
        .how-it-works-connector {
          width: 1px;
          height: 80px;
          background: #e5e5e5;
          margin-top: 8px;
          flex-shrink: 0;
          margin-right: 32px;
        }
        @media (max-width: 768px) {
          .how-it-works-steps {
            flex-direction: column;
            gap: 40px;
          }
          .how-it-works-step {
            padding-right: 0;
          }
          .how-it-works-connector {
            display: none;
          }
        }
      `}</style>
    </section>
  );
}