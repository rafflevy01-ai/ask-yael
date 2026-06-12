import React, { useEffect, useRef, useState } from "react";
import IosNotifCard from "@/components/IosNotifCard";

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
  const leftPanelRef = useRef(null);
  const stepRefs = useRef([]);
  const hasAnimated = useRef(new Set());
  const maxStepRef = useRef(0);

  const [progress, setProgress] = useState(0);
  const [activeStep, setActiveStep] = useState(0);
  const [maxStepReached, setMaxStepReached] = useState(0);
  const [cardTops, setCardTops] = useState({});
  const [animatingSteps, setAnimatingSteps] = useState({});

  useEffect(() => {
    const onScroll = () => {
      const section = sectionRef.current;
      if (!section) return;
      const rect = section.getBoundingClientRect();
      const sectionHeight = section.offsetHeight;
      const viewportHeight = window.innerHeight;

      // Section-level progress (orange line)
      const triggerPoint = viewportHeight * 0.4;
      const start = viewportHeight - triggerPoint;
      const end = sectionHeight - triggerPoint;
      const scrolled = start - rect.top;
      const p = Math.max(0, Math.min(1, scrolled / end));
      setProgress(p);

      // Current active step from scroll position
      const newActiveStep = Math.min(3, Math.floor(p * 4));
      setActiveStep(newActiveStep);

      // Monotonic max — cards accumulate, never disappear
      const prevMax = maxStepRef.current;
      const newMax = Math.max(prevMax, newActiveStep);

      // Animate any newly-reached steps
      if (newMax > prevMax) {
        for (let i = prevMax + 1; i <= newMax; i++) {
          if (!hasAnimated.current.has(i)) {
            hasAnimated.current.add(i);
            setAnimatingSteps((prev) => ({ ...prev, [i]: true }));
            setTimeout(() => {
              setAnimatingSteps((prev) => {
                const next = { ...prev };
                delete next[i];
                return next;
              });
            }, 600);
          }
        }
      }

      // Step 0 is baseline — animate it on first meaningful scroll into section
      if (hasAnimated.current.size === 0 && p > 0.02) {
        hasAnimated.current.add(0);
        setAnimatingSteps((prev) => ({ ...prev, [0]: true }));
        setTimeout(() => {
          setAnimatingSteps((prev) => {
            const next = { ...prev };
            delete next[0];
            return next;
          });
        }, 600);
      }
      maxStepRef.current = newMax;
      setMaxStepReached(newMax);

      // Position each visible card aligned with its step
      const panel = leftPanelRef.current;
      if (panel) {
        const panelRect = panel.getBoundingClientRect();
        const tops = {};
        for (let i = 0; i <= newMax; i++) {
          const stepEl = stepRefs.current[i];
          if (stepEl) {
            const stepRect = stepEl.getBoundingClientRect();
            tops[i] = stepRect.top - panelRect.top;
          }
        }
        setCardTops(tops);
      }
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <section ref={sectionRef} data-how-works style={{ background: "#fdfcfc", padding: "100px 48px" }}>
      <div style={{ maxWidth: "1100px", margin: "0 auto" }}>

        {/* Header */}
        <div style={{ marginBottom: "64px", textAlign: "center" }}>
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

        {/* Two-column layout: LEFT = sticky animation cards, RIGHT = text steps */}
        <div className="how-layout" style={{ display: "flex", gap: "clamp(32px, 5vw, 80px)", alignItems: "flex-start" }}>

          {/* LEFT — Sticky panel with stacked animation cards */}
          <div ref={leftPanelRef} className="how-left" style={{
            width: "clamp(280px, 36vw, 340px)",
            flexShrink: 0,
            position: "sticky",
            top: "120px",
            alignSelf: "flex-start",
            minHeight: "calc(100vh - 120px)",
          }}>
            {Array.from({ length: maxStepReached + 1 }, (_, i) => (
              <IosNotifCard
                key={i}
                stepIndex={i}
                animate={!!animatingSteps[i]}
                cardStyle={{
                  position: "absolute",
                  top: `${cardTops[i] || 0}px`,
                  left: 0,
                  right: 0,
                  transition: "top 0.08s linear",
                }}
              />
            ))}
          </div>

          {/* RIGHT — Scrollable text steps */}
          <div className="how-right" style={{ flex: 1, minWidth: 0 }}>
            <div style={{ position: "relative" }}>
              {/* Vertical progress line */}
              <div style={{
                position: "absolute",
                left: "0",
                top: 0,
                bottom: 0,
                width: "1px",
                background: "#e0ddd9",
                borderRadius: "9999px",
                zIndex: 0,
              }} />
              <div style={{
                position: "absolute",
                left: "0",
                top: 0,
                width: "1px",
                height: `${progress * 100}%`,
                maxHeight: "100%",
                background: "#FF4500",
                borderRadius: "9999px",
                zIndex: 1,
                transition: "height 0.08s linear",
              }} />

              {STEPS.map((step, i) => (
                <div
                  key={step.number}
                  ref={(el) => (stepRefs.current[i] = el)}
                  style={{
                    padding: "56px 0 56px 48px",
                    opacity: progress >= i / STEPS.length ? 1 : 0.25,
                    transition: "opacity 0.4s ease",
                    position: "relative",
                    zIndex: 2,
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
      </div>

      {/* Callout strip */}
      <div className="how-callout" style={{
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
        @media (max-width: 768px) {
          [data-how-works] { padding: 48px 16px !important; }
          .how-layout { flex-direction: column !important; gap: 24px !important; }
          .how-left {
            position: relative !important;
            top: auto !important;
            width: 100% !important;
            max-width: 340px !important;
            margin: 0 auto !important;
            min-height: auto !important;
            order: -1 !important;
          }
          .how-left > div {
            position: relative !important;
            top: auto !important;
          }
          .how-right > div { padding: 0 !important; }
          .how-right > div > div { padding-left: 0 !important; padding-top: 32px !important; padding-bottom: 32px !important; }
          .how-right > div > div:first-child { padding-top: 16px !important; }
          .how-callout { padding: 16px 16px !important; margin-top: 48px !important; }
        }
        @media (max-width: 1024px) {
          [data-how-works] { padding: 64px 24px !important; }
        }
      `}</style>
    </section>
  );
}