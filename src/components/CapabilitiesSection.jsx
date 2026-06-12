import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

/* ── Data ── */
const CENTER = { label: "Yael AI Core", sub: "Voice receptionist engine", icon: Cpu, color: "#2563eb" };

const OUTPUTS = [
  { label: "Staff SMS", sub: "Real-time for every action", icon: MessageSquare, color: "#2563eb" },
  { label: "CRM Sync", sub: "No manual data entry", icon: RefreshCw, color: "#2563eb" },
  { label: "24/7 Live", sub: "No voicemail, no missed calls", icon: Clock, color: "#2563eb" },
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

/* ── Node card (light theme) ── */
function NodeCard({ label, sub, icon: IconComp, variant = "default", accentColor }) {
  const isCore = variant === "core";
  return (
    <div style={{
      border: isCore ? `1.5px solid ${accentColor}40` : "1px solid #e0ddd8",
      borderRadius: "10px",
      background: isCore ? "#ffffff" : "#fafaf8",
      padding: isCore ? "14px 18px" : "10px 14px",
      textAlign: "left",
      minWidth: isCore ? "180px" : "160px",
      boxShadow: isCore ? "0 0 0 4px rgba(37,99,235,0.04), 0 2px 12px rgba(0,0,0,0.04)" : undefined,
    }}>
      <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
        {IconComp && (
          <div style={{
            display: "flex", alignItems: "center", justifyContent: "center",
            width: "26px", height: "26px", borderRadius: "6px",
            background: `${accentColor}12`,
            color: accentColor,
            flexShrink: 0,
          }}>
            <IconComp />
          </div>
        )}
        <div style={{ minWidth: 0 }}>
          <div style={{
            fontFamily: "'DM Sans', sans-serif",
            fontWeight: isCore ? 600 : 500,
            fontSize: isCore ? "14px" : "12px",
            color: "#000000",
            letterSpacing: "-0.01em",
            lineHeight: 1.2,
            marginBottom: "2px",
          }}>
            {label}
          </div>
          <div style={{
            fontFamily: "Inter, sans-serif", fontWeight: 400, fontSize: "10px",
            color: "#a59f97", lineHeight: 1.3,
          }}>
            {sub}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ── Dot grid background (light) ── */
function DotGrid() {
  return (
    <div style={{
      position: "absolute", inset: 0, zIndex: 0, opacity: 0.22,
      backgroundImage: "radial-gradient(circle, #c4bfb8 1px, transparent 1px)",
      backgroundSize: "18px 18px",
      pointerEvents: "none",
    }} />
  );
}

/* ── Flowing line with dash animation ── */
function FlowLine({ d, color, delay, visible }) {
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
      <path d={d} stroke={color} strokeWidth="1.5" fill="none" opacity={0.18} />
      {/* Flowing dash */}
      <path
        d={d}
        stroke={color}
        strokeWidth="1.8"
        fill="none"
        strokeDasharray="6 14"
        strokeDashoffset={-flowOffset * 20}
        opacity={0.75}
      />
      {/* Traveling dot 1 */}
      <circle r="3" fill={color} opacity={0.9}>
        <animateMotion dur="2s" repeatCount="indefinite" path={d} begin={`${delay}s`} />
      </circle>
      {/* Traveling dot 2 */}
      <circle r="2" fill={color} opacity={0.5}>
        <animateMotion dur="2s" repeatCount="indefinite" path={d} begin={`${delay + 1}s`} />
      </circle>
    </g>
  );
}

/* ── Connection paths (source → outputs) ── */
const CONNECTIONS = [
  { d: "M 206,78 Q 280,78 330,98 Q 344,106 348,102", delay: 0 },
  { d: "M 206,128 Q 300,128 330,128 Q 344,128 348,128", delay: 0.2 },
  { d: "M 206,178 Q 280,178 330,158 Q 344,150 348,154", delay: 0.4 },
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

  // Auto-advance once started
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

        {/* ═══════ DIAGRAM — light grey ═══════ */}
        <div style={{
          position: "relative",
          borderRadius: "18px",
          background: "#fafaf8",
          overflow: "hidden",
          minHeight: "260px",
          border: "1px solid #e8e5e0",
        }}>
          <DotGrid />

          {/* ═══ CONTENT: left → right ═══ */}
          <div style={{
            position: "relative", zIndex: 2,
            padding: "clamp(24px, 4vw, 36px) clamp(32px, 5vw, 48px)",
            display: "flex", alignItems: "center",
            justifyContent: "space-between",
            gap: "clamp(12px, 2vw, 24px)",
          }}>

            {/* ── LEFT: Source ── */}
            <motion.div
              animate={phase === 0 ? { scale: [1, 1.025, 1] } : { scale: 1 }}
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
                viewBox="0 0 150 208"
                preserveAspectRatio="xMidYMid meet"
                style={{ position: "absolute", inset: 0 }}
              >
                <AnimatePresence>
                  {phase >= 1 && CONNECTIONS.map((conn, i) => (
                    <FlowLine
                      key={i}
                      d={conn.d}
                      color="#2563eb"
                      delay={conn.delay}
                      visible={phase >= 1}
                    />
                  ))}
                </AnimatePresence>
              </svg>
            </div>

            {/* ── RIGHT: Outputs ── */}
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
                  position: "absolute", bottom: "18px", left: 0, right: 0,
                  display: "flex", justifyContent: "center",
                }}
              >
                <div style={{
                  fontFamily: "Inter, sans-serif", fontWeight: 500, fontSize: "11px",
                  color: "#2563eb", letterSpacing: "-0.01em",
                  border: "1px solid rgba(37,99,235,0.20)",
                  borderRadius: "9999px", padding: "5px 16px",
                  background: "rgba(37,99,235,0.04)",
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