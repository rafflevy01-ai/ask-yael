import React, { useState, useEffect } from "react";

// Clean, minimal iOS-style "patient recognized" visual. A single contact pill
// fades/scales in with a soft check — no busy motion, just a calm confirmation
// that the caller was identified.

export default function PatientRecognized() {
  const [shown, setShown] = useState(false);

  useEffect(() => {
    // gentle loop: appear, hold, reset
    let t1, t2;
    const cycle = () => {
      setShown(true);
      t1 = setTimeout(() => setShown(false), 3200);
      t2 = setTimeout(cycle, 4000);
    };
    cycle();
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, []);

  return (
    <div style={{
      width: "100%",
      height: "100%",
      minHeight: "190px",
      background: "#FFFFFF",
      borderRadius: "14px",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      overflow: "hidden",
    }}>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "12px",
          background: "rgba(255,255,255,0.9)",
          backdropFilter: "blur(12px)",
          WebkitBackdropFilter: "blur(12px)",
          borderRadius: "16px",
          padding: "12px 14px",
          boxShadow: "0 6px 22px rgba(0,0,0,0.10)",
          border: "1px solid rgba(0,0,0,0.05)",
          opacity: shown ? 1 : 0,
          transform: shown ? "scale(1)" : "scale(0.94)",
          transition: "opacity 0.5s ease, transform 0.5s cubic-bezier(0.16,1,0.3,1)",
        }}
      >
        {/* Avatar */}
        <div style={{
          width: "38px",
          height: "38px",
          borderRadius: "9999px",
          background: "#0D0D0D",
          color: "#FFFFFF",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: "-apple-system, BlinkMacSystemFont, 'SF Pro Display', 'Inter', sans-serif",
          fontWeight: 600,
          fontSize: "14px",
          flexShrink: 0,
        }}>
          DM
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "2px", minWidth: 0 }}>
          <span style={{
            fontFamily: "-apple-system, BlinkMacSystemFont, 'SF Pro Display', 'Inter', sans-serif",
            fontSize: "9px",
            fontWeight: 500,
            textTransform: "uppercase",
            letterSpacing: "0.08em",
            color: "#9A958C",
          }}>
            Patient recognized
          </span>
          <span style={{
            fontFamily: "-apple-system, BlinkMacSystemFont, 'SF Pro Display', 'Inter', sans-serif",
            fontSize: "15px",
            fontWeight: 600,
            color: "#0D0D0D",
            letterSpacing: "-0.01em",
          }}>
            David Mizrahi
          </span>
        </div>

        {/* Check badge */}
        <div style={{
          width: "22px",
          height: "22px",
          borderRadius: "9999px",
          background: "#34C759",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexShrink: 0,
          marginLeft: "2px",
          opacity: shown ? 1 : 0,
          transform: shown ? "scale(1)" : "scale(0.5)",
          transition: "opacity 0.4s ease 0.25s, transform 0.4s cubic-bezier(0.16,1,0.3,1) 0.25s",
        }}>
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="20 6 9 17 4 12" />
          </svg>
        </div>
      </div>
    </div>
  );
}