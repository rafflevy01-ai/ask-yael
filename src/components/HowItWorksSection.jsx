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

function StepCard({ step, index, isVisible }) {
  return (
    <div
      style={{
        flex: 1,
        display: "flex",
        flexDirection: "row",
        alignItems: "stretch",
        gap: "24px",
        background: "#ffffff",
        borderRadius: "20px",
        padding: "28px 24px",
        boxShadow: "rgba(0,0,0,0.4) 0px 0px 1px 0px, rgba(0,0,0,0.04) 0px 2px 8px 0px",
        opacity: isVisible ? 1 : 0,
        transform: isVisible ? "translateY(0)" : "translateY(20px)",
        transition: `opacity 0.5s ease ${index * 0.1}s, transform 0.5s ease ${index * 0.1}s`,
      }}
    >
      {/* Left column: number + progress bar */}
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "12px", flexShrink: 0 }}>
        <span style={{
          fontFamily: "'Geist Mono', monospace",
          fontWeight: 400,
          fontSize: "13px",
          color: "#a59f97",
          lineHeight: 1,
        }}>
          {step.number}
        </span>
        {/* Progress bar track */}
        <div style={{
          width: "2px",
          flex: 1,
          background: "#e5e5e5",
          borderRadius: "9999px",
          position: "relative",
          overflow: "hidden",
          minHeight: "60px",
        }}>
          <div style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            background: "#000000",
            borderRadius: "9999px",
            height: isVisible ? "100%" : "0%",
            transition: `height 0.7s cubic-bezier(0.22,1,0.36,1) ${index * 0.15 + 0.3}s`,
          }} />
        </div>
      </div>

      {/* Right column: title + description */}
      <div style={{ display: "flex", flexDirection: "column", justifyContent: "center", gap: "8px" }}>
        <div style={{
          fontFamily: "'DM Sans', sans-serif",
          fontWeight: 300,
          fontSize: "clamp(1.1rem, 1.8vw, 1.35rem)",
          color: "#000000",
          letterSpacing: "-0.03em",
          lineHeight: 1.2,
        }}>
          {step.title}
        </div>
        <div style={{
          fontFamily: "Inter, sans-serif",
          fontWeight: 400,
          fontSize: "14px",
          color: "#777169",
          lineHeight: 1.65,
        }}>
          {step.description}
        </div>
      </div>
    </div>
  );
}

export default function HowItWorksSection() {
  const sectionRef = useRef(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setIsVisible(true); },
      { threshold: 0.15 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section ref={sectionRef} style={{ background: "#fdfcfc", padding: "100px 48px" }}>
      <div style={{ maxWidth: "1100px", margin: "0 auto" }}>

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

        {/* Step cards grid */}
        <div className="how-it-works-grid">
          {STEPS.map((step, i) => (
            <StepCard key={step.number} step={step} index={i} isVisible={isVisible} />
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

        .how-it-works-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 16px;
        }
        @media (max-width: 900px) {
          .how-it-works-grid {
            grid-template-columns: repeat(2, 1fr);
          }
        }
        @media (max-width: 560px) {
          .how-it-works-grid {
            grid-template-columns: 1fr;
          }
          section {
            padding: 64px 24px !important;
          }
        }
      `}</style>
    </section>
  );
}