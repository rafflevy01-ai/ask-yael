import { useRef } from "react";
import { motion, useInView, useMotionValue, useSpring, useTransform } from "framer-motion";

const METRICS = [
  { value: 0,    display: "0",    label: "Missed Calls", isText: false },
  { value: null, display: "24/7", label: "Available",    isText: true  },
  { value: 3,    display: "3",    label: "Languages",    isText: false },
  { value: 13,   display: "13",   label: "Workflows",    isText: false },
];

function AnimatedNumber({ end, isInView }) {
  const value = useMotionValue(0);
  const spring = useSpring(value, { damping: 30, stiffness: 100 });
  const display = useTransform(spring, (num) => Math.round(Number(num)));

  // Trigger the spring when scrolled into view
  value.set(isInView ? end : 0);

  return (
    <motion.span
      style={{
        fontFamily: "'Geist Mono', 'JetBrains Mono', ui-monospace, monospace",
        fontWeight: 400,
        fontSize: "2.5rem",
        color: "#000000",
        letterSpacing: "-0.02em",
        lineHeight: 1,
        display: "inline-block",
      }}
    >
      {display}
    </motion.span>
  );
}

function MetricCell({ metric, isLast }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.5 });

  return (
    <div
      ref={ref}
      style={{
        flex: "1 1 25%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "36px 20px",
        borderRight: isLast ? "none" : "1px solid rgba(0,0,0,0.06)",
        gap: "10px",
      }}
    >
      {metric.isText ? (
        <span
          style={{
            fontFamily: "'Geist Mono', 'JetBrains Mono', ui-monospace, monospace",
            fontWeight: 400,
            fontSize: "2.5rem",
            color: "#000000",
            letterSpacing: "-0.02em",
            lineHeight: 1,
          }}
        >
          {metric.display}
        </span>
      ) : (
        <AnimatedNumber end={metric.value} isInView={isInView} />
      )}
      <span
        style={{
          fontFamily: "Inter, sans-serif",
          fontWeight: 500,
          fontSize: "10px",
          textTransform: "uppercase",
          letterSpacing: "0.12em",
          color: "#a59f97",
        }}
      >
        {metric.label}
      </span>
    </div>
  );
}

export default function ProofBar() {
  return (
    <section data-proof-bar style={{ padding: "0 24px 40px", backgroundColor: "#fdfcfc" }}>
      <div
        style={{
          maxWidth: "680px",
          margin: "0 auto",
          backgroundColor: "#fdfcfc",
          borderRadius: "20px",
          overflow: "hidden",
          display: "flex",
          border: "1px solid #e5e5e5",
        }}
      >
        {METRICS.map((metric, i) => (
          <MetricCell key={i} metric={metric} isLast={i === METRICS.length - 1} />
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