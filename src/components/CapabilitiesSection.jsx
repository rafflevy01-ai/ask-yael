import React, { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";

/* ── Data ── */
const INPUTS = [
  { label: "Incoming Call", sub: "Patient dials the clinic", icon: Phone },
  { label: "Missed Call Recovery", sub: "Calls back unanswered", icon: Redial },
  { label: "Language Detection", sub: "Hebrew · French · English", icon: Globe },
  { label: "Patient Recognition", sub: "New or returning — by phone", icon: UserCheck },
];

const CENTER = { label: "Yael AI Core", sub: "Voice receptionist engine", icon: Cpu };

const CAPABILITIES = [
  { label: "Booking", sub: "Book, modify, cancel" },
  { label: "Emergency Triage", sub: "Same-day fee disclosure" },
  { label: "Registration", sub: "Name, DOB, HMO, reason" },
  { label: "Pricing & Treatments", sub: "Cost and procedure info" },
  { label: "HMO & Insurance", sub: "Coverage questions" },
];

const OUTPUTS = [
  { label: "Staff SMS", sub: "Real-time for every action" },
  { label: "CRM Sync", sub: "No manual data entry" },
  { label: "24/7 Availability", sub: "No voicemail, no missed calls" },
];

/* ── SVG icon functions (simple inline SVGs) ── */
function Phone() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 9.81a19.79 19.79 0 01-3.07-8.67A2 2 0 012 .84h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L6.09 8.73a16 16 0 006.72 6.72l1.06-1.16a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z" />
    </svg>
  );
}
function Redial() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M23 4v6h-6" /><path d="M1 20v-6h6" />
      <path d="M3.51 9a9 9 0 0114.85-3.36L23 10" /><path d="M1 14l4.64 4.36A9 9 0 0020.49 15" />
    </svg>
  );
}
function Globe() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" /><path d="M2 12h20" /><path d="M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 01-4-10 15.3 15.3 0 014-10z" />
    </svg>
  );
}
function UserCheck() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4-4v2" /><circle cx="9" cy="7" r="4" />
      <path d="M16 11l2 2 4-4" />
    </svg>
  );
}
function Cpu() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="4" y="4" width="16" height="16" rx="2" /><rect x="9" y="9" width="6" height="6" />
      <path d="M15 2v2M9 2v2M15 20v2M9 20v2M20 15h2M2 15h2M20 9h2M2 9h2" />
    </svg>
  );
}

