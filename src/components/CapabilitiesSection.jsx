import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

/* ── Capabilities data — 4 columns × 5 rows ── */
const CAPABILITIES = [
  // Column 1 — Call Intelligence
  [
    "Answers every inbound call within one ring",
    "Detects language — Hebrew, French, English",
    "Recognizes returning patients by phone number",
    "Greets returning patients by name",
    "De-escalation for frustrated callers",
  ],
  // Column 2 — Scheduling
  [
    "Books appointments — treatment, doctor, date, time",
    "Sends SMS booking confirmation to patient",
    "Appointment modification — date, time, reason",
    "Appointment cancellation",
    "Waitlist enrollment for full emergency slots",
  ],
  // Column 3 — Patient Management
  [
    "New patient registration — name, ID, DOB, HMO",
    "Emergency triage with same-day fee disclosure",
    "Insurance & HMO coverage questions handled",
    "Treatment price inquiries answered",
    "Missed call recovery workflow",
  ],
  // Column 4 — Staff & Compliance
  [
    "Staff transfer with warm handoff",
    "Transfer fallback — callback if no answer",
    "Post-call SMS to staff for every action taken",
    "Call lifecycle logging — recorded & analyzed",
    "PII-compliant — auto-redacted in logs",
  ],
];

const COLUMN_LABELS = ["Call Intelligence", "Scheduling", "Patient Management", "Staff & Compliance"];

/* ── Inline SVG icon ── */
function Cpu() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="4" y="4" width="16" height="16" rx="2" /><rect x="9" y="9" width="6" height="6" />
      <path d="M15 2v2M9 2v2M15 20v2M9 20v2M20 15h2M2 15h2M20 9h2M2 9h2" />
    </svg>
  );
}

/* ── Dot grid background ── */
function DotGrid() {
  return (
    <div style={{
      position: "absolute", inset: 0, zIndex: 0, opacity: 0.18,
      backgroundImage: "radial-gradient(circle, #c4bfb8 1px, transparent 1px)",
      backgroundSize: "18px 18px",
      pointerEvents: "none",
    }} />
  );
}

/* ── Tiny capability card ── */
function CapCard({ text }) {
  return (
    <div style={{
      border: "1px solid #e8e5e0",
      borderRadius: "8px",
      background: "#ffffff",
      padding: "7px 10px",
      fontSize: "11px",
      fontFamily: "Inter, sans-serif",
      fontWeight: 400,
      color: "#33302e",
      lineHeight: 1.35,
      letterSpacing: "-0.01em",
    }}>
      {text}
    </div>
  );
}

/* ── Flowing line with dash + traveling dots ── */
function FlowLine({ d, delay, visible }) {
  const [flowOffset, setFlowOffset] = useState(0);

  useEffect(() => {
    if (!visible) return;
    const dur = 1600;
    const step = 60;
    let start = Date.now();
    const tick = () => {
      const elapsed = (Date.now() - start) % dur;
      setFlowOffset((elapsed / dur) * 4);
    };
    const id = setInterval(tick, step);
    return () => clearInterval(id);
  }, [visible]);

  if (!visible) return null;

  return (
    <g>
      {/* Faint base line */}
      <path d={d} stroke="#2563eb" strokeWidth="1" fill="none" opacity={0.15} />
      {/* Flowing dash */}
      <path
        d={d}
        stroke="#2563eb"
        strokeWidth="1.6"
        fill="none"
        strokeDasharray="5 12"
        strokeDashoffset={-flowOffset * 17}
        opacity={0.65}
      />
      {/* Traveling dot */}
      <circle r="2.5" fill="#2563eb" opacity={0.8}>
        <animateMotion dur="2.2s" repeatCount="indefinite" path={d} begin={`${delay}s`} />
      </circle>
    </g>
  );
}

/* ── Generate SVG paths from core to each capability ── */
// Core center in SVG coords: y=210, right edge at x=0
// Columns: col 0 at x=155, col 1 at x=330, col 2 at x=505, col 3 at x=680
// Rows: 5 per column, spaced at y ≈ 20, 98, 176, 254, 332 (center of each card)
const COL_X = [220, 370, 520, 670];
const ROW_Y = [28, 102, 176, 250, 324];
const CORE_Y = 210;

function buildConnections() {
  const paths = [];
  let delay = 0;
  const originX = 130; // near core right edge in SVG space
  for (let col = 0; col < 4; col++) {
    for (let row = 0; row < 5; row++) {
      const tx = COL_X[col];
      const ty = ROW_Y[row];
      const cp1x = originX + (tx - originX) * 0.35;
      const cp1y = CORE_Y + (ty - CORE_Y) * 0.15;
      const cp2x = originX + (tx - originX) * 0.65;
      const cp2y = CORE_Y + (ty - CORE_Y) * 0.75;
      const d = `M ${originX},${CORE_Y} C ${cp1x},${cp1y} ${cp2x},${cp2y} ${tx},${ty}`;
      paths.push({ d, delay });
      delay += 0.06;
    }
  }
  return paths;
}

const CONNECTIONS = buildConnections();

