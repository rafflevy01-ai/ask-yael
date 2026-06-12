import React, { useState, useEffect, useRef } from "react";
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

/* ── Inline SVG icons ── */
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
function NodeCard({ label, sub, icon: IconComp, variant = "default" }) {
  const isCore = variant === "core";
  return (
    <div style={{
      border: isCore ? "1.5px solid rgba(0,0,0,0.20)" : "1px solid #e0ddd8",
      borderRadius: "12px",
      background: isCore ? "#ffffff" : "#fafaf8",
      padding: isCore ? "14px 18px" : "10px 14px",
      textAlign: "center",
      boxShadow: isCore
        ? "0 0 0 5px rgba(0,0,0,0.025), 0 2px 16px rgba(0,0,0,0.05)"
        : undefined,
    }}>
      {IconComp && (
        <div style={{
          display: "flex", alignItems: "center", justifyContent: "center",
          marginBottom: isCore ? "6px" : "8px",
          color: "#a59f97",
        }}>
          <IconComp />
        </div>
      )}
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

/* ── Dot grid background ── */
function DotGrid() {
  return (
    <div style={{
      position: "absolute", inset: 0, zIndex: 0, opacity: 0.25,
      backgroundImage: "radial-gradient(circle, #c4bfb8 1px, transparent 1px)",
      backgroundSize: "16px 16px",
      pointerEvents: "none",
    }} />
  );
}

/* ── Main section ── */
export default function CapabilitiesSection() {
  const [phase, setPhase] = useState(0);
  // 0 = initial (center only, pulsing)
  // 1 = inputs descend from above → center
  // 2 = capabilities branch below
  // 3 = outputs auto-appear

  const [started, setStarted] = useState(false);
  const sectionRef = useRef(null);

  // Trigger on scroll into view
  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !started) {
          setStarted(true);
        }
      },
      { threshold: 0.3 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [started]);

  // Auto-advance phases once started
  useEffect(() => {
    if (!started) return;
    const t1 = setTimeout(() => setPhase(1), 600);
    const t2 = setTimeout(() => setPhase(2), 2000);
    const t3 = setTimeout(() => setPhase(3), 3500);
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); };
  }, [started]);

  return (
    <section ref={sectionRef} data-capabilities style={{ background: "#fdfcfc", padding: "100px 48px" }}>
      <div style={{ maxWidth: "600px", margin: "0 auto" }}>

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
          border: "1px solid #e8e5e0",
          borderRadius: "18px",
          background: "#fafaf8",
          overflow: "hidden",
          minHeight: phase === 0 ? "340px" : "auto",
        }}>
          <DotGrid />

          {/* ═══ CONTENT — top-to-bottom flow ═══ */}
          <div style={{
            position: "relative", zIndex: 2,
            padding: "clamp(24px, 4vw, 40px)",
            display: "flex", flexDirection: "column", alignItems: "center",
          }}>

            {/* ── TOP: Input nodes ── */}
            <AnimatePresence>
              {phase >= 1 && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  transition={{ duration: 0.5 }}
                  style={{
                    display: "flex", flexWrap: "wrap", justifyContent: "center",
                    gap: "10px", marginBottom: "24px",
                    maxWidth: "480px",
                  }}>
                  {INPUTS.map((n, i) => (
                    <motion.div
                      key={n.label}
                      initial={{ opacity: 0, y: -20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.15 + i * 0.1, duration: 0.4 }}
                      style={{ flex: "1 1 calc(50% - 10px)", minWidth: "170px", maxWidth: "230px" }}
                    >
                      <NodeCard label={n.label} sub={n.sub} icon={n.icon} />
                    </motion.div>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>

            {/* ── Vertical beam: inputs → center ── */}
            <AnimatePresence>
              {phase >= 1 && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  transition={{ duration: 0.4, delay: 0.3 }}
                  style={{
                    display: "flex", flexDirection: "column", alignItems: "center",
                    marginBottom: "8px",
                  }}>
                  {/* 4 parallel vertical lines fanning into one */}
                  <svg width="260" height="40" viewBox="0 0 260 40" style={{ display: "block" }}>
                    {/* Leftmost line */}
                    <motion.path
                      d="M 40,0 Q 70,20 130,40"
                      stroke="#2563eb" strokeWidth="1.2" fill="none"
                      initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
                      transition={{ delay: 0.3, duration: 0.5 }}
                    />
                    <motion.circle cx="130" cy="40" r="3" fill="#2563eb"
                      initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                      transition={{ delay: 0.7 }} />
                    {/* Left-middle */}
                    <motion.path
                      d="M 100,0 Q 120,20 130,40"
                      stroke="#2563eb" strokeWidth="1.2" fill="none"
                      initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
                      transition={{ delay: 0.35, duration: 0.5 }}
                    />
                    {/* Right-middle */}
                    <motion.path
                      d="M 160,0 Q 140,20 130,40"
                      stroke="#2563eb" strokeWidth="1.2" fill="none"
                      initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
                      transition={{ delay: 0.4, duration: 0.5 }}
                    />
                    {/* Rightmost */}
                    <motion.path
                      d="M 220,0 Q 190,20 130,40"
                      stroke="#2563eb" strokeWidth="1.2" fill="none"
                      initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
                      transition={{ delay: 0.45, duration: 0.5 }}
                    />
                  </svg>
                </motion.div>
              )}
            </AnimatePresence>

            {/* ── CENTER: Yael AI Core ── */}
            <motion.div
              animate={phase === 0 ? { scale: [1, 1.025, 1] } : { scale: 1 }}
              transition={phase === 0 ? { repeat: Infinity, duration: 2.5, ease: "easeInOut" } : {}}
              style={{ width: "220px", marginBottom: "8px" }}
            >
              <NodeCard label={CENTER.label} sub={CENTER.sub} icon={Cpu} variant="core" />
            </motion.div>

            {/* ── Progress indicator under center ── */}
            <AnimatePresence>
              {phase < 3 && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  style={{ marginBottom: "20px" }}
                >
                  <div style={{
                    fontFamily: "Inter, sans-serif", fontWeight: 500, fontSize: "12px",
                    color: "#2563eb", letterSpacing: "-0.01em",
                    border: "1px solid rgba(37,99,235,0.25)",
                    borderRadius: "9999px", padding: "6px 18px",
                  }}>
                    {phase === 0 && <>Initializing&hellip;</>}
                    {phase === 1 && <>Processing&hellip;</>}
                    {phase === 2 && <>Running — outputs loading&hellip;</>}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* ── Vertical beam: center → capabilities ── */}
            <AnimatePresence>
              {phase >= 2 && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  transition={{ duration: 0.4 }}
                  style={{
                    display: "flex", flexDirection: "column", alignItems: "center",
                    marginBottom: "4px",
                  }}>
                  {/* Single line fanning out into 5 */}
                  <svg width="260" height="40" viewBox="0 0 260 40" style={{ display: "block" }}>
                    {/* Center to each branch */}
                    {[40, 95, 150, 205, 260].map((tx, i) => (
                      <motion.path
                        key={i}
                        d={`M 130,0 Q ${(130 + tx) / 2},20 ${tx},40`}
                        stroke="#2563eb" strokeWidth="1.2" fill="none"
                        initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
                        transition={{ delay: 0.1 + i * 0.1, duration: 0.5 }}
                      />
                    ))}
                    {/* Anchor dot at center */}
                    <motion.circle cx="130" cy="0" r="3" fill="#2563eb"
                      initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                      transition={{ delay: 0.1 }} />
                    {/* Anchor dots at destinations */}
                    {[40, 95, 150, 205, 260].map((x, i) => (
                      <motion.circle key={i} cx={x} cy={40} r={3} fill="#2563eb"
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                        transition={{ delay: 0.5 + i * 0.1 }} />
                    ))}
                  </svg>
                </motion.div>
              )}
            </AnimatePresence>

            {/* ── BOTTOM: Capabilities ── */}
            <AnimatePresence>
              {phase >= 2 && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  transition={{ duration: 0.5 }}
                  style={{
                    display: "flex", flexWrap: "wrap", justifyContent: "center",
                    gap: "10px", marginBottom: "12px",
                    maxWidth: "520px",
                  }}>
                  {CAPABILITIES.map((n, i) => (
                    <motion.div
                      key={n.label}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.15 + i * 0.1, duration: 0.4 }}
                      style={{
                        flex: "1 1 calc(33.333% - 10px)",
                        minWidth: "150px", maxWidth: "200px",
                      }}
                    >
                      <NodeCard label={n.label} sub={n.sub} />
                    </motion.div>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>

            {/* ── Divider + Outputs ── */}
            <AnimatePresence>
              {phase >= 3 && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  transition={{ duration: 0.5 }}
                  style={{
                    display: "flex", flexDirection: "column", alignItems: "center",
                    width: "100%", maxWidth: "520px",
                  }}>

                  {/* Thin beam to outputs */}
                  <svg width="260" height="28" viewBox="0 0 260 28" style={{ display: "block", marginBottom: "2px" }}>
                    {[40, 130, 220].map((tx, i) => (
                      <motion.path
                        key={i}
                        d={`M 130,0 Q ${(130 + tx) / 2},12 ${tx},28`}
                        stroke="#2563eb" strokeWidth="1.2" fill="none"
                        initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
                        transition={{ delay: 0.1 + i * 0.1, duration: 0.5 }}
                      />
                    ))}
                    <motion.circle cx="130" cy="0" r="3" fill="#2563eb"
                      initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                      transition={{ delay: 0.1 }} />
                  </svg>

                  <div style={{
                    height: "1px", background: "#e8e5e0",
                    width: "60%", margin: "8px auto 14px auto",
                  }} />

                  <div style={{
                    display: "flex", flexWrap: "wrap", justifyContent: "center",
                    gap: "10px",
                  }}>
                    {OUTPUTS.map((n, i) => (
                      <motion.div
                        key={n.label}
                        initial={{ opacity: 0, y: 15 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 + i * 0.1, duration: 0.35 }}
                        style={{
                          flex: "1 1 calc(33.333% - 10px)",
                          minWidth: "140px", maxWidth: "200px",
                        }}
                      >
                        <NodeCard label={n.label} sub={n.sub} />
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

          </div>
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