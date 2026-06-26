import React, { useState, useEffect } from "react";

const SEQUENCE = [
  { flag: "🇮🇱", label: "עברית", code: "HE" },
  { flag: "🇫🇷", label: "Français", code: "FR" },
];

export default function LangDetectIOS() {
  const [active, setActive] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setActive((prev) => (prev + 1) % SEQUENCE.length);
    }, 2200);
    return () => clearInterval(interval);
  }, []);

  return (
    <div
      style={{
        width: "calc(100% + 48px)",
        marginLeft: "-24px",
        marginTop: "-20px",
        marginBottom: "16px",
        height: "120px",
        background: "linear-gradient(135deg, #F7F6F3 0%, #ECEAE4 100%)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        overflow: "hidden",
        borderBottom: "1px solid rgba(0,0,0,0.05)",
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
          border: "1px solid rgba(255,255,255,0.6)",
          minWidth: "180px",
        }}
      >
        <div
          key={active}
          style={{
            fontSize: "26px",
            lineHeight: 1,
            animation: "lang-pop 0.4s ease",
          }}
        >
          {SEQUENCE[active].flag}
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: "2px", flex: 1 }}>
          <span
            style={{
              fontFamily: "Inter, sans-serif",
              fontSize: "9px",
              fontWeight: 500,
              textTransform: "uppercase",
              letterSpacing: "0.08em",
              color: "#9A958C",
            }}
          >
            Language detected
          </span>
          <span
            key={active}
            style={{
              fontFamily: "Inter, sans-serif",
              fontSize: "14px",
              fontWeight: 600,
              color: "#0D0D0D",
              animation: "lang-fade 0.4s ease",
            }}
          >
            {SEQUENCE[active].label}
          </span>
        </div>
        {/* sound wave indicator */}
        <div style={{ display: "flex", alignItems: "center", gap: "2px", height: "20px" }}>
          {[0, 1, 2, 3].map((i) => (
            <span
              key={i}
              style={{
                width: "2px",
                borderRadius: "2px",
                background: "#0D0D0D",
                animation: `lang-wave 0.9s ease-in-out ${i * 0.12}s infinite`,
              }}
            />
          ))}
        </div>
      </div>

      <style>{`
        @keyframes lang-pop {
          0% { transform: scale(0.6); opacity: 0; }
          100% { transform: scale(1); opacity: 1; }
        }
        @keyframes lang-fade {
          0% { opacity: 0; transform: translateY(4px); }
          100% { opacity: 1; transform: translateY(0); }
        }
        @keyframes lang-wave {
          0%, 100% { height: 5px; }
          50% { height: 18px; }
        }
      `}</style>
    </div>
  );
}