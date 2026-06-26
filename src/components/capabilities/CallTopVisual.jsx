import React, { useState, useEffect } from "react";

// iOS-style header visual that bleeds to the card edges.
// `variant` selects a distinct design per card.
// Background matches the "Missed call" card's blue→white gradient.

const GRADIENT = "linear-gradient(135deg, #9DB4C0 0%, #C5D5DD 45%, #F2F5F7 100%)";

// ── Variant: language (cycling flag + detected language) ──
function LanguageVariant() {
  const FRAMES = [
    { title: "עברית", icon: "🇮🇱" },
    { title: "Français", icon: "🇫🇷" },
  ];
  const [active, setActive] = useState(0);
  useEffect(() => {
    const i = setInterval(() => setActive((p) => (p + 1) % FRAMES.length), 2200);
    return () => clearInterval(i);
  }, []);
  const frame = FRAMES[active];
  return (
    <Pill>
      <span key={`f-${active}`} style={{ fontSize: "24px", lineHeight: 1, animation: "ctv-pop 0.4s ease" }}>
        {frame.icon}
      </span>
      <div style={{ display: "flex", flexDirection: "column", gap: "2px", flex: 1, minWidth: 0 }}>
        <Label>Language detected</Label>
        <Title key={`t-${active}`}>{frame.title}</Title>
      </div>
      <Waves />
    </Pill>
  );
}

// ── Variant: patient recognition (caller ID matched) ──
function RecognitionVariant() {
  return (
    <Pill>
      <span style={{
        width: "30px", height: "30px", borderRadius: "50%", flexShrink: 0,
        background: "linear-gradient(135deg, #6B8AAD, #3B5A7D)", display: "flex",
        alignItems: "center", justifyContent: "center", color: "#fff",
        fontFamily: "Inter, sans-serif", fontWeight: 600, fontSize: "12px",
      }}>DC</span>
      <div style={{ display: "flex", flexDirection: "column", gap: "2px", flex: 1, minWidth: 0 }}>
        <Label>Patient recognized</Label>
        <Title>David Cohen · #4821</Title>
      </div>
      <Check />
    </Pill>
  );
}

// ── Variant: booking (calendar slot confirmed) ──
function BookingVariant() {
  return (
    <Pill>
      <span style={{
        width: "30px", height: "32px", borderRadius: "7px", flexShrink: 0,
        background: "#fff", border: "1px solid rgba(0,0,0,0.08)", overflow: "hidden",
        display: "flex", flexDirection: "column",
        boxShadow: "0 1px 3px rgba(0,0,0,0.08)",
      }}>
        <span style={{ height: "9px", background: "#DC2626" }} />
        <span style={{
          flex: 1, display: "flex", alignItems: "center", justifyContent: "center",
          fontFamily: "Inter, sans-serif", fontWeight: 700, fontSize: "13px", color: "#0D0D0D",
        }}>12</span>
      </span>
      <div style={{ display: "flex", flexDirection: "column", gap: "2px", flex: 1, minWidth: 0 }}>
        <Label>Appointment booked</Label>
        <Title>Thu · 9:00 AM</Title>
      </div>
      <Check />
    </Pill>
  );
}

// ── Variant: intake (form fields filling) ──
function IntakeVariant() {
  const ROWS = ["Full name", "Date of birth", "Health fund"];
  const [filled, setFilled] = useState(0);
  useEffect(() => {
    const i = setInterval(() => setFilled((p) => (p + 1) % (ROWS.length + 1)), 900);
    return () => clearInterval(i);
  }, []);
  return (
    <Pill>
      <span style={{ fontSize: "22px", lineHeight: 1, flexShrink: 0 }}>📝</span>
      <div style={{ display: "flex", flexDirection: "column", gap: "4px", flex: 1, minWidth: 0 }}>
        <Label>New patient intake</Label>
        <div style={{ display: "flex", flexDirection: "column", gap: "3px" }}>
          {ROWS.map((row, i) => (
            <div key={row} style={{ display: "flex", alignItems: "center", gap: "5px" }}>
              <span style={{
                width: "11px", height: "11px", borderRadius: "50%", flexShrink: 0,
                background: i < filled ? "#34c759" : "rgba(0,0,0,0.12)",
                display: "flex", alignItems: "center", justifyContent: "center",
                transition: "background 0.3s ease",
              }}>
                {i < filled && (
                  <svg width="7" height="7" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>
                )}
              </span>
              <span style={{
                fontFamily: "Inter, sans-serif", fontSize: "10px",
                color: i < filled ? "#0D0D0D" : "#9AA3AD", transition: "color 0.3s ease",
              }}>{row}</span>
            </div>
          ))}
        </div>
      </div>
    </Pill>
  );
}

// ── Shared atoms ──
function Pill({ children }) {
  return (
    <div style={{
      display: "flex", alignItems: "center", gap: "12px",
      background: "rgba(255,255,255,0.92)", backdropFilter: "blur(12px)",
      WebkitBackdropFilter: "blur(12px)", borderRadius: "16px", padding: "11px 14px",
      boxShadow: "0 6px 20px rgba(0,0,0,0.10)", border: "1px solid rgba(255,255,255,0.7)",
      minWidth: "210px", maxWidth: "88%",
    }}>{children}</div>
  );
}

function Label({ children }) {
  return (
    <span style={{
      fontFamily: "Inter, sans-serif", fontSize: "9px", fontWeight: 500,
      textTransform: "uppercase", letterSpacing: "0.08em", color: "#7C93B8",
    }}>{children}</span>
  );
}

function Title({ children }) {
  return (
    <span style={{
      fontFamily: "Inter, sans-serif", fontSize: "14px", fontWeight: 600, color: "#0D0D0D",
      animation: "ctv-fade 0.4s ease", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis",
    }}>{children}</span>
  );
}

function Waves() {
  return (
    <div style={{ display: "flex", alignItems: "flex-end", gap: "2px", height: "20px" }}>
      {[0, 1, 2, 3].map((i) => (
        <span key={i} style={{
          width: "2px", borderRadius: "2px", background: "#5A7894",
          animation: `ctv-wave 0.9s ease-in-out ${i * 0.12}s infinite`,
        }} />
      ))}
    </div>
  );
}

function Check() {
  return (
    <span style={{
      width: "20px", height: "20px", borderRadius: "50%", background: "#34c759", flexShrink: 0,
      display: "flex", alignItems: "center", justifyContent: "center",
    }}>
      <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>
    </span>
  );
}

const VARIANTS = {
  language: LanguageVariant,
  recognition: RecognitionVariant,
  booking: BookingVariant,
  intake: IntakeVariant,
};

export default function CallTopVisual({ variant }) {
  const Variant = VARIANTS[variant] || LanguageVariant;
  return (
    <div style={{
      margin: "-24px -24px 0", height: "118px", background: GRADIENT,
      display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden",
      borderTopLeftRadius: "16px", borderTopRightRadius: "16px",
      borderBottom: "1px solid rgba(0,0,0,0.05)",
    }}>
      <Variant />
      <style>{`
        @keyframes ctv-pop { 0% { transform: scale(0.6); opacity: 0; } 100% { transform: scale(1); opacity: 1; } }
        @keyframes ctv-fade { 0% { opacity: 0; transform: translateY(4px); } 100% { opacity: 1; transform: translateY(0); } }
        @keyframes ctv-wave { 0%, 100% { height: 5px; } 50% { height: 18px; } }
      `}</style>
    </div>
  );
}