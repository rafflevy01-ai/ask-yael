import React, { useState, useEffect } from "react";

// iOS-style language switcher header that bleeds to the card edges.
// Cycles FR → EN → HE, each greeting "Hey, I'm Yael. How are you doing?"

const SEQUENCE = [
  { flag: "🇫🇷", code: "FR", greeting: "Salut, c'est Yaël. Comment allez-vous ?", dir: "ltr" },
  { flag: "🇬🇧", code: "EN", greeting: "Hey, I'm Yael. How are you doing?", dir: "ltr" },
  { flag: "🇮🇱", code: "HE", greeting: "היי, אני יעל. מה שלומך?", dir: "rtl" },
];

export default function CallTopVisual() {
  const [active, setActive] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setActive((prev) => (prev + 1) % SEQUENCE.length);
    }, 2600);
    return () => clearInterval(interval);
  }, []);

  const item = SEQUENCE[active];

  return (
    <div
      style={{
        width: "calc(100% + 48px)",
        marginLeft: "-24px",
        marginTop: "-24px",
        marginBottom: "16px",
        height: "120px",
        background: "#FFFFFF",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        overflow: "hidden",
        borderBottom: "1px solid rgba(0,0,0,0.05)",
        padding: "0 16px",
      }}
    >
      {/* iOS-style detection pill */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "10px",
          background: "rgba(255,255,255,0.85)",
          backdropFilter: "blur(12px)",
          WebkitBackdropFilter: "blur(12px)",
          borderRadius: "16px",
          padding: "10px 14px",
          boxShadow: "0 6px 20px rgba(0,0,0,0.10)",
          border: "1px solid rgba(0,0,0,0.05)",
          maxWidth: "100%",
        }}
      >
        <div
          key={`flag-${active}`}
          style={{
            fontSize: "26px",
            lineHeight: 1,
            flexShrink: 0,
            animation: "ctv-pop 0.4s ease",
          }}
        >
          {item.flag}
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: "3px", flex: 1, minWidth: 0 }}>
          <span
            style={{
              fontFamily: "Inter, sans-serif",
              fontSize: "9px",
              fontWeight: 400,
              textTransform: "uppercase",
              letterSpacing: "0.08em",
              color: "#9A958C",
            }}
          >
            Language detected · {item.code}
          </span>
          <span
            key={`txt-${active}`}
            dir={item.dir}
            style={{
              fontFamily: "Inter, sans-serif",
              fontSize: "13px",
              fontWeight: 400,
              color: "#0D0D0D",
              lineHeight: 1.35,
              animation: "ctv-fade 0.4s ease",
              textAlign: item.dir === "rtl" ? "right" : "left",
            }}
          >
            {item.greeting}
          </span>
        </div>
        {/* sound wave indicator */}
        <div style={{ display: "flex", alignItems: "center", gap: "2px", height: "20px", flexShrink: 0 }}>
          {[0, 1, 2, 3].map((i) => (
            <span
              key={i}
              style={{
                width: "2px",
                borderRadius: "2px",
                background: "#0D0D0D",
                animation: `ctv-wave 0.9s ease-in-out ${i * 0.12}s infinite`,
              }}
            />
          ))}
        </div>
      </div>

      <style>{`
        @keyframes ctv-pop { 0% { transform: scale(0.6); opacity: 0; } 100% { transform: scale(1); opacity: 1; } }
        @keyframes ctv-fade { 0% { opacity: 0; transform: translateY(4px); } 100% { opacity: 1; transform: translateY(0); } }
        @keyframes ctv-wave { 0%, 100% { height: 5px; } 50% { height: 18px; } }
      `}</style>
    </div>
  );
}