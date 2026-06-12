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

export default function HowItWorksSection() {
  const sectionRef = useRef(null);
  const trackRef = useRef(null);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const onScroll = () => {
      const track = trackRef.current;
      if (!track) return;
      const rect = track.getBoundingClientRect();
      const trackHeight = track.offsetHeight;
      // Line starts filling when top of track hits center of viewport
      // Line is full when bottom of track hits center of viewport
      const viewportMid = window.innerHeight / 2;
      const scrolled = viewportMid - rect.top;
      const p = Math.max(0, Math.min(1, scrolled / trackHeight));
      setProgress(p);
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <section ref={sectionRef} style={{ background: "#fdfcfc", padding: "100px 48px" }}>
      <div style={{ maxWidth: "900px", margin: "0 auto" }}>

        {/* Header */}
        <div style={{ marginBottom: "64px" }}>
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

        {/* Cards + single continuous line */}
        <div ref={trackRef} style={{ position: "relative", display: "flex", flexDirection: "row", gap: "0" }}>

          {/* Line column */}
          <div style={{
            width: "60px",
            flexShrink: 0,
            position: "relative",
            display: "flex",
            justifyContent: "center",
          }}>
            {/* Track */}
            <div style={{
              position: "absolute",
              top: 0,
              bottom: 0,
              width: "2px",
              background: "#e0ddd9",
              borderRadius: "9999px",
              left: "50%",
              transform: "translateX(-50%)",
            }} />
            {/* Progress fill */}
            <div style={{
              position: "absolute",
              top: 0,
              width: "2px",
              height: `${progress * 100}%`,
              background: "#000000",
              borderRadius: "9999px",
              left: "50%",
              transform: "translateX(-50%)",
              transition: "height 0.08s linear",
            }} />
          </div>

          {/* Cards */}
          <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
            {STEPS.map((step, i) => (
              <div
                key={step.number}
                style={{
                  padding: "48px 0 48px 48px",
                  borderBottom: i < STEPS.length - 1 ? "none" : "none",
                  opacity: progress >= i / STEPS.length ? 1 : 0.3,
                  transition: "opacity 0.4s ease",
                }}
              >
                <span style={{
                  fontFamily: "'Geist Mono', monospace",
                  fontWeight: 400,
                  fontSize: "12px",
                  color: "#a59f97",
                  display: "block",
                  marginBottom: "16px",
                }}>
                  {step.number}
                </span>
                <h3 style={{
                  fontFamily: "'DM Sans', sans-serif",
                  fontWeight: 300,
                  fontSize: "clamp(1.5rem, 2.8vw, 2.25rem)",
                  color: "#000000",
                  letterSpacing: "-0.05em",
                  lineHeight: 1.15,
                  margin: "0 0 12px 0",
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
                  maxWidth: "520px",
                }}>
                  {step.description}
                </p>
              </div>
            ))}
          </div>
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
        @media (max-width: 640px) {
          section { padding: 64px 24px !important; }
        }
      `}</style>
    </section>
  );
}