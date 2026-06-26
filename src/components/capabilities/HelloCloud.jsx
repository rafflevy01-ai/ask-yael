import React, { useState, useEffect } from "react";

// Multilingual "Hello" word-cloud. The center word cycles through every
// greeting — each language takes the spotlight in turn, while the others
// float in the surrounding positions.

const GREETINGS = [
  "Hello", "你好", "Bonjour", "Xin chào", "Hola",
  "Hujambo", "Olá", "Ciao", "Merhaba", "Hallo", "Halo",
];

const POSITIONS = [
  { top: "14%", left: "30%", size: 15 },
  { top: "20%", left: "62%", size: 17 },
  { top: "32%", left: "74%", size: 14 },
  { top: "34%", left: "42%", size: 14 },
  { top: "44%", left: "16%", size: 14 },
  { top: "58%", left: "76%", size: 14 },
  { top: "68%", left: "40%", size: 15 },
  { top: "76%", left: "64%", size: 14 },
  { top: "80%", left: "20%", size: 14 },
  { top: "86%", left: "46%", size: 14 },
];

export default function HelloCloud() {
  const [centerIndex, setCenterIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCenterIndex((prev) => (prev + 1) % GREETINGS.length);
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  // Words other than the current center one, mapped onto scatter positions.
  const others = GREETINGS.filter((_, i) => i !== centerIndex);

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
      {others.map((word, i) => {
        const pos = POSITIONS[i % POSITIONS.length];
        return (
          <span key={word} style={{
            position: "absolute",
            top: pos.top,
            left: pos.left,
            transform: "translate(-50%, -50%)",
            fontFamily: "Inter, sans-serif",
            fontWeight: 400,
            fontSize: `${pos.size}px`,
            color: "#C8C4BD",
            whiteSpace: "nowrap",
            animation: `hc-float ${3 + (i % 3)}s ease-in-out ${i * 0.2}s infinite`,
            transition: "all 0.6s ease",
          }}>
            {word}
          </span>
        );
      })}
      <span
        key={GREETINGS[centerIndex]}
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          fontFamily: "Inter, sans-serif",
          fontWeight: 600,
          fontSize: "clamp(28px, 6vw, 40px)",
          color: "#0D0D0D",
          letterSpacing: "-0.03em",
          whiteSpace: "nowrap",
          animation: "hc-pop 0.5s ease",
        }}
      >
        {GREETINGS[centerIndex]}
      </span>

      <style>{`
        @keyframes hc-pop {
          0% { opacity: 0; transform: translate(-50%, -50%) scale(0.7); }
          100% { opacity: 1; transform: translate(-50%, -50%) scale(1); }
        }
        @keyframes hc-float {
          0%, 100% { transform: translate(-50%, -50%); }
          50% { transform: translate(-50%, -58%); }
        }
      `}</style>
    </div>
  );
}