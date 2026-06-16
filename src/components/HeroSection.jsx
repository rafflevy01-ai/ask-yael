import React from "react";

export default function HeroSection() {

  return (
    <section
      style={{
        position: "relative",
        width: "100%",
        minHeight: "100vh",
        paddingBottom: "0px",
        overflow: "hidden",
      }}>

      {/* Video background */}
      <video
        autoPlay
        muted
        loop
        playsInline
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          objectFit: "cover",
          zIndex: 0,
          pointerEvents: "none",
        }}
      >
        <source src="https://media.base44.com/videos/public/6a2ab0818c0d050752d1521b/3f09837ab_Cinematic_background_video_12__Veo_31_59928.mp4" type="video/mp4" />
      </video>

      {/* Dark gradient overlay for text readability */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: "linear-gradient(180deg, rgba(0,0,0,0.72) 0%, rgba(0,0,0,0.55) 40%, rgba(0,0,0,0.35) 100%)",
          zIndex: 1,
          pointerEvents: "none",
        }}
      />

      <div className="hero-inner" style={{ position: "relative", zIndex: 2, maxWidth: "1200px", margin: "0 auto", padding: "80px 40px 0" }}>

        {/* ─── TWO-COLUMN ROW ─── */}
        <div
          className="hero-row"
          style={{
            display: "flex",
            gap: "5%",
            alignItems: "flex-start",
          }}>

          {/* LEFT — headline + buttons */}
          <div className="hero-left" style={{ flex: "0 0 60%", minWidth: 0 }}>
            <h1
              style={{
                fontFamily: "Inter, sans-serif",
                fontWeight: 300,
                fontSize: "clamp(2rem, 3vw, 2.75rem)",
                color: "#FFFFFF",
                letterSpacing: "-0.03em",
                lineHeight: 1.12,
                margin: 0,
              }}>
              Meet Yael.<br />
              Your front desk on autopilot.
            </h1>

            <div className="hero-cta-row" style={{ display: "flex", gap: "16px", marginTop: "28px" }}>
              <a
                href="#book-demo"
                style={{
                  fontFamily: "Inter, sans-serif",
                  fontWeight: 400,
                  fontSize: "15px",
                  color: "#FFFFFF",
                  backgroundColor: "#000000",
                  borderRadius: "999px",
                  padding: "14px 36px",
                  display: "inline-flex",
                  alignItems: "center",
                  textDecoration: "none",
                  border: "none",
                  cursor: "pointer",
                  minWidth: "200px",
                  justifyContent: "center",
                  transition: "opacity 0.15s ease",
                }}
                onMouseEnter={e => e.currentTarget.style.opacity = "0.85"}
                onMouseLeave={e => e.currentTarget.style.opacity = "1"}>
                Book a Free Demo
              </a>

              <a
                href="#how-it-works"
                style={{
                  fontFamily: "Inter, sans-serif",
                  fontWeight: 400,
                  fontSize: "15px",
                  color: "rgba(255, 255, 255, 0.85)",
                  backgroundColor: "transparent",
                  borderRadius: "999px",
                  padding: "14px 36px",
                  display: "inline-flex",
                  alignItems: "center",
                  textDecoration: "none",
                  border: "1.5px solid rgba(255, 255, 255, 0.4)",
                  cursor: "pointer",
                  minWidth: "200px",
                  justifyContent: "center",
                  transition: "opacity 0.15s ease",
                }}
                onMouseEnter={e => e.currentTarget.style.opacity = "0.7"}
                onMouseLeave={e => e.currentTarget.style.opacity = "1"}>
                See How It Works
              </a>
            </div>
          </div>

          {/* RIGHT — description */}
          <div className="hero-right" style={{ flex: "0 0 35%", minWidth: 0, alignSelf: "flex-end" }}>
            <p
              style={{
                fontFamily: "Inter, sans-serif",
                fontWeight: 400,
                fontSize: "16px",
                color: "rgba(255, 255, 255, 0.75)",
                lineHeight: 1.6,
                margin: 0,
              }}>
              Yael answers every call in Hebrew, French, or English — booking appointments,
              registering new patients, and handling emergencies, 24/7, so your team never has to.
            </p>
          </div>
        </div>

      </div>

      <style>{`
        @media (max-width: 768px) {
          .hero-inner { padding: 100px 16px 0 !important; }
          .hero-row {
            flex-direction: column !important;
            gap: 14px !important;
            padding: 0 !important;
          }
          .hero-left, .hero-right { flex: 1 1 auto !important; width: 100% !important; text-align: center !important; }
          .hero-left h1 { font-size: 2rem !important; font-weight: 300 !important; }
          .hero-cta-row { flex-direction: row !important; gap: 8px !important; margin-top: 20px !important; justify-content: center !important; }
          .hero-cta-row a {
            flex: 1 !important;
            min-width: 0 !important;
            padding: 10px 14px !important;
            font-size: 13px !important;
          }
          .hero-right p { font-size: 14px !important; }
        }
        @media (min-width: 769px) and (max-width: 1024px) {
          .hero-inner { padding: 72px 32px 0 !important; }
        }
      `}</style>
    </section>
  );
}