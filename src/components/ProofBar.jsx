import React, { useEffect, useRef, useState } from "react";

const METRICS = [
  { value: 0,    display: "0",    label: "Missed Calls", isText: false },
  { value: null, display: "24/7", label: "Available",    isText: true  },
  { value: 3,    display: "3",    label: "Languages",    isText: false },
  { value: 13,   display: "13",   label: "Workflows",    isText: false },
];

function useCountUp(target, duration, active) {
  const [count, setCount] = useState(0);
  const raf = useRef(null);

  useEffect(() => {
    if (!active || target === null) return;
    const start = performance.now();

    const tick = (now) => {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      // ease-out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.round(eased * target));
      if (progress < 1) raf.current = requestAnimationFrame(tick);
    };

    raf.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf.current);
  }, [active, target, duration]);

  return count;
}

function Metric({ metric, active, isLast }) {
  const count = useCountUp(metric.value, 1200, active);

  return (
    <div
      style={{
        flex: 1,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "28px 16px",
        borderRight: isLast ? "none" : "1px solid #e5e5e5",
        gap: "6px",
      }}
    >
      <span
        style={{
          fontFamily: "'Geist Mono', 'JetBrains Mono', ui-monospace, monospace",
          fontWeight: 400,
          fontSize: "2.5rem",
          color: "#000000",
          letterSpacing: "-0.02em",
          lineHeight: 1,
          opacity: metric.isText && !active ? 0 : 1,
          transition: metric.isText ? "opacity 0.6s ease-out" : "none",
        }}
      >
        {metric.isText ? metric.display : count}
      </span>
      <span
        style={{
          fontFamily: "Inter, sans-serif",
          fontWeight: 500,
          fontSize: "10px",
          textTransform: "uppercase",
          letterSpacing: "0.1px",
          color: "#a59f97",
        }}
      >
        {metric.label}
      </span>
    </div>
  );
}

export default function ProofBar() {
  const [active, setActive] = useState(false);
  const ref = useRef(null);

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

  return (
    <section style={{ padding: "0 24px 40px", backgroundColor: "#fdfcfc" }}>
      <div
        ref={ref}
        style={{
          maxWidth: "680px",
          margin: "0 auto",
          backgroundColor: "#f5f3f1",
          border: "1px solid #e5e5e5",
          borderRadius: "20px",
          overflow: "hidden",
          display: "flex",
          flexWrap: "wrap",
        }}
      >
        {METRICS.map((metric, i) => (
          <div
            key={i}
            style={{
              flex: "1 1 calc(25%)",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              padding: "28px 16px",
              borderRight: i < METRICS.length - 1 ? "1px solid #e5e5e5" : "none",
              gap: "6px",
            }}
            className={`proof-cell proof-cell-${i}`}
          >
            <span
              style={{
                fontFamily: "'Geist Mono', 'JetBrains Mono', ui-monospace, monospace",
                fontWeight: 400,
                fontSize: "2.5rem",
                color: "#000000",
                letterSpacing: "-0.02em",
                lineHeight: 1,
                opacity: metric.isText ? (active ? 1 : 0) : 1,
                transition: metric.isText ? "opacity 0.6s ease-out" : "none",
              }}
            >
              {metric.isText ? metric.display : <CountUp target={metric.value} active={active} />}
            </span>
            <span
              style={{
                fontFamily: "Inter, sans-serif",
                fontWeight: 500,
                fontSize: "10px",
                textTransform: "uppercase",
                letterSpacing: "0.1px",
                color: "#a59f97",
              }}
            >
              {metric.label}
            </span>
          </div>
        ))}
      </div>
      <style>{`
        @media (max-width: 1024px) {
          section { padding: 0 16px 32px !important; }
        }
        @media (max-width: 480px) {
          .proof-cell { flex: 1 1 calc(50%) !important; }
          .proof-cell-1 { border-right: none !important; }
          .proof-cell-2 { border-right: 1px solid #e5e5e5 !important; }
          .proof-cell-0, .proof-cell-1 { border-bottom: 1px solid #e5e5e5; }
        }
      `}</style>
    </section>
  );
}

function CountUp({ target, active }) {
  const [count, setCount] = useState(0);
  const raf = useRef(null);

  useEffect(() => {
    if (!active) return;
    const start = performance.now();
    const duration = 1200;

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