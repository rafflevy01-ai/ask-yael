import React, { useState, useRef, useEffect } from "react";

const VIDEO_URL = "https://media.base44.com/videos/public/6a2ab0818c0d050752d1521b/3f09837ab_Cinematic_background_video_12__Veo_31_59928.mp4";

export default function HeroSection() {
  const [activeLang, setActiveLang] = useState("he");
  const videoRef = useRef(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const play = () => { video.play().catch(() => {}); };
    play();

    // Some mobile browsers need a second attempt after a short delay
    const timer = setTimeout(play, 300);
    return () => clearTimeout(timer);
  }, []);

  return (
    <section
      data-hero-section
      className="hero-section-root"
      style={{
        position: "relative",
        width: "100%",
        overflow: "hidden",
        /* height set in CSS so we can use dvh with vh fallback */
      }}
    >
      {/* ── Video ── */}
      <video
        ref={videoRef}
        src={VIDEO_URL}
        muted loop playsInline
        preload="auto"
        style={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
          objectFit: "cover",
          objectPosition: "center top",
          zIndex: 0,
          pointerEvents: "none",
        }}
      />

      {/* ── Gradient overlay ── */}
      <div style={{
        position: "absolute",
        inset: 0,
        background: "linear-gradient(to bottom, rgba(0,0,0,0.28) 0%, rgba(0,0,0,0.5) 55%, rgba(0,0,0,0.85) 100%)",
        zIndex: 1,
        pointerEvents: "none",
      }} />

      {/* ── Content ── */}
      <div className="hero-inner" style={{
        position: "relative",
        zIndex: 2,
        height: "100%",
        maxWidth: "1280px",
        margin: "0 auto",
        display: "flex",
        flexDirection: "column",
        justifyContent: "flex-end",
      }}>

        {/* Desktop / tablet: two-column row */}
        <div className="hero-row" style={{
          display: "flex",
          alignItems: "flex-end",
          gap: "8%",
        }}>

          {/* LEFT — title */}
          <div className="hero-left" style={{ flex: "0 0 52%", minWidth: 0 }}>
            <h1 className="hero-h1" style={{
              fontFamily: "Inter, sans-serif",
              fontWeight: 300,
              fontSize: "clamp(2rem, 2.8vw, 3.2rem)",
              color: "#FFFFFF",
              letterSpacing: "-0.04em",
              lineHeight: 1.22,
              margin: 0,
            }}>
              Meet Yael.<br />
              Your front desk on autopilot.
            </h1>
          </div>

          {/* RIGHT — description + CTAs (hidden on mobile) */}
          <div className="hero-right" style={{ flex: "0 0 36%", minWidth: 0 }}>
            <p style={{
              fontFamily: "Inter, sans-serif",
              fontWeight: 400,
              fontSize: "15px",
              color: "rgba(255,255,255,0.72)",
              lineHeight: 1.65,
              margin: "0 0 28px 0",
            }}>
              Yael answers every call in Hebrew, French, or English —
              booking appointments, registering new patients, and handling
              emergencies, 24/7, so your team never has to.
            </p>

            <div className="hero-cta-row" style={{ display: "flex", gap: "12px" }}>
              <a href="#book-demo" className="hero-btn-primary"
                style={{
                  fontFamily: "Inter, sans-serif", fontWeight: 500, fontSize: "14px",
                  color: "#000000", backgroundColor: "#FFFFFF", borderRadius: "999px",
                  padding: "13px 28px", display: "inline-flex", alignItems: "center",
                  textDecoration: "none", cursor: "pointer", whiteSpace: "nowrap",
                  transition: "opacity 0.15s ease",
                }}
                onMouseEnter={e => e.currentTarget.style.opacity="0.85"}
                onMouseLeave={e => e.currentTarget.style.opacity="1"}
              >Book a Free Demo</a>

              <a href="#how-it-works" className="hero-btn-secondary"
                style={{
                  fontFamily: "Inter, sans-serif", fontWeight: 400, fontSize: "14px",
                  color: "rgba(255,255,255,0.88)", backgroundColor: "transparent",
                  borderRadius: "999px", padding: "13px 28px",
                  display: "inline-flex", alignItems: "center", textDecoration: "none",
                  border: "1px solid rgba(255,255,255,0.35)", cursor: "pointer",
                  whiteSpace: "nowrap", transition: "opacity 0.15s ease",
                }}
                onMouseEnter={e => e.currentTarget.style.opacity="0.7"}
                onMouseLeave={e => e.currentTarget.style.opacity="1"}
              >See How It Works</a>
            </div>
          </div>
        </div>

        {/* Mobile-only: language + description + CTAs */}
        <div className="hero-mobile-block" style={{ display: "none" }}>
          {/* Language indicator — core differentiator, shows what Yael speaks */}
          <div className="hero-lang-row">
            {[
              { key: "en", label: "EN" },
              { key: "fr", label: "FR" },
              { key: "he", label: "עב" },
            ].map(({ key, label }) => {
              const isActive = activeLang === key;
              return (
                <button
                  key={key}
                  onClick={() => setActiveLang(key)}
                  style={{
                    fontFamily: "Inter, sans-serif", fontWeight: 500, fontSize: "11px",
                    color: isActive ? "#000000" : "rgba(255,255,255,0.85)",
                    letterSpacing: "0.06em",
                    background: isActive ? "#FFFFFF" : "rgba(255,255,255,0.1)",
                    backdropFilter: "blur(8px)",
                    border: isActive ? "1px solid rgba(255,255,255,0.8)" : "1px solid rgba(255,255,255,0.25)",
                    borderRadius: "9999px",
                    padding: "4px 12px",
                    cursor: "pointer",
                    transition: "all 0.2s ease",
                  }}
                >{label}</button>
              );
            })}
          </div>

          {/* Description */}
          <p className="hero-desc-mobile">
            Yael answers every call in Hebrew, French, or English —
            booking appointments and handling emergencies, 24/7.
          </p>

          {/* CTAs */}
          <div className="hero-cta-mobile-row">
          <a href="#book-demo"
            style={{
              fontFamily: "Inter, sans-serif", fontWeight: 500, fontSize: "14px",
              color: "#000000", backgroundColor: "#FFFFFF", borderRadius: "999px",
              padding: "13px 0", display: "flex", alignItems: "center",
              justifyContent: "center", textDecoration: "none", cursor: "pointer",
              flex: 1,
            }}
          >Book a Free Demo</a>
          <a href="#how-it-works"
            style={{
              fontFamily: "Inter, sans-serif", fontWeight: 400, fontSize: "14px",
              color: "rgba(255,255,255,0.88)", backgroundColor: "transparent",
              borderRadius: "999px", padding: "13px 0",
              display: "flex", alignItems: "center", justifyContent: "center",
              textDecoration: "none", border: "1px solid rgba(255,255,255,0.35)",
              cursor: "pointer", flex: 1,
            }}
          >See How It Works</a>
          </div>{/* end hero-cta-mobile-row */}
        </div>{/* end hero-mobile-block */}

      </div>

      <style>{`
        /* ── Section height: dvh with vh fallback ── */
        .hero-section-root {
          height: 100vh;
          height: 100dvh;
          min-height: 580px;
        }

        /* ── Desktop inner padding scales with viewport ── */
        .hero-inner {
          padding: 0 56px calc(8vh + 20px);
        }

        /* ── iPad portrait (769–1024) ── */
        @media (min-width: 769px) and (max-width: 1024px) {
          .hero-inner  { padding: 0 40px calc(7vh + 20px) !important; }
          .hero-h1     { font-size: clamp(1.8rem, 3vw, 2.5rem) !important; }
          .hero-right p { font-size: 14px !important; }
        }

        /* ── Mobile (≤768px) ── */
        @media (max-width: 768px) {
          .hero-inner {
            padding: 0 22px calc(env(safe-area-inset-bottom, 0px) + 44px) !important;
          }
          .hero-row       { flex-direction: column !important; align-items: flex-start !important; gap: 0 !important; }
          .hero-left      { flex: none !important; width: 100% !important; }
          .hero-right     { display: none !important; }
          .hero-h1        { font-size: clamp(1.75rem, 7.5vw, 2.2rem) !important; margin-bottom: 20px !important; }

          /* Mobile block: lang + desc + CTAs */
          .hero-mobile-block {
            display: flex !important;
            flex-direction: column !important;
            gap: 14px !important;
            width: 100% !important;
          }
          .hero-lang-row {
            display: flex !important;
            gap: 8px !important;
          }
          .hero-desc-mobile {
            font-family: Inter, sans-serif !important;
            font-weight: 400 !important;
            font-size: 14px !important;
            color: rgba(255,255,255,0.72) !important;
            line-height: 1.55 !important;
            margin: 0 !important;
          }
          .hero-cta-mobile-row {
            display: flex !important;
            gap: 10px !important;
            width: 100% !important;
          }
        }

        /* ── Very small phones (≤375px) ── */
        @media (max-width: 375px) {
          .hero-h1 { font-size: 1.65rem !important; }
          .hero-inner { padding-bottom: calc(env(safe-area-inset-bottom, 0px) + 44px) !important; }
        }
      `}</style>
    </section>
  );
}