/* ── Node card ── */
function NodeCard({ label, sub, icon: Icon, variant = "default", style }) {
  const isCore = variant === "core";
  const isDimmed = variant === "dimmed";
  return (
    <div
      style={{
        border: isCore ? "1.5px solid rgba(0,0,0,0.20)" : "1px solid #e0ddd8",
        borderRadius: "12px",
        background: isCore ? "#ffffff" : "#fafaf8",
        padding: isCore ? "14px 18px" : "10px 14px",
        textAlign: "center",
        boxShadow: isCore
          ? "0 0 0 5px rgba(0,0,0,0.025), 0 2px 16px rgba(0,0,0,0.05)"
          : undefined,
        opacity: isDimmed ? 0.35 : 1,
        transition: "opacity 0.5s ease",
        ...style,
      }}>
      <div style={{
        display: "flex", alignItems: "center", justifyContent: "center",
        marginBottom: isCore ? "6px" : "8px",
        color: "#a59f97",
      }}>
        <Icon />
      </div>
      <div style={{
        fontFamily: "'DM Sans', sans-serif",
        fontWeight: isCore ? 600 : 500,
        fontSize: isCore ? "15px" : "12px",
        color: "#000000",
        letterSpacing: "-0.02em",
        lineHeight: 1.2,
        marginBottom: isCore ? "4px" : "2px",
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
  );
}

/* ── Bezier beam (animated SVG path) ── */
function Beam({ d, active, delay = 0 }) {
  return (
    <motion.path
      d={d}
      stroke={active ? "#2563eb" : "#d4d0ca"}
      strokeWidth={active ? 1.5 : 0.8}
      fill="none"
      initial={{ pathLength: 0, opacity: 0 }}
      animate={active ? { pathLength: 1, opacity: 1 } : { pathLength: 0, opacity: 0 }}
      transition={{ duration: 0.7, delay, ease: "easeInOut" }}
      style={{ filter: active ? "drop-shadow(0 0 3px rgba(37,99,235,0.3))" : undefined }}
    />
  );
}

/* ── Dot grid background ── */
function DotGrid() {
  return (
    <div
      style={{
        position: "absolute", inset: 0, zIndex: 0, opacity: 0.25,
        backgroundImage: "radial-gradient(circle, #c4bfb8 1px, transparent 1px)",
        backgroundSize: "16px 16px",
        pointerEvents: "none",
      }}
    />
  );
}

/* ── Main section ── */
export default function CapabilitiesSection() {
  const [phase, setPhase] = useState(0);
  // 0 = initial (center only)
  // 1 = inputs connected → center
  // 2 = capabilities branch out
  // 3 = outputs auto-appear

  const advance = useCallback(() => setPhase((p) => Math.min(p + 1, 3)), []);

  // Auto-advance from phase 2 to 3 after delay
  useEffect(() => {
    if (phase === 2) {
      const t = setTimeout(() => setPhase(3), 1200);
      return () => clearTimeout(t);
    }
  }, [phase]);

  // SVG viewBox coordinates
  const VW = 600, VH = 360;
  // Layout positions
  const leftXs = [60, 60, 60, 60];
  const leftYs = [60, 120, 180, 240];
  const leftRx = 180; // right edge of left nodes

  const centerLx = 270, centerRx = 330, centerY = 180;

  const rightLx = 420;
  const capYs = [60, 115, 170, 225, 280];
  const outYs = [310, 330, 350];

  // Build bezier paths
  const leftBeams = leftYs.map((y, i) => {
    const midX = (leftRx + centerLx) / 2;
    return { d: `M ${leftRx},${y} C ${midX},${y} ${midX},${centerY} ${centerLx},${centerY}`, fromX: leftRx, fromY: y, toX: centerLx, toY: centerY };
  });

  const rightBeams = [...capYs, ...outYs].map((y, i) => {
    const midX = (centerRx + rightLx) / 2;
    return { d: `M ${centerRx},${centerY} C ${midX},${centerY} ${midX},${y} ${rightLx},${y}`, fromX: centerRx, fromY: centerY, toX: rightLx, toY: y };
  });

  return (
    <section data-capabilities style={{ background: "#fdfcfc", padding: "100px 48px" }}>
      <div style={{ maxWidth: "760px", margin: "0 auto" }}>

        {/* ── Label ── */}
        <span style={{
          fontFamily: "Inter, sans-serif", fontWeight: 500, fontSize: "10px",
          textTransform: "uppercase", letterSpacing: "0.12em", color: "#a59f97",
          display: "block", marginBottom: "14px",
        }}>
          Capabilities
        </span>

        {/* ── Headline ── */}
        <h2 style={{
          fontFamily: "'DM Sans', sans-serif", fontWeight: 300, fontSize: "36px",
          color: "#000000", letterSpacing: "-0.72px", lineHeight: 1.15,
          margin: "0 0 48px 0",
        }}>
          Everything your front desk handles. Automated.
        </h2>

        {/* ═══════ DIAGRAM ═══════ */}
        <div style={{
          position: "relative",
          border: "1px solid #e8e5e0",
          borderRadius: "18px",
          background: "#fafaf8",
          overflow: "hidden",
        }}>
          <DotGrid />

          {/* SVG beams layer */}
          <svg
            viewBox={`0 0 ${VW} ${VH}`}
            preserveAspectRatio="xMidYMid meet"
            style={{
              width: "100%", height: "auto",
              position: "absolute", inset: 0, zIndex: 1,
              pointerEvents: "none",
            }}
          >
            {/* Left → Center beams */}
            {leftBeams.map((b, i) => (
              <g key={`lb${i}`}>
                <Beam d={b.d} active={phase >= 1} delay={i * 0.1} />
                {phase >= 1 && (
                  <>
                    <motion.circle cx={b.fromX} cy={b.fromY} r={3} fill="#2563eb"
                      initial={{ opacity: 0, scale: 0 }} animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: i * 0.1 + 0.4, duration: 0.3 }} />
                    <motion.circle cx={b.toX} cy={b.toY} r={3} fill="#2563eb"
                      initial={{ opacity: 0, scale: 0 }} animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: i * 0.1 + 0.6, duration: 0.3 }} />
                  </>
                )}
              </g>
            ))}

            {/* Center → Right beams (capabilities) */}
            {rightBeams.slice(0, 5).map((b, i) => (
              <g key={`cb${i}`}>
                <Beam d={b.d} active={phase >= 2} delay={i * 0.1} />
                {phase >= 2 && (
                  <motion.circle cx={b.toX} cy={b.toY} r={3} fill="#2563eb"
                    initial={{ opacity: 0, scale: 0 }} animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: i * 0.1 + 0.5, duration: 0.3 }} />
                )}
              </g>
            ))}

            {/* Center → Right beams (outputs) */}
            {rightBeams.slice(5).map((b, i) => (
              <g key={`ob${i}`}>
                <Beam d={b.d} active={phase >= 3} delay={i * 0.1} />
                {phase >= 3 && (
                  <motion.circle cx={b.toX} cy={b.toY} r={3} fill="#2563eb"
                    initial={{ opacity: 0, scale: 0 }} animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: i * 0.1 + 0.5, duration: 0.3 }} />
                )}
              </g>
            ))}

            {/* Center node anchor dots */}
            {phase >= 1 && (
              <>
                {leftYs.map((y, i) => (
                  <motion.circle key={`la${i}`} cx={centerLx} cy={centerY} r={3} fill="#2563eb"
                    initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                    transition={{ delay: i * 0.1 + 0.6 }} />
                ))}
              </>
            )}
          </svg>

          {/* ── Nodes layer ── */}
          <div style={{
            position: "relative", zIndex: 2,
            padding: "clamp(24px, 4vw, 40px)",
          }}>

            {/* LEFT — Input nodes */}
            <AnimatePresence>
              {phase >= 1 && (
                <motion.div
                  initial={{ opacity: 0, x: -30 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5 }}
                  style={{
                    position: "absolute",
                    left: "clamp(16px, 4vw, 32px)",
                    top: "50%",
                    transform: "translateY(-50%)",
                    display: "flex", flexDirection: "column", gap: "10px",
                    width: "clamp(150px, 22vw, 190px)",
                  }}>
                  {INPUTS.map((n, i) => (
                    <motion.div
                      key={n.label}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.2 + i * 0.12, duration: 0.4 }}
                    >
                      <NodeCard label={n.label} sub={n.sub} icon={n.icon} />
                    </motion.div>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>

            {/* CENTER — Yael Core */}
            <div style={{
              display: "flex", justifyContent: "center", alignItems: "center",
              minHeight: phase === 0 ? "280px" : "380px",
            }}>
              <motion.div
                animate={phase === 0 ? { scale: [1, 1.03, 1] } : { scale: 1 }}
                transition={phase === 0 ? { repeat: Infinity, duration: 2.5, ease: "easeInOut" } : {}}
                style={{
                  width: "clamp(180px, 28vw, 240px)",
                  cursor: phase < 3 ? "pointer" : "default",
                }}
                onClick={advance}
              >
                <NodeCard label={CENTER.label} sub={CENTER.sub} icon={Cpu} variant="core" />
              </motion.div>

              {/* CTA label */}
              {phase < 3 && (
                <div
                  onClick={advance}
                  style={{
                    position: "absolute", bottom: "clamp(16px, 3vw, 28px)",
                    left: "50%", transform: "translateX(-50%)",
                    cursor: "pointer",
                  }}>
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3 }}
                    style={{
                      fontFamily: "Inter, sans-serif", fontWeight: 500, fontSize: "12px",
                      color: "#2563eb", letterSpacing: "-0.01em",
                      border: "1px solid rgba(37,99,235,0.25)",
                      borderRadius: "9999px", padding: "6px 18px",
                    }}>
                    {phase === 0 && "Tap to see how Yael works"}
                    {phase === 1 && "See what Yael can do"}
                    {phase === 2 && <>Capabilities active — outputs loading&hellip;</>}
                  </motion.div>
                </div>
              )}
            </div>

            {/* RIGHT — Capabilities & Outputs */}
            <AnimatePresence>
              {phase >= 2 && (
                <motion.div
                  initial={{ opacity: 0, x: 30 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5 }}
                  style={{
                    position: "absolute",
                    right: "clamp(16px, 4vw, 32px)",
                    top: "50%",
                    transform: "translateY(-50%)",
                    display: "flex", flexDirection: "column", gap: "10px",
                    width: "clamp(150px, 22vw, 190px)",
                  }}>

                  {/* Capabilities */}
                  {CAPABILITIES.map((n, i) => (
                    <motion.div
                      key={n.label}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.2 + i * 0.1, duration: 0.4 }}
                    >
                      <NodeCard label={n.label} sub={n.sub} />
                    </motion.div>
                  ))}

                  {/* Outputs */}
                  <AnimatePresence>
                    {phase >= 3 && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        transition={{ duration: 0.5 }}
                      >
                        <div style={{
                          height: "1px", background: "#e8e5e0",
                          margin: "6px 8px 10px 8px",
                        }} />
                        {OUTPUTS.map((n, i) => (
                          <motion.div
                            key={n.label}
                            style={{ marginBottom: i < OUTPUTS.length - 1 ? "10px" : 0 }}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 + i * 0.1, duration: 0.35 }}
                          >
                            <NodeCard label={n.label} sub={n.sub} />
                          </motion.div>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              )}
            </AnimatePresence>

          </div>
        </div>

        {/* ── Closing line ── */}
        <p style={{
          fontFamily: "Inter, sans-serif", fontWeight: 400, fontStyle: "italic",
          fontSize: "14px", color: "#777169", lineHeight: 1.6,
          margin: "36px 0 0 0", textAlign: "center",
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