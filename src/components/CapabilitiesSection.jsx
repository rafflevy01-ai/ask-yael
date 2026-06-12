import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

/* ── Data ── */
const CENTER = { label: "Yael AI Core", sub: "Voice receptionist engine", icon: Cpu, color: "#2563eb" };

const OUTPUTS = [
  { label: "Staff SMS", sub: "Real-time for every action", icon: MessageSquare, color: "#34c759" },
  { label: "CRM Sync", sub: "No manual data entry", icon: RefreshCw, color: "#5856d6" },
  { label: "24/7 Live", sub: "No voicemail, no missed calls", icon: Clock, color: "#ff9500" },
];

/* ── Inline SVG icons ── */
function Cpu() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="4" y="4" width="16" height="16" rx="2" /><rect x="9" y="9" width="6" height="6" />
      <path d="M15 2v2M9 2v2M15 20v2M9 20v2M20 15h2M2 15h2M20 9h2M2 9h2" />
    </svg>
  );
}
function MessageSquare() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" />
    </svg>
  );
}
function RefreshCw() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M23 4v6h-6" /><path d="M1 20v-6h6" />
      <path d="M3.51 9a9 9 0 0114.85-3.36L23 10" /><path d="M1 14l4.64 4.36A9 9 0 0020.49 15" />
    </svg>
  );
}
function Clock() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" />
    </svg>
  );
}

