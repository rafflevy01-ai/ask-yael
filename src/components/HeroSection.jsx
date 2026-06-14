import React, { useState } from "react";
import InteractiveDotGrid from "./InteractiveDotGrid";

const TABS = [
  { key: "he", label: "Hebrew", dotColor: "#F97316" },
  { key: "fr", label: "Français", dotColor: "#3B82F6" },
  { key: "en", label: "English", dotColor: "#1e293b" },
];

export default function HeroSection() {
  const [activeTab, setActiveTab] = useState("en");
  const [activeMode, setActiveMode] = useState("voice");

  return (
    <section
      style={{
        position: "relative",
        width: "100%",
        backgroundColor: "#FFFFFF",
        overflow: "hidden",
        padding: "100px 0 80px",
      }}>

      {/* Dot grid background */}
      <div style={{ position: "absolute", inset: 0, zIndex: 0 }}>
        <InteractiveDotGrid />
      </div>

      <div style={{ position: "relative", zIndex: 1, maxWidth: "1200px", margin: "0 auto", padding: "0 32px" }}>

        {/* ─── SECTION 1: TWO-COLUMN TEXT ROW ─── */}
        <div
          className="hero-two-col"
          style={{
            display: "flex",
            gap: "60px",
            alignItems: "flex-start",
            marginBottom: "60px",
          }}>

          {/* LEFT COLUMN — headline + buttons */}
          <div style={{ flex: "0 0 55%", minWidth: 0 }}>
            <h1
              style={{
                fontFamily: "Inter, sans-serif",
                fontWeight: 700,
                fontSize: "clamp(2.2rem, 5vw, 3.8rem)",
                color: "#000000",
                letterSpacing: "-0.03em",
                lineHeight: 1.12,
                margin: 0,
              }}>
              Meet Yael.<br />
              Your front desk<br />
              on autopilot.
            </h1>

            <div style={{ display: "flex", gap: "12px", marginTop: "32px" }}>
              {/* Primary CTA */}
              <a
                href="#book-demo"
                style={{
                  fontFamily: "Inter, sans-serif",
                  fontWeight: 500,
                  fontSize: "14px",
                  color: "#FFFFFF",
                  backgroundColor: "#000000",
                  borderRadius: "9999px",
                  height: "40px",
                  padding: "0 22px",
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

              {/* Secondary CTA */}
              <a
                href="#how-it-works"
                style={{
                  fontFamily: "Inter, sans-serif",
                  fontWeight: 500,
                  fontSize: "14px",
                  color: "#000000",
                  backgroundColor: "#FFFFFF",
                  borderRadius: "9999px",
                  height: "40px",
                  padding: "0 22px",
                  display: "inline-flex",
                  alignItems: "center",
                  textDecoration: "none",
                  border: "1px solid #d4d4d4",
                  cursor: "pointer",
                  transition: "border-color 0.15s ease",
                }}
                onMouseEnter={e => e.currentTarget.style.borderColor = "#000000"}
                onMouseLeave={e => e.currentTarget.style.borderColor = "#d4d4d4"}>
                See How It Works
              </a>
            </div>
          </div>

          {/* RIGHT COLUMN — paragraph */}
          <div style={{ flex: "0 0 45%", minWidth: 0, paddingTop: "8px" }}>
            <p
              style={{
                fontFamily: "Inter, sans-serif",
                fontWeight: 400,
                fontSize: "16px",
                color: "#6b7280",
                lineHeight: 1.6,
                margin: 0,
                maxWidth: "440px",
              }}>
              Yael answers every call in Hebrew, French, or English — booking appointments,
              registering new patients, and handling emergencies, 24/7, so your team never has to.
            </p>
          </div>
        </div>

        {/* ─── SECTION 2: FULL-WIDTH DEMO CARD ─── */}
        <div
          style={{
            backgroundColor: "#EFEFED",
            borderRadius: "16px",
            padding: "32px 32px 24px",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}>

          {/* TAB SWITCHER */}
          <div
            style={{
              display: "inline-flex",
              gap: "4px",
              backgroundColor: "transparent",
              borderRadius: "9999px",
              padding: "4px",
              marginBottom: "36px",
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
                    color: isActive ? "#000000" : "#6b7280",
                    backgroundColor: isActive ? "#FFFFFF" : "transparent",
                    border: isActive ? "1px solid #e5e5e5" : "1px solid transparent",
                    borderRadius: "9999px",
                    padding: "8px 16px",
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "7px",
                    cursor: "pointer",
                    transition: "all 0.2s ease",
                    boxShadow: isActive ? "0 1px 4px rgba(0,0,0,0.06)" : "none",
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

          {/* ANIMATED VOICE BLOB */}
          <div
            style={{
              position: "relative",
              width: "280px",
              height: "280px",
              marginBottom: "24px",
            }}>
            <div
              className="voice-blob"
              style={{
                width: "100%",
                height: "100%",
                borderRadius: "60% 40% 55% 45% / 50% 55% 45% 50%",
                background: "linear-gradient(135deg, #0d9488, #3B82F6, #06b6d4, #10b981)",
                backgroundSize: "300% 300%",
                animation: "morphBlob 7s ease-in-out infinite, shiftGradient 8s ease-in-out infinite",
                position: "relative",
              }}
            />

            {/* Phone button overlapping blob bottom */}
            <button
              style={{
                position: "absolute",
                bottom: "-8px",
                left: "50%",
                transform: "translateX(-50%)",
                width: "48px",
                height: "48px",
                borderRadius: "50%",
                backgroundColor: "#000000",
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
              borderTop: "1px solid #d4d4d4",
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
                  background: "linear-gradient(135deg, #3B82F6, #60A5FA)",
                  flexShrink: 0,
                }}
              />
              <span
                style={{
                  fontFamily: "Inter, sans-serif",
                  fontWeight: 500,
                  fontSize: "13px",
                  color: "#000000",
                }}>
                Yael — AI Receptionist
              </span>
            </div>

            {/* CENTER — Voice / Chat toggle */}
            <div
              style={{
                display: "inline-flex",
                backgroundColor: "transparent",
                borderRadius: "9999px",
                padding: "3px",
              }}>
              {["voice", "chat"].map(mode => {
                const isActive = activeMode === mode;
                return (
                  <button
                    key={mode}
                    onClick={() => setActiveMode(mode)}
                    style={{
                      fontFamily: "Inter, sans-serif",
                      fontWeight: 500,
                      fontSize: "12px",
                      color: isActive ? "#000000" : "#6b7280",
                      backgroundColor: isActive ? "#FFFFFF" : "transparent",
                      border: isActive ? "1px solid #e5e5e5" : "1px solid transparent",
                      borderRadius: "9999px",
                      padding: "6px 14px",
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
                fontSize: "12px",
                color: "#9ca3af",
                margin: 0,
              }}>
              Live at Les Experts Netanya · Handling calls since 2025
            </p>
          </div>
        </div>
      </div>

      {/* Animations */}
      <style>{`
        @keyframes morphBlob {
          0%   { border-radius: 60% 40% 55% 45% / 50% 55% 45% 50%; }
          25%  { border-radius: 45% 55% 50% 50% / 55% 45% 55% 45%; }
          50%  { border-radius: 55% 45% 60% 40% / 45% 55% 50% 50%; }
          75%  { border-radius: 50% 50% 45% 55% / 60% 40% 55% 45%; }
          100% { border-radius: 60% 40% 55% 45% / 50% 55% 45% 50%; }
        }

        @keyframes shiftGradient {
          0%   { background-position: 0% 50%; }
          50%  { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }

        @media (max-width: 768px) {
          .hero-two-col {
            flex-direction: column !important;
            gap: 28px !important;
            margin-bottom: 40px !important;
          }
        }
      `}</style>
    </section>
  );
}