/* ── Main section ── */
export default function CapabilitiesSection() {
  const [phase, setPhase] = useState(0);
  // 0 = core pulsing only
  // 1 = lines + all nodes appear

  const [started, setStarted] = useState(false);
  const sectionRef = useRef(null);

  // Scroll trigger
  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !started) setStarted(true);
      },
      { threshold: 0.25 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [started]);

  // Auto-advance
  useEffect(() => {
    if (!started) return;
    const t = setTimeout(() => setPhase(1), 700);
    return () => clearTimeout(t);
  }, [started]);

  return (
    <section ref={sectionRef} data-capabilities style={{ background: "#fdfcfc", padding: "100px 48px" }}>
      <div style={{ maxWidth: "960px", margin: "0 auto" }}>

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

        {/* ═══════ DIAGRAM ═══════ */}
        <div style={{
          position: "relative",
          borderRadius: "18px",
          background: "#fafaf8",
          overflow: "hidden",
          border: "1px solid #e8e5e0",
          minHeight: "380px",
        }}>
          <DotGrid />

          <div className="caps-diagram-content" style={{
            position: "relative", zIndex: 2,
            padding: "clamp(24px, 3vw, 32px) clamp(8px, 1.5vw, 16px)",
            display: "flex", alignItems: "stretch",
            gap: "0",
          }}>

            {/* ── LEFT: Yael AI Core ── */}
            <div className="caps-core-col" style={{
              flexShrink: 0,
              width: "clamp(140px, 18%, 170px)",
              display: "flex", alignItems: "center", justifyContent: "center",
            }}>
              <motion.div
                animate={phase === 0 ? { scale: [1, 1.03, 1] } : { scale: 1 }}
                transition={phase === 0 ? { repeat: Infinity, duration: 2.8, ease: "easeInOut" } : {}}
                style={{ width: "100%" }}
              >
                <div style={{
                  border: "1.5px solid rgba(37,99,235,0.25)",
                  borderRadius: "12px",
                  background: "#ffffff",
                  padding: "16px 14px",
                  textAlign: "center",
                  boxShadow: "0 0 0 5px rgba(37,99,235,0.03), 0 2px 16px rgba(0,0,0,0.04)",
                }}>
                  <div style={{
                    display: "flex", alignItems: "center", justifyContent: "center",
                    width: "30px", height: "30px", borderRadius: "8px",
                    background: "rgba(37,99,235,0.10)", color: "#2563eb",
                    margin: "0 auto 6px auto",
                  }}>
                    <Cpu />
                  </div>
                  <div style={{
                    fontFamily: "'DM Sans', sans-serif", fontWeight: 600, fontSize: "15px",
                    color: "#000000", letterSpacing: "-0.02em", lineHeight: 1.2,
                    marginBottom: "2px",
                  }}>
                    Yael AI Core
                  </div>
                  <div style={{
                    fontFamily: "Inter, sans-serif", fontWeight: 400, fontSize: "10px",
                    color: "#a59f97", lineHeight: 1.3,
                  }}>
                    Voice receptionist engine
                  </div>
                </div>
              </motion.div>
            </div>

            {/* ── SVG overlay for all connection lines ── */}
            <svg
              viewBox="0 0 700 420"
              preserveAspectRatio="none"
              style={{
                position: "absolute",
                inset: 0,
                zIndex: 3,
                width: "100%",
                height: "100%",
                pointerEvents: "none",
              }}
            >
              <AnimatePresence>
                {CONNECTIONS.map((conn, i) => (
                  <FlowLine
                    key={i}
                    d={conn.d}
                    delay={conn.delay}
                    visible={phase >= 1}
                  />
                ))}
              </AnimatePresence>
            </svg>

            {/* ── RIGHT: 4 columns of capability cards ── */}
            <div className="caps-grid-col" style={{
              flex: 1,
              display: "flex",
              gap: "clamp(8px, 1.5vw, 14px)",
              minWidth: 0,
            }}>
              {CAPABILITIES.map((col, colIdx) => (
                <div key={colIdx} className="caps-col" style={{ flex: "1 1 0", minWidth: 0, display: "flex", flexDirection: "column" }}>
                  {/* Column header */}
                  <AnimatePresence>
                    {phase >= 1 && (
                      <motion.div
                        initial={{ opacity: 0, y: -6 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.15 + colIdx * 0.12, duration: 0.35 }}
                        style={{
                          fontFamily: "'Geist Mono', monospace",
                          fontWeight: 500,
                          fontSize: "10px",
                          textTransform: "uppercase",
                          letterSpacing: "0.08em",
                          color: "#2563eb",
                          marginBottom: "12px",
                          textAlign: "center",
                          whiteSpace: "nowrap",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                        }}
                      >
                        {COLUMN_LABELS[colIdx]}
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Cards */}
                  <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                    <AnimatePresence>
                      {phase >= 1 && col.map((text, rowIdx) => (
                        <motion.div
                          key={text}
                          initial={{ opacity: 0, x: 20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.20 + colIdx * 0.08 + rowIdx * 0.06, duration: 0.4 }}
                        >
                          <CapCard text={text} />
                        </motion.div>
                      ))}
                    </AnimatePresence>
                  </div>
                </div>
              ))}
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
                  position: "absolute", bottom: "16px", left: 0, right: 0,
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
        @media (max-width: 1024px) {
          [data-capabilities] { padding: 64px 24px !important; }
        }
        @media (max-width: 768px) {
          [data-capabilities] { padding: 48px 16px !important; }
          .caps-diagram-content { flex-direction: column !important; align-items: center !important; }
          .caps-core-col { width: 100% !important; max-width: 220px !important; margin-bottom: 24px !important; }
          .caps-grid-col { flex-wrap: wrap !important; gap: 12px !important; }
          .caps-col { flex: 1 1 calc(50% - 6px) !important; min-width: 140px !important; }
        }
      `}</style>
    </section>
  );
}