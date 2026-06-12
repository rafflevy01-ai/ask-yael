import React, { useState, useEffect, useRef, useCallback } from "react";
import { motion } from "framer-motion";

/* ── Data: call-flow ordered capabilities ── */
const CAPABILITIES = [
  { label: "Missed Call Recovery", sub: "Detects missed calls, initiates outbound" },
  { label: "Auto Language Detection", sub: "Identified on first words spoken" },
  { label: "Returning Patient", sub: "Phone number matched in CRM" },
  { label: "New Patient Registration", sub: "Collect name, DOB, HMO, reason" },
  { label: "Appointment Booking", sub: "Book, modify, cancel — resolved" },
  { label: "Price & Treatments", sub: "Secondary questions handled" },
  { label: "HMO & Insurance", sub: "Follow-up to price inquiry" },
  { label: "Emergency Triage", sub: "Urgent flag, same-day fee disclosure" },
  { label: "Real-time SMS", sub: "Staff notified of every action" },
  { label: "24/7 Availability", sub: "Always on, closes the loop" },
];

const N = CAPABILITIES.length; // 10

/* ── Icons (matching new order) ── */
const ICONS = [
  () => (<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M23 4v6h-6" /><path d="M1 20v-6h6" /><path d="M3.51 9a9 9 0 0114.85-3.36L23 10" /><path d="M1 14l4.64 4.36A9 9 0 0020.49 15" /></svg>),  // Missed call recovery — refresh
  () => (<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10" /><path d="M2 12h20" /><path d="M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 01-4-10 15.3 15.3 0 014-10z" /></svg>),  // Language detection — globe
  () => (<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4-4v2" /><circle cx="9" cy="7" r="4" /><path d="M16 11l2 2 4-4" /></svg>),  // Returning patient — user+check
  () => (<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M16 4h2a2 2 0 012 2v14a2 2 0 01-2 2H6a2 2 0 01-2-2V6a2 2 0 012-2h2" /><rect x="8" y="2" width="8" height="4" rx="1" /></svg>),  // New patient — clipboard
  () => (<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="4" width="18" height="18" rx="2" /><path d="M16 2v4M8 2v4M3 10h18" /></svg>),  // Booking — calendar
  () => (<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="12" y1="1" x2="12" y2="23" /><path d="M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6" /></svg>),  // Price & treatments — $
  () => (<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /></svg>),  // HMO — shield
  () => (<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polygon points="12 2 22 8.5 22 15.5 12 22 2 15.5 2 8.5" /><path d="M12 22V12" /><path d="M12 12l10-3.5" /></svg>),  // Emergency — alert triage
  () => (<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" /></svg>),  // SMS — message
  () => (<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></svg>),  // 24/7 — clock
];

/* ── Organic positions (varying distances from center 50,50) ── */
const POSITIONS = [
  { x: 63, y: 25 },   // 1. Missed Call Recovery — top-right
  { x: 36, y: 18 },   // 2. Language Detection — top-left
  { x: 75, y: 42 },   // 3. Returning Patient — right
  { x: 78, y: 60 },   // 4. New Patient — bottom-right
  { x: 60, y: 82 },   // 5. Booking — bottom
  { x: 38, y: 78 },   // 6. Price & Treatments — bottom-left
  { x: 24, y: 62 },   // 7. HMO & Insurance — left
  { x: 18, y: 42 },   // 8. Emergency Triage — top-left mid
  { x: 34, y: 28 },   // 9. Real-time SMS — top-left upper
  { x: 28, y: 20 },   // 10. 24/7 Availability — top
];

/* ── Center icon ── */
function CenterIcon() {
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
      position: "absolute", inset: 0, zIndex: 0, opacity: 0.14,
      backgroundImage: "radial-gradient(circle, #c4bfb8 1px, transparent 1px)",
      backgroundSize: "20px 20px",
      pointerEvents: "none",
    }} />
  );
}

/* ── Pulse ring around a node ── */
function PulsingBorder({ active, idle }) {
  if (!active && !idle) return null;
  return (
    <motion.div
      initial={active ? { opacity: 0.6, scale: 0.92 } : { opacity: 0.5, scale: 1 }}
      animate={active ? { opacity: [0.6, 0.2, 0.6], scale: [0.92, 1.06, 0.92] } : { opacity: [0.5, 0.2, 0.5], scale: [1, 1.04, 1] }}
      transition={{
        repeat: Infinity,
        duration: active ? 1.8 : 2.6,
        ease: "easeInOut",
      }}
      style={{
        position: "absolute",
        inset: "-6px",
        borderRadius: "inherit",
        border: "2px solid rgba(37,99,235,0.25)",
        pointerEvents: "none",
        zIndex: -1,
      }}
    />
  );
}

/* ── Network node ── */
const BannerNode = React.memo(function BannerNode({ label, sub, icon: Icon, x, y, visible, revealedCount, idx }) {
  const isRevealing = visible && revealedCount === idx + 1;
  const isIdle = visible && revealedCount > idx + 1;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.6 }}
      animate={{
        opacity: visible ? 1 : 0,
        scale: visible ? 1 : 0.6,
      }}
      transition={{ duration: 0.45, ease: "easeOut" }}
      style={{
        position: "absolute",
        left: `${x}%`,
        top: `${y}%`,
        transform: "translate(-50%, -50%)",
        width: "clamp(130px, 16vw, 155px)",
        pointerEvents: "none",
      }}
    >
      <div style={{
        position: "relative",
        border: isRevealing ? "1.5px solid rgba(37,99,235,0.50)" : isIdle ? "1px solid rgba(37,99,235,0.22)" : "1px solid #e0ddd8",
        borderRadius: "10px",
        background: isRevealing ? "rgba(37,99,235,0.05)" : isIdle ? "rgba(37,99,235,0.02)" : "#fafaf8",
        padding: "10px 12px",
        textAlign: "center",
        transition: "border 0.6s, background 0.6s",
      }}>
        <PulsingBorder active={isRevealing} idle={isIdle} />
        {Icon && (
          <div style={{
            display: "flex", alignItems: "center", justifyContent: "center",
            marginBottom: "6px", color: "#2563eb",
          }}>
            <Icon />
          </div>
        )}
        <div style={{
          fontFamily: "'DM Sans', sans-serif", fontWeight: 500, fontSize: "11px",
          color: "#000000", letterSpacing: "-0.01em", lineHeight: 1.2, marginBottom: "2px",
        }}>
          {label}
        </div>
        <div style={{
          fontFamily: "Inter, sans-serif", fontWeight: 400, fontSize: "9px",
          color: "#a59f97", lineHeight: 1.3,
        }}>
          {sub}
        </div>
      </div>
    </motion.div>
  );
});

