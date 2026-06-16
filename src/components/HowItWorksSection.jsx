import React, { useEffect, useRef, useState } from "react";
import IosNotifCard from "@/components/IosNotifCard";

const STEPS = [
  { number: "01", title: "Call Received",
    description: "Yael answers instantly in the caller's language. No menu, no hold music, no voicemail." },
  { number: "02", title: "Patient Identified",
    description: "Returning patients are recognized by phone number before they speak. New patients are registered on the spot." },
  { number: "03", title: "Request Handled",
    description: "Booking, triage, intake, modification, or cancellation — resolved in one call. Every action writes directly to the booking system." },
  { number: "04", title: "CRM Updated",
    description: "Every booking and patient change is synced directly to your clinic management system. No manual data entry." },
  { number: "05", title: "Team Notified",
    description: "Your staff gets an SMS for every action Yael takes. If she can't handle it, she transfers the call with a full summary." },
];

const STEP_COUNT = STEPS.length;

export default function HowItWorksSection() {
  const sectionRef = useRef(null);
  const cardsPanelRef = useRef(null);
  const stepRefs = useRef([]);
  const hasScrolled = useRef(false);

  const [progress, setProgress] = useState(0);
  const [cardTops, setCardTops] = useState({});

  useEffect(() => {
    const onScroll = () => {
      const section = sectionRef.current;
      if (!section) return;
      const rect = section.getBoundingClientRect();
      const sectionHeight = section.offsetHeight;
      const viewportHeight = window.innerHeight;
      const mobile = window.innerWidth < 768;

      const triggerPoint = viewportHeight * 0.4;
      const start = viewportHeight - triggerPoint;
      const end = sectionHeight - triggerPoint;
      const scrolled = start - rect.top;
      const p = Math.max(0, Math.min(1, scrolled / end));
      setProgress(p);

      // Desktop: align cards to headings
      if (!mobile) {
        const panel = cardsPanelRef.current;
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
    <section ref={sectionRef} data-how-works style={{ padding: "80px 40px" }}>
      <div style={{ maxWidth: "1100px", margin: "0 auto" }}>

        {/* Header */}
        <div style={{ marginBottom: "32px", textAlign: "center" }}>
          <span style={{
            fontFamily: "Inter, sans-serif", fontSize: "11px", textTransform: "uppercase",
            letterSpacing: "0.12em", color: "#888888", display: "block", marginBottom: "12px",
          }}>How it works</span>
          <h2 style={{
            fontFamily: "Inter, sans-serif", fontWeight: 300,
                      fontSize: "clamp(2rem, 3.5vw, 2.25rem)", color: "#0D0D0D",
                      letterSpacing: "-0.02em", lineHeight: 1.2, margin: 0,
                    }}>How Yael works.</h2>
        </div>

        {/* ── DESKTOP ── */}
        <div className="how-desktop">
          <div style={{ display: "flex", gap: "clamp(32px, 5vw, 80px)", alignItems: "flex-start" }}>

            {/* LEFT — Sticky card panel */}
            <div ref={cardsPanelRef} style={{
              width: "clamp(280px, 36vw, 340px)", flexShrink: 0, position: "sticky",
              top: "120px", alignSelf: "flex-start", minHeight: "calc(100vh - 120px)",
            }}>
              {STEPS.map((_, i) => {
                const visible = progress >= i / STEP_COUNT;
                return (
                  <IosNotifCard
                    key={i}
                    stepIndex={i}
                    visible={visible}
                    cardStyle={{
                      position: "absolute",
                      top: `${cardTops[i] || 0}px`,
                      left: 0, right: 0,
                    }}
                  />
                );
              })}
            </div>

            {/* RIGHT — Text steps + progress line */}
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ position: "relative" }}>
                <div style={{
                  position: "absolute", left: "0", top: 0, bottom: 0,
                  width: "1px", background: "rgba(0,0,0,0.06)", borderRadius: "9999px", zIndex: 0,
                }} />
                <div style={{
                  position: "absolute", left: "0", top: 0, width: "1px",
                  height: `${progress * 100}%`, maxHeight: "100%",
                  background: "#000000", borderRadius: "9999px", zIndex: 1,
                  transition: "height 0.08s linear",
                }} />
                {STEPS.map((step, i) => (
                  <div key={step.number} ref={(el) => (stepRefs.current[i] = el)}
                    style={{
                      padding: i === 0 ? "24px 0 56px 48px" : "56px 0 56px 48px",
                      opacity: progress >= i / STEP_COUNT ? 1 : 0.15,
                      transition: "opacity 0.7s ease",
                      position: "relative", zIndex: 2,
                    }}>
                    <span style={{
                      fontFamily: "Inter, sans-serif", fontWeight: 400, fontSize: "12px",
                      color: "#888888", display: "block", marginBottom: "16px",
                    }}>{step.number}</span>
                    <h3 style={{
                      fontFamily: "Inter, sans-serif", fontWeight: 400,
                      fontSize: "clamp(1.25rem, 2vw, 1.5rem)", color: "#0D0D0D",
                      letterSpacing: "-0.02em", lineHeight: 1.2, margin: "0 0 12px 0",
                    }}>{step.title}</h3>
                    <p style={{
                      fontFamily: "Inter, sans-serif", fontWeight: 400, fontSize: "15px",
                      color: "#555555", lineHeight: 1.65, margin: 0, maxWidth: "520px",
                    }}>{step.description}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* ── MOBILE ── */}
        <div className="how-mobile">
          <div style={{ position: "relative", paddingLeft: "28px" }}>
            {/* Progress tracks */}
            <div style={{
              position: "absolute", left: "8px", top: 0, bottom: 0,
              width: "1px", background: "rgba(0,0,0,0.06)", borderRadius: "9999px", zIndex: 0,
            }} />
            <div style={{
              position: "absolute", left: "8px", top: 0, width: "1px",
              height: `${progress * 100}%`, maxHeight: "100%",
              background: "#000000", borderRadius: "9999px", zIndex: 1,
              transition: "height 0.08s linear",
            }} />
            {STEPS.map((step, i) => {
              const visible = progress >= i / STEP_COUNT;
              return (
                <div key={step.number}
                  style={{
                    padding: i === 0 ? "12px 0 48px 0" : "32px 0 48px 0",
                  }}>
                  <div style={{
                    opacity: visible ? 1 : 0.12,
                    transition: "opacity 0.7s ease",
                  }}>
                    <span style={{
                      fontFamily: "Inter, sans-serif", fontWeight: 500, fontSize: "11px",
                      textTransform: "uppercase", letterSpacing: "0.1em",
                      color: "#888888", display: "block", marginBottom: "12px",
                    }}>Step {step.number}</span>
                    <h3 style={{
                      fontFamily: "Inter, sans-serif", fontWeight: 400,
                      fontSize: "1.4rem", color: "#0D0D0D", letterSpacing: "-0.02em",
                      lineHeight: 1.15, margin: "0 0 8px 0",
                    }}>{step.title}</h3>
                    <p style={{
                      fontFamily: "Inter, sans-serif", fontWeight: 400, fontSize: "15px",
                      color: "#555555", lineHeight: 1.6, margin: "0 0 20px 0",
                    }}>{step.description}</p>
                  </div>
                  <div style={{ maxWidth: "340px", margin: "0 auto" }}>
                    <IosNotifCard
                      stepIndex={i}
                      visible={true}
                      cardStyle={{}}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Callout */}
      <div className="how-callout" style={{
        marginTop: "80px", borderTop: "1px solid rgba(0,0,0,0.08)", borderBottom: "1px solid rgba(0,0,0,0.08)",
        padding: "20px 40px", textAlign: "center",
      }}>
        <p style={{ fontFamily: "Inter, sans-serif", fontWeight: 400, fontSize: "15px", color: "#0D0D0D", margin: 0 }}>
          <span style={{ fontFamily: "Inter, sans-serif", fontWeight: 400 }}>2–4 weeks</span>
          {" "}— Live. We handle everything.
        </p>
      </div>

      <style>{`
        .how-mobile { display: none; }
        @media (max-width: 768px) {
          [data-how-works] { padding: 56px 20px !important; }
          [data-how-works] h2 { font-size: 1.6rem !important; text-align: center !important; }
          [data-how-works] h3 { font-size: 1.1rem !important; }
          [data-how-works] p  { font-size: 14px !important; }
          .how-desktop { display: none !important; }
          .how-mobile { display: block !important; }
          .how-callout { padding: 16px 16px !important; margin-top: 48px !important; }
        }
        @media (max-width: 1024px) {
          [data-how-works] { padding: 64px 32px !important; }
        }
      `}</style>
    </section>
  );
}