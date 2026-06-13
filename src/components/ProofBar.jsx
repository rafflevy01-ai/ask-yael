import React, { useEffect, useRef, useState } from "react";

const METRICS = [
  { value: 0,    display: "0",    label: "Missed Calls", isText: false },
  { value: null, display: "24/7", label: "Available",    isText: true  },
  { value: 3,    display: "3",    label: "Languages",    isText: false },
  { value: 13,   display: "13",   label: "Workflows",    isText: false },
];

const STAGGER_MS = 120;

function CountUp({ target, active }) {
  const [count, setCount] = useState(0);
  const raf = useRef(null);

  useEffect(() => {
    if (!active) return;
    const start = performance.now();
    const duration = 1400;

    const tick = (now) => {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.round(eased * target));
      if (progress < 1) raf.current = requestAnimationFrame(tick);
    };

    raf.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf.current);
  }, [active, target]);

  return count;
}

export default function ProofBar() {
  const [active, setActive] = useState(false);
  const [visible, setVisible] = useState(0);
  const ref = useRef(null);
  const timersRef = useRef([]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setActive(true);
          observer.disconnect();
        }
      },
      { threshold: 0.3 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  // Staggered reveal
  useEffect(() => {
    if (!active) return;
    timersRef.current.forEach(clearTimeout);
    timersRef.current = [];

    METRICS.forEach((_, i) => {
      const t = setTimeout(() => setVisible((v) => v + 1), 200 + i * STAGGER_MS);
      timersRef.current.push(t);
    });

    return () => timersRef.current.forEach(clearTimeout);
  }, [active]);

  return (
    <section data-proof-bar style={{ padding: "0 24px 40px", backgroundColor: "#fdfcfc" }}>
      <div
        ref={ref}
        style={{
          maxWidth: "680px",
          margin: "0 auto",
          backgroundColor: "#111111",
          borderRadius: "20px",
          overflow: "hidden",
          display: "flex",
        }}
      >
        {METRICS.map((metric, i) => (
          <div
            key={i}
            style={{
              flex: "1 1 25%",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              padding: "36px 20px",
              borderRight: i < METRICS.length - 1 ? "1px solid rgba(255,255,255,0.08)" : "none",
              gap: "10px",
              opacity: visible > i ? 1 : 0,
              transform: visible > i ? "translateY(0)" : "translateY(12px)",
              transition: `opacity 500ms ease-out ${i * STAGGER_MS}ms, transform 500ms ease-out ${i * STAGGER_MS}ms`,
            }}
          >
            <span
              style={{
                fontFamily: "'Geist Mono', 'JetBrains Mono', ui-monospace, monospace",
                fontWeight: 400,
                fontSize: "2.5rem",
                color: "#ffffff",
                letterSpacing: "-0.02em",
                lineHeight: 1,
              }}
            >
              {metric.isText ? (visible > i ? metric.display : "") : (
                <CountUp target={metric.value} active={visible > i} />
              )}
            </span>
            <span
              style={{
                fontFamily: "Inter, sans-serif",
                fontWeight: 500,
                fontSize: "10px",
                textTransform: "uppercase",
                letterSpacing: "0.12em",
                color: "rgba(255,255,255,0.35)",
              }}
            >
              {metric.label}
            </span>
          </div>
        ))}
      </div>

      <style>{`
        @media (max-width: 1024px) {
          [data-proof-bar] { padding: 0 16px 32px !important; }
        }
        @media (max-width: 480px) {
          [data-proof-bar] [style*="flex"] > div {
            padding: 28px 12px !important;
          }
        }
      `}</style>
    </section>
  );
}