import { useRef, useEffect, useState } from "react";
import { motion, useInView, useMotionValue, useSpring, useTransform } from "framer-motion";

const METRICS = [
  { value: 0,  suffix: "",     label: "Missed Calls" },
  { value: 24, suffix: "/7",   label: "Available"    },
  { value: 3,  suffix: "",     label: "Languages"    },
  { value: 13, suffix: "",     label: "Workflows"    },
];

const STAGGER = 0.15;

function AnimatedNumber({ end, suffix, start }) {
  const value = useMotionValue(0);
  const spring = useSpring(value, { damping: 30, stiffness: 100 });
  const display = useTransform(spring, (num) => Math.round(Number(num)));

  useEffect(() => {
    if (start) value.set(end);
  }, [start, end, value]);

  return (
    <span style={{ display: "inline-flex", alignItems: "baseline" }}>
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
      {suffix && (
        <span style={{
          fontFamily: "'Geist Mono', 'JetBrains Mono', ui-monospace, monospace",
          fontWeight: 400,
          fontSize: "2.5rem",
          color: "#000000",
          letterSpacing: "-0.02em",
          lineHeight: 1,
        }}>
          {suffix}
        </span>
      )}
    </span>
  );
}

const cellVariants = {
  hidden: { opacity: 0, y: 16 },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, delay: i * STAGGER, ease: [0.22, 1, 0.36, 1] },
  }),
};

function MetricCell({ metric, index, visible }) {
  const [startCount, setStartCount] = useState(false);

  useEffect(() => {
    if (visible) {
      const timer = setTimeout(() => setStartCount(true), index * STAGGER * 1000 + 200);
      return () => clearTimeout(timer);
    }
  }, [visible, index]);

  return (
    <motion.div
      custom={index}
      variants={cellVariants}
      initial="hidden"
      animate={visible ? "visible" : "hidden"}
      style={{
        flex: "1 1 25%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "36px 20px",
        gap: "10px",
      }}
    >
      <AnimatedNumber end={metric.value} suffix={metric.suffix} start={startCount} />
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
    </motion.div>
  );
}

export default function ProofBar() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.2 });

  return (
    <section data-proof-bar style={{ padding: "0 24px 40px" }}>
      <div
        ref={ref}
        style={{
          maxWidth: "680px",
          margin: "0 auto",
          display: "flex",
        }}
      >
        {METRICS.map((metric, i) => (
          <MetricCell key={i} metric={metric} index={i} visible={isInView} />
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