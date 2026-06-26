import React, { useState, useEffect } from "react";

// Multilingual "Hello" cloud. Every greeting orbits gently around the center.
// The "spotlight" travels from word to word: the highlighted greeting eases
// toward the middle and grows, while the previous one eases back into orbit —
// so the motion is continuous and connected, not a hard swap.

const GREETINGS = [
  "Hello", "你好", "Bonjour", "Xin chào", "Hola",
  "Hujambo", "Olá", "Ciao", "Merhaba", "Hallo",
];

// Evenly distribute the words on an ellipse around the center.
const RADIUS_X = 38; // percent
const RADIUS_Y = 34; // percent

export default function HelloCloud() {
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % GREETINGS.length);
    }, 1800);
    return () => clearInterval(interval);
  }, []);

  return (
    <div style={{
      position: "relative",
      width: "100%",
      height: "100%",
      minHeight: "200px",
      background: "#FFFFFF",
      borderRadius: "14px",
      overflow: "hidden",
    }}>
      <div style={{
        position: "absolute",
        inset: 0,
        animation: "hc-orbit 32s linear infinite",
      }}>
        {GREETINGS.map((word, i) => {
          const isActive = i === activeIndex;
          const angle = (i / GREETINGS.length) * Math.PI * 2;
          // Orbit position (kept for non-active words).
          const x = 50 + Math.cos(angle) * RADIUS_X;
          const y = 50 + Math.sin(angle) * RADIUS_Y;
          const left = isActive ? 50 : x;
          const top = isActive ? 50 : y;

          return (
            <span
              key={word}
              style={{
                position: "absolute",
                top: `${top}%`,
                left: `${left}%`,
                transform: isActive
                  ? "translate(-50%, -50%) scale(1)"
                  : "translate(-50%, -50%) scale(1)",
                fontFamily: "Inter, sans-serif",
                fontWeight: isActive ? 600 : 400,
                fontSize: isActive ? "clamp(26px, 6vw, 38px)" : "15px",
                color: isActive ? "#0D0D0D" : "#C8C4BD",
                letterSpacing: isActive ? "-0.03em" : "0",
                whiteSpace: "nowrap",
                // Counter-rotate so the words stay upright while the orbit spins.
                animation: isActive ? "none" : "hc-counter 32s linear infinite",
                transition: "top 0.9s cubic-bezier(0.4,0,0.2,1), left 0.9s cubic-bezier(0.4,0,0.2,1), font-size 0.9s ease, color 0.9s ease, font-weight 0.9s ease",
                zIndex: isActive ? 2 : 1,
              }}
            >
              {word}
            </span>
          );
        })}
      </div>

      <style>{`
        @keyframes hc-orbit {
          from { transform: rotate(0deg); }
          to   { transform: rotate(360deg); }
        }
        @keyframes hc-counter {
          from { transform: translate(-50%, -50%) rotate(0deg); }
          to   { transform: translate(-50%, -50%) rotate(-360deg); }
        }
      `}</style>
    </div>
  );
}