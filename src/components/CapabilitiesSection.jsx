import React, { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";

/* ── Data: 10 capabilities ── */
const CAPABILITIES = [
  { label: "Booking", sub: "Book, modify, cancel" },
  { label: "Emergency Triage", sub: "Same-day fee disclosure" },
  { label: "Registration", sub: "New patient intake" },
  { label: "Patient Recognition", sub: "Returning by phone" },
  { label: "Missed Call Recovery", sub: "Calls back patients" },
  { label: "Pricing & Treatments", sub: "Cost & procedure info" },
  { label: "HMO & Insurance", sub: "Coverage questions" },
  { label: "Staff SMS", sub: "Real-time notifications" },
  { label: "Language Detection", sub: "Hebrew·French·English" },
  { label: "24/7 Availability", sub: "No voicemail, no wait" },
];

const N = CAPABILITIES.length; // 10

/* ── Icons ── */
const ICONS = [
  () => (<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="4" width="18" height="18" rx="2" /><path d="M16 2v4M8 2v4M3 10h18" /></svg>),
  () => (<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polygon points="12 2 22 8.5 22 15.5 12 22 2 15.5 2 8.5" /><path d="M12 22V12" /><path d="M12 12l10-3.5" /></svg>),
  () => (<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M16 4h2a2 2 0 012 2v14a2 2 0 01-2 2H6a2 2 0 01-2-2V6a2 2 0 012-2h2" /><rect x="8" y="2" width="8" height="4" rx="1" /></svg>),
  () => (<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4-4v2" /><circle cx="9" cy="7" r="4" /><path d="M16 11l2 2 4-4" /></svg>),
  () => (<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M23 4v6h-6" /><path d="M1 20v-6h6" /><path d="M3.51 9a9 9 0 0114.85-3.36L23 10" /><path d="M1 14l4.64 4.36A9 9 0 0020.49 15" /></svg>),
  () => (<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="12" y1="1" x2="12" y2="23" /><path d="M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6" /></svg>),
  () => (<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /></svg>),
  () => (<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" /></svg>),
  () => (<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10" /><path d="M2 12h20" /><path d="M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 01-4-10 15.3 15.3 0 014-10z" /></svg>),
  () => (<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></svg>),
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

/* ── Radial positions for 10 banners ── */
function getBannerPosition(i, cx, cy, radius) {
  // Start from top (-90°) and go clockwise
  const angle = (i * 36 - 90) * (Math.PI / 180);
  return {
    x: cx + radius * Math.cos(angle),
    y: cy + radius * Math.sin(angle),
  };
}

/* ── Banner node ── */
function BannerNode({ label, sub, icon: Icon, x, y, active, accentColor }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.7 }}
      animate={{
        opacity: active ? 1 : 0.5,
        scale: 1,
      }}
      transition={{ duration: 0.4 }}
      style={{
        position: "absolute",
        left: `${x}%`,
        top: `${y}%`,
        transform: "translate(-50%, -50%)",
        width: "clamp(130px, 16vw, 155px)",
      }}
    >
      <div style={{
        border: active ? "1.5px solid rgba(37,99,235,0.45)" : "1px solid #e0ddd8",
        borderRadius: "10px",
        background: active ? "rgba(37,99,235,0.04)" : "#fafaf8",
        padding: "10px 12px",
        textAlign: "center",
        transition: "border 0.5s, background 0.5s, opacity 0.3s",
        boxShadow: active ? "0 0 0 3px rgba(37,99,235,0.05)" : undefined,
      }}>
        {Icon && (
          <div style={{
            display: "flex", alignItems: "center", justifyContent: "center",
            marginBottom: "6px", color: accentColor,
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
}

/* ── Dot grid background ── */
function DotGrid() {
  return (
    <div style={{
      position: "absolute", inset: 0, zIndex: 0, opacity: 0.18,
      backgroundImage: "radial-gradient(circle, #c4bfb8 1px, transparent 1px)",
      backgroundSize: "20px 20px",
      pointerEvents: "none",
    }} />
  );
}

/* ── Main section ── */
export default function CapabilitiesSection() {
  const [phase, setPhase] = useState(0);
  // 0 = center only, pulsing
  // 1 = center→banner lines draw + banners appear
  // 2 = ring pulse starts looping

  const [pulseIndex, setPulseIndex] = useState(-1);
  const [started, setStarted] = useState(false);
  const sectionRef = useRef(null);

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

  // Phase auto-advance
  useEffect(() => {
    if (!started) return;
    const t1 = setTimeout(() => setPhase(1), 700);
    const t2 = setTimeout(() => { setPhase(2); setPulseIndex(0); }, 2500);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, [started]);

  // Ring pulse loop: advance every 900ms
  useEffect(() => {
    if (phase < 2) return;
    const id = setInterval(() => {
      setPulseIndex(prev => (prev + 1) % N);
    }, 900);
    return () => clearInterval(id);
  }, [phase]);

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

        {/* ═══════ RADIAL DIAGRAM ═══════ */}
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

          {/* ═══ SVG lines layer ═══ */}
          <svg
            style={{
              position: "absolute", inset: 0, zIndex: 1,
              width: "100%", height: "100%",
            }}
            viewBox="0 0 100 100"
            preserveAspectRatio="none"
          >
            {/* ── Center→Banner lines ── */}
            <AnimatePresence>
              {phase >= 1 && Array.from({ length: N }).map((_, i) => {
                const pos = getBannerPosition(i, 50, 50, 37);
                return (
                  <g key={`c2b-${i}`}>
                    {/* Subtle base line */}
                    <line x1="50" y1="50" x2={pos.x} y2={pos.y}
                      stroke="#2563eb" strokeWidth="0.2" opacity="0.15" />
                    {/* Animated dash */}
                    <motion.line
                      x1="50" y1="50" x2={pos.x} y2={pos.y}
                      stroke="#2563eb" strokeWidth="0.25" opacity="0.6"
                      strokeDasharray="1 2"
                      initial={{ strokeDashoffset: 3 }}
                      animate={{ strokeDashoffset: -2 }}
                      transition={{ delay: 0.1 + i * 0.08, duration: 1.2, repeat: Infinity, ease: "linear" }}
                    />
                    {/* Traveling dot outward */}
                    <circle r="0.6" fill="#2563eb" opacity="0.8">
                      <animateMotion dur="1.5s" repeatCount="indefinite"
                        path={`M50,50 L${pos.x},${pos.y}`}
                        begin={`${0.1 + i * 0.08}s`} />
                    </circle>
                    <circle r="0.35" fill="#2563eb" opacity="0.5">
                      <animateMotion dur="1.5s" repeatCount="indefinite"
                        path={`M50,50 L${pos.x},${pos.y}`}
                        begin={`${0.85 + i * 0.08}s`} />
                    </circle>
                  </g>
                );
              })}
            </AnimatePresence>

            {/* ── Ring connections (banner→banner) ── */}
            <AnimatePresence>
              {phase >= 2 && Array.from({ length: N }).map((_, i) => {
                const from = getBannerPosition(i, 50, 50, 37);
                const to = getBannerPosition((i + 1) % N, 50, 50, 37);
                // Control point further out for curved outer ring
                const midAngle = ((i * 36 + (i + 1) * 36) / 2 - 90) * (Math.PI / 180);
                const cpR = 48;
                const cp = {
                  x: 50 + cpR * Math.cos(midAngle),
                  y: 50 + cpR * Math.sin(midAngle),
                };
                const d = `M${from.x},${from.y} Q${cp.x},${cp.y} ${to.x},${to.y}`;
                const isActive = pulseIndex === i || (pulseIndex === (i + N - 1) % N);

                return (
                  <g key={`ring-${i}`}>
                    <path d={d} stroke="#2563eb" strokeWidth="0.2" fill="none"
                      opacity={isActive ? 0.6 : 0.12}
                      style={{ transition: "opacity 0.5s" }} />
                    {isActive && (
                      <>
                        <circle r="0.55" fill="#2563eb" opacity="0.85">
                          <animateMotion dur="0.9s" repeatCount="indefinite" path={d} begin="0s" />
                        </circle>
                        <circle r="0.55" fill="#2563eb" opacity="0.5">
                          <animateMotion dur="0.9s" repeatCount="indefinite" path={d} begin="0.45s" />
                        </circle>
                      </>
                    )}
                  </g>
                );
              })}
            </AnimatePresence>
          </svg>

          {/* ═══ Nodes layer ═══ */}
          <div style={{
            position: "absolute", inset: 0, zIndex: 2,
            pointerEvents: "none",
          }}>

            {/* ── CENTER node ── */}
            <motion.div
              animate={phase === 0 ? { scale: [1, 1.035, 1] } : { scale: 1 }}
              transition={phase === 0 ? { repeat: Infinity, duration: 2.8, ease: "easeInOut" } : {}}
              style={{
                position: "absolute", left: "50%", top: "50%",
                transform: "translate(-50%, -50%)",
              }}
            >
              <div style={{
                border: "1.5px solid rgba(37,99,235,0.50)",
                borderRadius: "14px",
                background: "#ffffff",
                padding: "16px 22px",
                textAlign: "center",
                boxShadow: "0 0 0 6px rgba(37,99,235,0.04), 0 4px 20px rgba(0,0,0,0.06)",
              }}>
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

            {/* ── BANNER nodes ── */}
            <AnimatePresence>
              {phase >= 1 && CAPABILITIES.map((cap, i) => {
                const pos = getBannerPosition(i, 50, 50, 37);
                const isActive = phase >= 2 && pulseIndex === i;
                return (
                  <BannerNode
                    key={cap.label}
                    label={cap.label}
                    sub={cap.sub}
                    icon={ICONS[i]}
                    x={pos.x}
                    y={pos.y}
                    active={isActive}
                    accentColor="#2563eb"
                  />
                );
              })}
            </AnimatePresence>

          </div>

          {/* ── Progress label ── */}
          <AnimatePresence>
            {phase === 0 && (
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