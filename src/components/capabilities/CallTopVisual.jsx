import React, { useState, useEffect } from "react";

// iOS-style header visual that bleeds to the card edges.
// Pass `frames` (array of { label, title }) to cycle, or a single static frame.
export default function CallTopVisual({ frames, icon }) {
  const [active, setActive] = useState(0);

  useEffect(() => {
    if (!frames || frames.length < 2) return;
    const interval = setInterval(() => {
      setActive((prev) => (prev + 1) % frames.length);
    }, 2200);
    return () => clearInterval(interval);
  }, [frames]);

  const frame = frames[active] || frames[0];

  return (
    <div
      style={{
        // bleed to the card edges (card padding is 24px top/sides)
        margin: "-24px -24px 0",
        height: "118px",
        background: "linear-gradient(135deg, #EFF5FF 0%, #DBEAFE 100%)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        overflow: "hidden",
        borderTopLeftRadius: "16px",
        borderTopRightRadius: "16px",
        borderBottom: "1px solid rgba(0,0,0,0.05)",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "12px",
          background: "rgba(255,255,255,0.9)",
          backdropFilter: "blur(12px)",
          WebkitBackdropFilter: "blur(12px)",
          borderRadius: "16px",
          padding: "10px 14px",
          boxShadow: "0 6px 20px rgba(0,0,0,0.10)",
          border: "1px solid rgba(255,255,255,0.7)",
          minWidth: "200px",
          maxWidth: "85%",
        }}
      >
        <div
          key={`icon-${active}`}
          style={{ fontSize: "24px", lineHeight: 1, animation: "ctv-pop 0.4s ease" }}
        >
          {frame.icon || icon}
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: "2px", flex: 1, minWidth: 0 }}>
          <span
            style={{
              fontFamily: "Inter, sans-serif",
              fontSize: "9px",
              fontWeight: 500,
              textTransform: "uppercase",
              letterSpacing: "0.08em",
              color: "#7C93B8",
            }}
          >
            {frame.label}
          </span>
          <span
            key={`title-${active}`}
            style={{
              fontFamily: "Inter, sans-serif",
              fontSize: "14px",
              fontWeight: 600,
              color: "#0D0D0D",
              animation: "ctv-fade 0.4s ease",
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
            }}
          >
            {frame.title}
          </span>
        </div>
        {/* sound wave indicator */}
        <div style={{ display: "flex", alignItems: "flex-end", gap: "2px", height: "20px" }}>
          {[0, 1, 2, 3].map((i) => (
            <span
              key={i}
              style={{
                width: "2px",
                borderRadius: "2px",
                background: "#3B82F6",
                animation: `ctv-wave 0.9s ease-in-out ${i * 0.12}s infinite`,
              }}
            />
          ))}
        </div>
      </div>

      <style>{`
        @keyframes ctv-pop {
          0% { transform: scale(0.6); opacity: 0; }
          100% { transform: scale(1); opacity: 1; }
        }
        @keyframes ctv-fade {
          0% { opacity: 0; transform: translateY(4px); }
          100% { opacity: 1; transform: translateY(0); }
        }
        @keyframes ctv-wave {
          0%, 100% { height: 5px; }
          50% { height: 18px; }
        }
      `}</style>
    </div>
  );
}