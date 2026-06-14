import React, { useState } from "react";

const TABS = [
  { key: "he", label: "Hebrew", dotColor: "#F4793B" },
  { key: "fr", label: "Français", dotColor: "#4A90D9" },
  { key: "en", label: "English", dotColor: "#555555" },
];

export default function HeroSection() {
  const [activeTab, setActiveTab] = useState("en");
  const [activeMode, setActiveMode] = useState("voice");

  return (
    <section
      style={{
        position: "relative",
        width: "100%",
        backgroundColor: "#F7F7F5",
        overflow: "hidden",
      }}>

      <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "80px 32px 0" }}>

        {/* ─── SECTION 1: TWO-COLUMN TEXT ROW ─── */}
        <div
          className="hero-two-col"
          style={{
            display: "flex",
            gap: "5%",
            alignItems: "flex-start",
            marginBottom: "40px",
          }}>

          {/* LEFT COLUMN — headline + buttons */}
          <div style={{ flex: "0 0 50%", minWidth: 0 }}>
            <h1
              style={{
                fontFamily: "Inter, sans-serif",
                fontWeight: 300,
                fontSize: "clamp(2rem, 4.5vw, 3.5rem)",
                color: "#0A0A0A",
                letterSpacing: "-0.025em",
                lineHeight: 1.15,
                margin: 0,
              }}>
              Meet Yael.<br />
              Your front desk<br />
              on autopilot.
            </h1>

            <div style={{ display: "flex", gap: "10px", marginTop: "28px" }}>
              <a
                href="#book-demo"
                style={{
                  fontFamily: "Inter, sans-serif",
                  fontWeight: 400,
                  fontSize: "15px",
                  color: "#FFFFFF",
                  backgroundColor: "#0A0A0A",
                  borderRadius: "999px",
                  padding: "10px 20px",
                  display: "inline-flex",
                  alignItems: "center",
                  textDecoration: "none",
                  border: "none",
                  cursor: "pointer",
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
                  color: "#0A0A0A",
                  backgroundColor: "transparent",
                  borderRadius: "999px",
                  padding: "10px 20px",
                  display: "inline-flex",
                  alignItems: "center",
                  textDecoration: "none",
                  border: "1px solid #0A0A0A",
                  cursor: "pointer",
                  transition: "opacity 0.15s ease",
                }}
                onMouseEnter={e => e.currentTarget.style.opacity = "0.7"}
                onMouseLeave={e => e.currentTarget.style.opacity = "1"}>
                See How It Works
              </a>
            </div>
          </div>

          {/* RIGHT COLUMN — paragraph */}
          <div style={{ flex: "0 0 45%", minWidth: 0, paddingTop: "6px" }}>
            <p
              style={{
                fontFamily: "Inter, sans-serif",
                fontWeight: 400,
                fontSize: "16px",
                color: "#555555",
                lineHeight: 1.6,
                margin: 0,
              }}>
              Yael answers every call in Hebrew, French, or English — booking appointments,
              registering new patients, and handling emergencies, 24/7, so your team never has to.
            </p>
          </div>
        </div>

        {/* ─── SECTION 2: DEMO CARD ─── */}
        <div
          style={{
            backgroundColor: "#EEECEA",
            border: "1px solid #E0DDD9",
            borderRadius: "16px",
            padding: "36px 32px 24px",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}>

          {/* TAB SWITCHER */}
          <div
            style={{
              display: "inline-flex",
              gap: "4px",
              marginBottom: "40px",
            }}>
            {TABS.map(tab => {
              const isActive = activeTab === tab.key;
              return (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key)}
                  style={{
                    fontFamily: "Inter, sans-serif",
                    fontWeight: 500,
                    fontSize: "13px",
                    color: isActive ? "#0A0A0A" : "#888888",
                    backgroundColor: isActive ? "#FFFFFF" : "transparent",
                    border: isActive ? "1px solid #D0CCC8" : "1px solid transparent",
                    borderRadius: "999px",
                    padding: "6px 18px",
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "7px",
                    cursor: "pointer",
                    transition: "all 0.2s ease",
                  }}>
                  <span
                    style={{
                      display: "inline-block",
                      width: "7px",
                      height: "7px",
                      borderRadius: "50%",
                      backgroundColor: tab.dotColor,
                      flexShrink: 0,
                    }}
                  />
                  {tab.label}
                </button>
              );
            })}
          </div>

          {/* 3D GLASS ORB */}
          <div
            style={{
              position: "relative",
              width: "260px",
              height: "260px",
              marginBottom: "28px",
            }}>
            {/* Base sphere with layered radial gradients */}
            <div
              className="glass-orb"
              style={{
                width: "260px",
                height: "260px",
                borderRadius: "50%",
                position: "relative",
                background: `
                  radial-gradient(circle at 35% 30%, rgba(200,232,220,0.9) 0%, rgba(91,168,160,0.7) 35%, rgba(61,122,138,0.8) 60%, rgba(42,74,62,0.9) 100%),
                  radial-gradient(circle at 30% 25%, rgba(255,255,255,0.6) 0%, transparent 40%)
                `,
                animation: "hueShift 8s ease-in-out infinite",
              }}
            />

            {/* Specular highlight overlay */}
            <div
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                width: "260px",
                height: "260px",
                borderRadius: "50%",
                background: "radial-gradient(circle at 30% 28%, rgba(255,255,255,0.55) 0%, transparent 35%)",
                pointerEvents: "none",
              }}
            />

            {/* Phone button */}
            <button
              style={{
                position: "absolute",
                bottom: "-24px",
                left: "50%",
                transform: "translateX(-50%)",
                width: "48px",
                height: "48px",
                borderRadius: "50%",
                backgroundColor: "#0A0A0A",
                border: "none",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                zIndex: 2,
                transition: "transform 0.15s ease",
              }}
              onMouseEnter={e => e.currentTarget.style.transform = "translateX(-50%) scale(1.05)"}
              onMouseLeave={e => e.currentTarget.style.transform = "translateX(-50%) scale(1)"}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z" />
              </svg>
            </button>
          </div>

          {/* BOTTOM BAR */}
          <div
            style={{
              width: "100%",
              borderTop: "1px solid #E0DDD9",
              paddingTop: "16px",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              flexWrap: "wrap",
              gap: "12px",
            }}>

            {/* LEFT — avatar + label */}
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <div
                style={{
                  width: "32px",
                  height: "32px",
                  borderRadius: "50%",
                  background: "linear-gradient(135deg, #4A90D9, #60A5FA)",
                  flexShrink: 0,
                }}
              />
              <span
                style={{
                  fontFamily: "Inter, sans-serif",
                  fontWeight: 500,
                  fontSize: "14px",
                  color: "#333333",
                }}>
                Yael — AI Receptionist
              </span>
            </div>

            {/* CENTER — Voice / Chat toggle */}
            <div style={{ display: "inline-flex", gap: "4px", alignItems: "center" }}>
              {["voice", "chat"].map(mode => {
                const isActive = activeMode === mode;
                return (
                  <button
                    key={mode}
                    onClick={() => setActiveMode(mode)}
                    style={{
                      fontFamily: "Inter, sans-serif",
                      fontWeight: 500,
                      fontSize: "14px",
                      color: isActive ? "#0A0A0A" : "#888888",
                      backgroundColor: isActive ? "#FFFFFF" : "transparent",
                      border: isActive ? "1px solid #D0CCC8" : "1px solid transparent",
                      borderRadius: "999px",
                      padding: "6px 16px",
                      cursor: "pointer",
                      textTransform: "capitalize",
                      transition: "all 0.15s ease",
                    }}>
                    {mode}
                  </button>
                );
              })}
            </div>

            {/* RIGHT — live status */}
            <p
              style={{
                fontFamily: "Inter, sans-serif",
                fontWeight: 400,
                fontStyle: "italic",
                fontSize: "13px",
                color: "#999999",
                margin: 0,
              }}>
              Live at Les Experts Netanya · Handling calls since 2025
            </p>
          </div>
        </div>
      </div>

      {/* Animations */}
      <style>{`
        @keyframes hueShift {
          0%   { filter: hue-rotate(0deg); }
          25%  { filter: hue-rotate(8deg); }
          50%  { filter: hue-rotate(0deg); }
          75%  { filter: hue-rotate(-6deg); }
          100% { filter: hue-rotate(0deg); }
        }

        @media (max-width: 768px) {
          .hero-two-col {
            flex-direction: column !important;
            gap: 24px !important;
            margin-bottom: 32px !important;
          }
        }
      `}</style>
    </section>
  );
}