/* ── Bezier path helper ── */
function bezierPath(x1, y1, x2, y2, curvature = 0.3) {
  const mx = (x1 + x2) / 2;
  const my = (y1 + y2) / 2;
  const dx = x2 - x1;
  const dy = y2 - y1;
  const len = Math.sqrt(dx * dx + dy * dy) || 1;
  // Perpendicular offset
  const px = -dy / len * len * curvature;
  const py = dx / len * len * curvature;
  const cpx = mx + px;
  const cpy = my + py;
  return `M${x1},${y1} Q${cpx},${cpy} ${x2},${y2}`;
}

/* ── Main section ── */
export default function CapabilitiesSection() {
  const [revealedCount, setRevealedCount] = useState(0);
  // 0 = only center visible
  // 1..10 = that many nodes revealed (1-indexed into CAPABILITIES)

  const [started, setStarted] = useState(false);
  const sectionRef = useRef(null);
  const timersRef = useRef([]);

  // Trigger on scroll
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

  // Sequential reveal
  useEffect(() => {
    if (!started) return;

    // Clear existing timers
    timersRef.current.forEach(clearTimeout);
    timersRef.current = [];

    // Start revealing after a short pause
    const initialDelay = 700;
    const stagger = 420;

    for (let i = 0; i < N; i++) {
      const t = setTimeout(() => {
        setRevealedCount(i + 1);
      }, initialDelay + i * stagger);
      timersRef.current.push(t);
    }

    return () => timersRef.current.forEach(clearTimeout);
  }, [started]);

  const centerPulsing = revealedCount === 0 && started;

  return (
    <section ref={sectionRef} data-capabilities style={{ background: "#fdfcfc", padding: "100px 48px" }}>
      <div style={{ maxWidth: "780px", margin: "0 auto" }}>

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

        {/* ═══════ NETWORK DIAGRAM ═══════ */}
        <div style={{
          position: "relative",
          borderRadius: "18px",
          background: "#fafaf8",
          overflow: "hidden",
          border: "1px solid #e8e5e0",
          aspectRatio: "1 / 1",
          maxWidth: "700px",
          margin: "0 auto",
        }}>
          <DotGrid />

          {/* ═══ SVG curved lines ═══ */}
          <svg
            style={{
              position: "absolute", inset: 0, zIndex: 1,
              width: "100%", height: "100%",
            }}
            viewBox="0 0 100 100"
            preserveAspectRatio="none"
          >
            {Array.from({ length: N }).map((_, i) => {
              const pos = POSITIONS[i];
              const visible = revealedCount > i;

              // Center→node line
              const hubD = bezierPath(50, 50, pos.x, pos.y, 0.25);

              // Predecessor→node line (chain)
              const prevPos = i > 0 ? POSITIONS[i - 1] : null;
              const chainD = prevPos ? bezierPath(prevPos.x, prevPos.y, pos.x, pos.y, 0.2) : null;

              return (
                <g key={`lines-${i}`}>
                  {/* Hub connection */}
                  {visible && (
                    <>
                      <path d={hubD} stroke="#2563eb" strokeWidth="0.22" fill="none" opacity="0.22" />
                      <circle r="0.55" fill="#2563eb" opacity="0.75">
                        <animateMotion dur="1.6s" repeatCount="indefinite" path={hubD} begin="0s" />
                      </circle>
                      <circle r="0.4" fill="#2563eb" opacity="0.45">
                        <animateMotion dur="1.6s" repeatCount="indefinite" path={hubD} begin="0.8s" />
                      </circle>
                    </>
                  )}

                  {/* Chain connection to predecessor */}
                  {visible && chainD && (
                    <>
                      <path d={chainD} stroke="#2563eb" strokeWidth="0.18" fill="none" opacity="0.18" />
                      <circle r="0.45" fill="#2563eb" opacity="0.6">
                        <animateMotion dur="1.3s" repeatCount="indefinite" path={chainD} begin="0.3s" />
                      </circle>
                    </>
                  )}
                </g>
              );
            })}
          </svg>

          {/* ═══ Nodes layer ═══ */}
          <div style={{
            position: "absolute", inset: 0, zIndex: 2,
            pointerEvents: "none",
          }}>

            {/* ── CENTER hub ── */}
            <motion.div
              animate={centerPulsing ? { scale: [1, 1.04, 1] } : { scale: 1 }}
              transition={centerPulsing ? { repeat: Infinity, duration: 2.8, ease: "easeInOut" } : {}}
              style={{
                position: "absolute", left: "50%", top: "50%",
                transform: "translate(-50%, -50%)",
              }}
            >
              <div style={{
                position: "relative",
                border: "1.5px solid rgba(37,99,235,0.50)",
                borderRadius: "14px",
                background: "#ffffff",
                padding: "16px 22px",
                textAlign: "center",
                boxShadow: "0 0 0 6px rgba(37,99,235,0.04), 0 4px 20px rgba(0,0,0,0.06)",
              }}>
                <div style={{
                  position: "absolute",
                  inset: "-6px",
                  borderRadius: "inherit",
                  border: "2px solid rgba(37,99,235,0.18)",
                  pointerEvents: "none",
                  zIndex: -1,
                  animation: started ? "centerRing 2.8s ease-in-out infinite" : "none",
                }} />
                <div style={{
                  display: "flex", alignItems: "center", justifyContent: "center",
                  marginBottom: "6px", color: "#2563eb",
                }}>
                  <CenterIcon />
                </div>
                <div style={{
                  fontFamily: "'DM Sans', sans-serif", fontWeight: 600, fontSize: "15px",
                  color: "#000000", letterSpacing: "-0.02em", lineHeight: 1.2, marginBottom: "3px",
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

            {/* ── Network nodes ── */}
            {CAPABILITIES.map((cap, i) => (
              <BannerNode
                key={cap.label}
                label={cap.label}
                sub={cap.sub}
                icon={ICONS[i]}
                x={POSITIONS[i].x}
                y={POSITIONS[i].y}
                visible={revealedCount > i}
                revealedCount={revealedCount}
                idx={i}
              />
            ))}
          </div>

          {/* ── Bottom indicator ── */}
          {revealedCount === 0 && started && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              style={{
                position: "absolute", bottom: "16px", left: 0, right: 0, zIndex: 3,
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
        @keyframes centerRing {
          0%, 100% { opacity: 0.5; transform: scale(1); }
          50%      { opacity: 0.15; transform: scale(1.06); }
        }
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