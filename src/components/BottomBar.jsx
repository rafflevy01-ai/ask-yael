import React, { useState, useEffect, useRef } from "react";

const STATS = [
  { final: 0, suffix: "", label: "MISSED CALLS" },
  { final: "24/7", suffix: "", label: "AVAILABLE", isString: true },
  { final: 3, suffix: "", label: "LANGUAGES" },
  { final: 13, suffix: "", label: "WORKFLOWS" },
];

function AnimatedNumber({ final, suffix, isString, start }) {
  const [display, setDisplay] = useState(0);
  const ref = useRef(null);

  useEffect(() => {
    if (!start || isString) return;

    const duration = 1200;
    const startTime = performance.now();

    const animate = (now) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // ease-out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplay(Math.round(eased * final));

      if (progress < 1) {
        ref.current = requestAnimationFrame(animate);
      }
    };

    ref.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(ref.current);
  }, [start, final, isString]);

  return (
    <span
      style={{
        fontFamily: "Inter, sans-serif",
        fontWeight: 400,
        fontSize: "28px",
        color: "#0D0D0D",
        letterSpacing: "-0.02em",
      }}>
      {isString ? final : display}{suffix}
    </span>
  );
}

export default function BottomBar() {
  const [started, setStarted] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setStarted(true), 300);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div
      style={{
        width: "100%",
        borderTop: "1px solid rgba(0,0,0,0.08)",
        paddingTop: "20px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        flexWrap: "wrap",
        gap: "16px",
      }}>

      {/* LEFT — animated stats */}
      <div style={{ display: "flex", gap: "48px", alignItems: "flex-end" }}>
        {STATS.map((stat, i) => (
          <div
            key={i}
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: "4px",
            }}>
            <AnimatedNumber
              final={stat.final}
              suffix={stat.suffix}
              isString={stat.isString}
              start={started && (i === 0 ? true : true)}
            />
            <span
              style={{
                fontFamily: "Inter, sans-serif",
                fontWeight: 500,
                fontSize: "10px",
                color: "#888888",
                letterSpacing: "0.1em",
                textTransform: "uppercase",
              }}>
              {stat.label}
            </span>
          </div>
        ))}
      </div>

      {/* RIGHT — avatar + label + live status */}
      <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: "4px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <div
            style={{
              width: "32px",
              height: "32px",
              borderRadius: "50%",
              background: "linear-gradient(135deg, #5893d6, #7ab3e8)",
              flexShrink: 0,
            }}
          />
          <span
            style={{
              fontFamily: "Inter, sans-serif",
              fontWeight: 500,
              fontSize: "14px",
              color: "#1A1A1A",
            }}>
            Yael — AI Receptionist
          </span>
        </div>
        <p
          style={{
            fontFamily: "Inter, sans-serif",
            fontWeight: 400,
            fontStyle: "italic",
            fontSize: "13px",
            color: "#888888",
            margin: 0,
          }}>
          Live at Les Experts Netanya · Handling calls since 2025
        </p>
      </div>

      <style>{`
        @media (max-width: 768px) {
          [style*="gap: 48px"] {
            gap: 24px !important;
            flex-wrap: wrap !important;
          }
        }
      `}</style>
    </div>
  );
}