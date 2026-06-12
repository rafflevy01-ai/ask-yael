import React, { useEffect, useRef, useState } from "react";

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

function StepCard({ step, index }) {
  const cardRef = useRef(null);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const card = cardRef.current;
    if (!card) return;

    const onScroll = () => {
      const rect = card.getBoundingClientRect();
      const windowH = window.innerHeight;
      // Progress goes 0→1 as the card scrolls from entering viewport to leaving
      const p = Math.max(0, Math.min(1, (windowH - rect.top) / (windowH + rect.height)));
      setProgress(p);
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div
      ref={cardRef}
      style={{
        display: "flex",
        flexDirection: "row",
        alignItems: "stretch",
        background: "#f5f3f0",
        borderRadius: "20px",
        padding: "40px 40px",
        gap: "0px",
        minHeight: "200px",
      }}
    >
      {/* Step number — left side */}
      <div style={{
        width: "140px",
        flexShrink: 0,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}>
        <span style={{
          fontFamily: "'Geist Mono', monospace",
          fontWeight: 400,
          fontSize: "clamp(2.5rem, 5vw, 4rem)",
          color: "#a59f97",
          lineHeight: 1,
        }}>
          {step.number}
        </span>
      </div>

      {/* Vertical progress bar — center */}
      <div style={{
        width: "4px",
        flexShrink: 0,
        background: "#e0ddd9",
        borderRadius: "9999px",
        position: "relative",
        margin: "0 40px",
        overflow: "hidden",
      }}>
        <div style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: `${progress * 100}%`,
          background: "#000000",
          borderRadius: "9999px",
          transition: "height 0.05s linear",
        }} />
      </div>

      {/* Content — right side */}
      <div style={{
        flex: 1,
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        gap: "12px",
      }}>
        <h3 style={{
          fontFamily: "'DM Sans', sans-serif",
          fontWeight: 300,
          fontSize: "clamp(1.5rem, 2.8vw, 2.25rem)",
          color: "#000000",
          letterSpacing: "-0.05em",
          lineHeight: 1.15,
          margin: 0,
        }}>
          {step.title}
        </h3>
        <p style={{
          fontFamily: "Inter, sans-serif",
          fontWeight: 400,
          fontSize: "15px",
          color: "#777169",
          lineHeight: 1.65,
          margin: 0,
        }}>
          {step.description}
        </p>
      </div>
    </div>
  );
}

export default function HowItWorksSection() {
  return (
    <section style={{ background: "#fdfcfc", padding: "100px 48px" }}>
      <div style={{ maxWidth: "900px", margin: "0 auto" }}>

        {/* Header */}
        <div style={{ marginBottom: "48px" }}>
          <span style={{
            fontFamily: "'Geist Mono', monospace",
            fontSize: "11px",
            textTransform: "uppercase",
            letterSpacing: "0.12em",
            color: "#a59f97",
            display: "block",
            marginBottom: "12px",
          }}>
            How it works
          </span>
          <h2 style={{
            fontFamily: "'DM Sans', sans-serif",
            fontWeight: 300,
            fontSize: "clamp(1.5rem, 2.8vw, 2.25rem)",
            color: "#000000",
            letterSpacing: "-0.05em",
            lineHeight: 1.1,
            margin: 0,
          }}>
            How Yael works.
          </h2>
        </div>

        {/* Stacked step cards */}
        <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
          {STEPS.map((step, i) => (
            <StepCard key={step.number} step={step} index={i} />
          ))}
        </div>

      </div>

      {/* Callout strip */}
      <div style={{
        marginTop: "80px",
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
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300&family=Geist+Mono:wght@400&display=swap');
        @media (max-width: 640px) {
          section { padding: 64px 24px !important; }
        }
      `}</style>
    </section>
  );
}