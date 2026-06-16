import React from "react";

const VIDEO_URL = "https://media.base44.com/videos/public/6a2ab0818c0d050752d1521b/3f09837ab_Cinematic_background_video_12__Veo_31_59928.mp4";

export default function HeroSection() {
  return (
    <section
      data-hero-section
      style={{
        position: "relative",
        width: "100%",
        height: "100vh",          /* explicit height so children can use height:100% */
        overflow: "hidden",
      }}
    >
      {/* ── Video background ── */}
      <video
        autoPlay muted loop playsInline
        style={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
          objectFit: "cover",
          objectPosition: "center",
          zIndex: 0,
          pointerEvents: "none",
        }}
      >
        <source src={VIDEO_URL} type="video/mp4" />
      </video>

      {/* ── Gradient overlay — dark at bottom where text lives ── */}
      <div style={{
        position: "absolute",
        inset: 0,
        background: "linear-gradient(to bottom, rgba(0,0,0,0.08) 0%, rgba(0,0,0,0.25) 50%, rgba(0,0,0,0.72) 100%)",
        zIndex: 1,
        pointerEvents: "none",
      }} />

      {/* ── Content — pinned to bottom, Wonderful-style ── */}
      <div
        className="hero-inner"
        style={{
          position: "relative",
          zIndex: 2,
          height: "100%",
          maxWidth: "1280px",
          margin: "0 auto",
          padding: "0 56px 72px",
          display: "flex",
          flexDirection: "column",
          justifyContent: "flex-end",
        }}
      >
        <div
          className="hero-row"
          style={{
            display: "flex",
            alignItems: "flex-end",
            gap: "8%",
          }}
        >
          {/* LEFT — large title */}
          <div className="hero-left" style={{ flex: "0 0 52%", minWidth: 0 }}>
            <h1
              style={{
                fontFamily: "Inter, sans-serif",
                fontWeight: 300,
                fontSize: "clamp(2.4rem, 4.5vw, 4rem)",
                color: "#FFFFFF",
                letterSpacing: "-0.03em",
                lineHeight: 1.08,
                margin: 0,
              }}
            >
              Meet Yael.<br />
              Your front desk<br />
              on autopilot.
            </h1>
          </div>

          {/* RIGHT — description + CTAs */}
          <div className="hero-right" style={{ flex: "0 0 36%", minWidth: 0 }}>
            <p
              style={{
                fontFamily: "Inter, sans-serif",
                fontWeight: 400,
                fontSize: "15px",
                color: "rgba(255,255,255,0.72)",
                lineHeight: 1.65,
                margin: "0 0 28px 0",
              }}
            >
              Yael answers every call in Hebrew, French, or English —
              booking appointments, registering new patients, and handling
              emergencies, 24/7, so your team never has to.
            </p>

            <div className="hero-cta-row" style={{ display: "flex", gap: "12px" }}>
              <a
                href="#book-demo"
                style={{
                  fontFamily: "Inter, sans-serif",
                  fontWeight: 500,
                  fontSize: "14px",
                  color: "#000000",
                  backgroundColor: "#FFFFFF",
                  borderRadius: "999px",
                  padding: "13px 28px",
                  display: "inline-flex",
                  alignItems: "center",
                  textDecoration: "none",
                  cursor: "pointer",
                  transition: "opacity 0.15s ease",
                  whiteSpace: "nowrap",
                }}
                onMouseEnter={e => e.currentTarget.style.opacity = "0.85"}
                onMouseLeave={e => e.currentTarget.style.opacity = "1"}
              >
                Book a Free Demo
              </a>

              <a
                href="#how-it-works"
                style={{
                  fontFamily: "Inter, sans-serif",
                  fontWeight: 400,
                  fontSize: "14px",
                  color: "rgba(255,255,255,0.85)",
                  backgroundColor: "transparent",
                  borderRadius: "999px",
                  padding: "13px 28px",
                  display: "inline-flex",
                  alignItems: "center",
                  textDecoration: "none",
                  border: "1px solid rgba(255,255,255,0.35)",
                  cursor: "pointer",
                  transition: "opacity 0.15s ease",
                  whiteSpace: "nowrap",
                }}
                onMouseEnter={e => e.currentTarget.style.opacity = "0.7"}
                onMouseLeave={e => e.currentTarget.style.opacity = "1"}
              >
                See How It Works
              </a>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        /* ── Mobile ── */
        @media (max-width: 768px) {
          .hero-inner {
            padding: 0 24px 56px !important;
          }
          .hero-row {
            flex-direction: column !important;
            align-items: flex-start !important;
            gap: 20px !important;
          }
          .hero-left, .hero-right {
            flex: none !important;
            width: 100% !important;
          }
          .hero-left h1 {
            font-size: clamp(2rem, 8vw, 2.6rem) !important;
          }
          .hero-cta-row {
            flex-direction: row !important;
            gap: 10px !important;
          }
          .hero-cta-row a {
            flex: 1 !important;
            justify-content: center !important;
            font-size: 13px !important;
            padding: 11px 16px !important;
          }
        }

        /* ── iPad / tablet ── */
        @media (min-width: 769px) and (max-width: 1024px) {
          .hero-inner { padding: 0 40px 64px !important; }
          .hero-left h1 { font-size: clamp(2.2rem, 4vw, 3rem) !important; }
        }
      `}</style>
    </section>
  );
}