/* ── Node card ── */
function NodeCard({ label, sub, icon: IconComp, variant = "default", accentColor }) {
  const isCore = variant === "core";
  return (
    <div style={{
      border: isCore ? `1.5px solid ${accentColor}` : "1px solid rgba(255,255,255,0.10)",
      borderRadius: "10px",
      background: isCore ? "rgba(37,99,235,0.08)" : "rgba(255,255,255,0.04)",
      padding: isCore ? "14px 18px" : "10px 14px",
      textAlign: "left",
      minWidth: isCore ? "180px" : "160px",
    }}>
      <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
        {IconComp && (
          <div style={{
            display: "flex", alignItems: "center", justifyContent: "center",
            width: "26px", height: "26px", borderRadius: "6px",
            background: `${accentColor}18`,
            color: accentColor,
            flexShrink: 0,
          }}>
            <IconComp />
          </div>
        )}
        <div style={{ minWidth: 0 }}>
          <div style={{
            fontFamily: "Inter, sans-serif",
            fontWeight: 600,
            fontSize: isCore ? "14px" : "12px",
            color: "#ffffff",
            letterSpacing: "-0.01em",
            lineHeight: 1.2,
            marginBottom: "2px",
          }}>
            {label}
          </div>
          <div style={{
            fontFamily: "Inter, sans-serif", fontWeight: 400, fontSize: "10px",
            color: "rgba(255,255,255,0.45)", lineHeight: 1.3,
          }}>
            {sub}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ── Dot grid background ── */
function DotGrid() {
  return (
    <div style={{
      position: "absolute", inset: 0, zIndex: 0, opacity: 0.18,
      backgroundImage: "radial-gradient(circle, rgba(255,255,255,0.15) 1px, transparent 1px)",
      backgroundSize: "20px 20px",
      pointerEvents: "none",
    }} />
  );
}

/* ── Flowing line animation component ── */
function FlowLine({ d, color, delay, visible }) {
  // Dash moves along the path to simulate flow
  const [flowOffset, setFlowOffset] = useState(0);

  useEffect(() => {
    if (!visible) return;
    const dur = 1400;
    const step = 60;
    let start = Date.now();
    const tick = () => {
      const elapsed = (Date.now() - start) % dur;
      setFlowOffset((elapsed / dur) * 4);
    };
    const id = setInterval(tick, step);
    return () => clearInterval(id);
  }, [visible]);

  return (
    <g>
      {/* Base line */}
      <path
        d={d}
        stroke={color}
        strokeWidth="2"
        fill="none"
        opacity={0.2}
      />
      {/* Flowing dash line */}
      <path
        d={d}
        stroke={color}
        strokeWidth="2"
        fill="none"
        strokeDasharray="8 12"
        strokeDashoffset={-flowOffset * 20}
        opacity={0.9}
        style={{ filter: `drop-shadow(0 0 3px ${color}80)` }}
      />
      {/* Glow dots along the path */}
      <circle r="3" fill={color} style={{ filter: `drop-shadow(0 0 4px ${color})` }}>
        <animateMotion dur="1.8s" repeatCount="indefinite" path={d} begin={`${delay}s`} />
      </circle>
      <circle r="2" fill={color} opacity="0.6" style={{ filter: `drop-shadow(0 0 3px ${color})` }}>
        <animateMotion dur="1.8s" repeatCount="indefinite" path={d} begin={`${delay + 0.9}s`} />
      </circle>
    </g>
  );
}

/* ── Connection lines from center to outputs ── */
const CONNECTIONS = [
  {
    d: "M 204,80 Q 280,80 320,100 Q 340,108 344,104",
    color: "#34c759",
    delay: 0,
  },
  {
    d: "M 204,128 Q 300,128 320,128 Q 340,128 344,128",
    color: "#5856d6",
    delay: 0.3,
  },
  {
    d: "M 204,176 Q 280,176 320,156 Q 340,148 344,152",
    color: "#ff9500",
    delay: 0.6,
  },
];

/* ── Main section ── */
export default function CapabilitiesSection() {
  const [phase, setPhase] = useState(0);
  // 0 = source node only, pulsing
  // 1 = lines animate in + output nodes appear

  const [started, setStarted] = useState(false);
  const sectionRef = useRef(null);

  // Trigger on scroll into view
  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !started) setStarted(true);
      },
      { threshold: 0.3 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [started]);

  // Auto-advance phases once started
  useEffect(() => {
    if (!started) return;
    const t = setTimeout(() => setPhase(1), 800);
    return () => clearTimeout(t);
  }, [started]);

  return (
    <section ref={sectionRef} data-capabilities style={{ background: "#fdfcfc", padding: "100px 48px" }}>
      <div style={{ maxWidth: "680px", margin: "0 auto" }}>

        {/* ── Label ── */}
        <span style={{
          fontFamily: "Inter, sans-serif", fontWeight: 500, fontSize: "10px",
          textTransform: "uppercase", letterSpacing: "0.12em", color: "#a59f97",
          display: "block", marginBottom: "14px", textAlign: "center",
        }}>
          Capabilities
        </span>

        {/* ── Headline ── */}
        <h2 style={{
          fontFamily: "'DM Sans', sans-serif", fontWeight: 300, fontSize: "36px",
          color: "#000000", letterSpacing: "-0.72px", lineHeight: 1.15,
          margin: "0 auto 48px auto", textAlign: "center", maxWidth: "480px",
        }}>
          Everything your front desk handles. Automated.
        </h2>

        {/* ═══════ DARK DIAGRAM ═══════ */}
        <div style={{
          position: "relative",
          borderRadius: "18px",
          background: "#0a0a0f",
          overflow: "hidden",
          minHeight: "280px",
          border: "1px solid rgba(255,255,255,0.06)",
        }}>
          <DotGrid />

          {/* ═══ CONTENT — left → right flow ═══ */}
          <div style={{
            position: "relative", zIndex: 2,
            padding: "clamp(24px, 4vw, 40px) clamp(32px, 5vw, 48px)",
            display: "flex", alignItems: "center",
            justifyContent: "space-between",
            gap: "24px",
          }}>

            {/* ── LEFT: Source node ── */}
            <motion.div
              animate={phase === 0 ? { scale: [1, 1.03, 1] } : { scale: 1 }}
              transition={phase === 0 ? { repeat: Infinity, duration: 2.8, ease: "easeInOut" } : {}}
              style={{ flexShrink: 0 }}
            >
              <NodeCard
                label={CENTER.label}
                sub={CENTER.sub}
                icon={Cpu}
                variant="core"
                accentColor={CENTER.color}
              />
            </motion.div>

            {/* ── SVG connector lines ── */}
            <div style={{
              flex: 1,
              position: "relative",
              minWidth: "80px",
              alignSelf: "stretch",
            }}>
              <svg
                width="100%"
                height="100%"
                viewBox="0 0 148 208"
                preserveAspectRatio="xMidYMid meet"
                style={{ position: "absolute", inset: 0 }}
              >
                <AnimatePresence>
                  {phase >= 1 && CONNECTIONS.map((conn, i) => (
                    <FlowLine
                      key={i}
                      d={conn.d}
                      color={conn.color}
                      delay={conn.delay}
                      visible={phase >= 1}
                    />
                  ))}
                </AnimatePresence>
              </svg>
            </div>

            {/* ── RIGHT: Output nodes stacked ── */}
            <div style={{
              flexShrink: 0,
              display: "flex", flexDirection: "column", gap: "16px",
              justifyContent: "center",
            }}>
              <AnimatePresence>
                {phase >= 1 && OUTPUTS.map((n, i) => (
                  <motion.div
                    key={n.label}
                    initial={{ opacity: 0, x: 30 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.30 + i * 0.15, duration: 0.45 }}
                  >
                    <NodeCard
                      label={n.label}
                      sub={n.sub}
                      icon={n.icon}
                      accentColor={n.color}
                    />
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>

          </div>

          {/* ── Progress label ── */}
          <AnimatePresence>
            {phase === 0 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                style={{
                  position: "absolute", bottom: "20px", left: 0, right: 0,
                  display: "flex", justifyContent: "center",
                }}
              >
                <div style={{
                  fontFamily: "Inter, sans-serif", fontWeight: 500, fontSize: "12px",
                  color: "#2563eb", letterSpacing: "-0.01em",
                  border: "1px solid rgba(37,99,235,0.30)",
                  borderRadius: "9999px", padding: "6px 18px",
                  background: "rgba(37,99,235,0.06)",
                }}>
                  Initializing&hellip;
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* ── Closing line ── */}
        <p style={{
          fontFamily: "Inter, sans-serif", fontWeight: 400, fontStyle: "italic",
          fontSize: "14px", color: "#777169", lineHeight: 1.6,
          margin: "36px auto 0 auto", textAlign: "center",
        }}>
          All of this in one call, in the patient's language, 24 hours a day.
        </p>
      </div>

      <style>{`
        @media (max-width: 768px) {
          [data-capabilities] { padding: 48px 16px !important; }
        }
        @media (max-width: 1024px) {
          [data-capabilities] { padding: 64px 24px !important; }
        }
      `}</style>
    </section>
  );
}