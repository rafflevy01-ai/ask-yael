import React, { useEffect, useRef, useState } from "react";
import IosNotifCard from "@/components/IosNotifCard";
import { useLanguage } from "@/lib/LanguageContext";

const STEP_NUMBERS = ["01", "02", "03", "04", "05", "06"];
const STEP_COUNT = STEP_NUMBERS.length;

export default function HowItWorksSection() {
  const { t } = useLanguage();
  const STEPS = STEP_NUMBERS.map((number) => ({
    number,
    title: t.how.steps[number].title,
    description: t.how.steps[number].description,
  }));
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
    <section ref={sectionRef} id="how-it-works" data-how-works style={{ padding: "80px 40px", backgroundColor: "#FFFFFF", borderTop: "1px solid rgba(0,0,0,0.06)" }}>
      <div style={{ maxWidth: "1100px", margin: "0 auto" }}>

        {/* Header */}
        <div style={{ marginBottom: "32px", textAlign: "center" }}>
          <span style={{
            fontFamily: "Inter, sans-serif", fontSize: "11px", textTransform: "uppercase",
            letterSpacing: "0.12em", color: "#6B6B6B", display: "block", marginBottom: "12px",
          }}>{t.how.label}</span>
          <h2 style={{
            fontFamily: "Inter, sans-serif", fontWeight: 300,
                      fontSize: "clamp(2rem, 3.5vw, 2.25rem)", color: "#0D0D0D",
                      letterSpacing: "-0.04em", lineHeight: 1.2, margin: 0,
                    }}>{t.how.title}</h2>
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
                  position: "absolute", insetInlineStart: "0", top: 0, bottom: 0,
                  width: "1px", background: "rgba(0,0,0,0.06)", borderRadius: "9999px", zIndex: 0,
                }} />
                <div style={{
                  position: "absolute", insetInlineStart: "0", top: 0, width: "1px",
                  height: `${progress * 100}%`, maxHeight: "100%",
                  background: "#000000", borderRadius: "9999px", zIndex: 1,
                  transition: "height 0.08s linear",
                }} />
                {STEPS.map((step, i) => (
                  <div key={step.number} ref={(el) => (stepRefs.current[i] = el)}
                    style={{
                      padding: i === 0 ? "24px 0 56px" : "56px 0 56px",
                      paddingInlineStart: "48px",
                      opacity: progress >= i / STEP_COUNT ? 1 : 0.15,
                      transition: "opacity 0.7s ease",
                      position: "relative", zIndex: 2,
                    }}>
                    <span style={{
                      fontFamily: "Inter, sans-serif", fontWeight: 400, fontSize: "12px",
                      color: "#6B6B6B", display: "block", marginBottom: "16px",
                    }}>{step.number}</span>
                    <h3 style={{
                      fontFamily: "Inter, sans-serif", fontWeight: 400,
                      fontSize: "clamp(1.25rem, 2vw, 1.5rem)", color: "#0D0D0D",
                      letterSpacing: "-0.04em", lineHeight: 1.2, margin: "0 0 12px 0",
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
                      color: "#6B6B6B", display: "block", marginBottom: "12px",
                    }}>{t.how.stepLabel} {step.number}</span>
                    <h3 style={{
                      fontFamily: "Inter, sans-serif", fontWeight: 400,
                      fontSize: "1.4rem", color: "#0D0D0D", letterSpacing: "-0.04em",
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
          <span style={{ fontFamily: "Inter, sans-serif", fontWeight: 400 }}>{t.how.calloutBold}</span>
          {t.how.calloutRest}
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