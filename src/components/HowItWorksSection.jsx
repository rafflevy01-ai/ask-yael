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

const STEP_COUNT = STEPS.length;

export default function HowItWorksSection() {
  const sectionRef = useRef(null);
  const leftPanelRef = useRef(null);
  const stepRefs = useRef([]);
  const hasAnimated = useRef(new Set());
  const hasScrolled = useRef(false);
  const [isMobile, setIsMobile] = useState(false);

  const [progress, setProgress] = useState(0);
  const [activeStep, setActiveStep] = useState(0);
  const [cardTops, setCardTops] = useState({});
  const [animatingSteps, setAnimatingSteps] = useState({});

  useEffect(() => {
    setIsMobile(window.innerWidth < 768);

    const onScroll = () => {
      const section = sectionRef.current;
      if (!section) return;
      const rect = section.getBoundingClientRect();
      const sectionHeight = section.offsetHeight;
      const viewportHeight = window.innerHeight;

      // Section-level progress
      const triggerPoint = viewportHeight * 0.4;
      const start = viewportHeight - triggerPoint;
      const end = sectionHeight - triggerPoint;
      const scrolled = start - rect.top;
      const p = Math.max(0, Math.min(1, scrolled / end));
      setProgress(p);

      const newActiveStep = Math.min(STEP_COUNT - 1, Math.floor(p * STEP_COUNT));
      setActiveStep(newActiveStep);

      // Only animate on real scroll
      if (hasScrolled.current) {
        for (let i = 0; i < STEP_COUNT; i++) {
          const visible = p >= i / STEP_COUNT;
          if (visible && !hasAnimated.current.has(i)) {
            hasAnimated.current.add(i);
            setAnimatingSteps((prev) => ({ ...prev, [i]: true }));
            setTimeout(() => {
              setAnimatingSteps((prev) => {
                const next = { ...prev };
                delete next[i];
                return next;
              });
            }, 700);
          }
        }
      }

      // Position cards aligned with headings (desktop only)
      if (!isMobile) {
        const panel = leftPanelRef.current;
        if (panel) {
          const panelRect = panel.getBoundingClientRect();
          const tops = {};
          for (let i = 0; i < STEP_COUNT; i++) {
            const stepEl = stepRefs.current[i];
            if (stepEl) {
              const heading = stepEl.querySelector("h3");
              if (heading) {
                const headingRect = heading.getBoundingClientRect();
                tops[i] = headingRect.top - panelRect.top - 8;
              }
            }
          }
          setCardTops(tops);
        }
      }
    };

    const onRealScroll = () => {
      hasScrolled.current = true;
      onScroll();
    };

    window.addEventListener("scroll", onRealScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onRealScroll);
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

        {/* Desktop: two-column layout */}
        <div className="how-layout" style={{ display: "flex", gap: "clamp(32px, 5vw, 80px)", alignItems: "flex-start" }}>

          {/* LEFT — Sticky panel (desktop) or inline column (mobile) */}
          <div ref={leftPanelRef} className="how-left" style={{
            width: "clamp(280px, 36vw, 340px)",
            flexShrink: 0,
            position: "sticky",
            top: "120px",
            alignSelf: "flex-start",
            minHeight: "calc(100vh - 120px)",
          }}>
            {STEPS.map((_, i) => {
              const visible = progress >= i / STEP_COUNT;

              if (isMobile) {
                // Mobile: stacked vertically, not absolute
                return (
                  <div key={i} style={{ marginBottom: i < STEP_COUNT - 1 ? "16px" : 0 }}>
                    <IosNotifCard
                      stepIndex={i}
                      visible={visible}
                      animate={!!animatingSteps[i]}
                      cardStyle={{}}
                    />
                  </div>
                );
              }

              // Desktop: absolute positioning in sticky panel
              return (
                <IosNotifCard
                  key={i}
                  stepIndex={i}
                  visible={visible}
                  animate={!!animatingSteps[i]}
                  cardStyle={{
                    position: "absolute",
                    top: `${cardTops[i] || 0}px`,
                    left: 0,
                    right: 0,
                  }}
                />
              );
            })}
          </div>

          {/* RIGHT — Text steps */}
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
                    opacity: progress >= i / STEP_COUNT ? 1 : 0.25,
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