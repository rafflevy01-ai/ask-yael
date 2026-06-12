import React from "react";
import { motion } from "framer-motion";

/* ── Data ── */
const LEFT_NODES = [
  { label: "Incoming Call", sub: "Patient dials the clinic" },
  { label: "Missed Call Recovery", sub: "Calls back unanswered" },
  { label: "Language Detection", sub: "Hebrew · French · English" },
  { label: "Patient Recognition", sub: "New or returning — by phone" },
];

const CENTER = { label: "Yael AI Core", sub: "Voice receptionist engine" };

const RIGHT_CAPABILITIES = [
  { label: "Booking", sub: "Book, modify, cancel" },
  { label: "Emergency Triage", sub: "Same-day fee disclosure" },
  { label: "Registration", sub: "Name, DOB, HMO, reason" },
  { label: "Pricing & Treatments", sub: "Cost and procedure info" },
  { label: "HMO & Insurance", sub: "Coverage questions" },
];

const RIGHT_OUTPUTS = [
  { label: "Staff SMS", sub: "Real-time for every action" },
  { label: "CRM Sync", sub: "No manual data entry" },
  { label: "24/7 Availability", sub: "No voicemail, no missed calls" },
];

/* ── Styled node card ── */
function NodeCard({ label, sub, prominent }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.5 }}
      style={{
        border: prominent
          ? "1.5px solid rgba(0,0,0,0.18)"
          : "1px solid #e0ddd8",
        borderRadius: "12px",
        background: prominent ? "#ffffff" : "#fafaf8",
        padding: prominent ? "16px 20px" : "12px 16px",
        textAlign: "center",
        boxShadow: prominent
          ? "0 0 0 5px rgba(0,0,0,0.025), 0 2px 16px rgba(0,0,0,0.05)"
          : undefined,
        flex: 1,
      }}>
      <div style={{
        fontFamily: "'DM Sans', sans-serif",
        fontWeight: prominent ? 600 : 500,
        fontSize: prominent ? "16px" : "13px",
        color: "#000000",
        letterSpacing: "-0.02em",
        lineHeight: 1.2,
        marginBottom: prominent ? "5px" : "3px",
      }}>
        {label}
      </div>
      <div style={{
        fontFamily: "Inter, sans-serif", fontWeight: 400, fontSize: "11px",
        color: "#a59f97", lineHeight: 1.3,
      }}>
        {sub}
      </div>
    </motion.div>
  );
}

/* ═══════ Bezier connector SVG ═══════ */
const STROKE = "#c4bfb8";
const VH = 100; // viewBox height

function BezierConnector({ fromYs, fromX, toX, toYs }) {
  // All curves go from (fromX, fromY[i]) → (toX, toY[i] or single toY)
  const singleTo = typeof toYs === "number";
  const width = Math.abs(toX - fromX);
  const W = width;
  return (
    <svg
      viewBox={`0 0 ${W} ${VH}`}
      preserveAspectRatio="none"
      style={{ width, height: "100%", display: "block", flexShrink: 0, overflow: "visible" }}
    >
      <defs>
        <marker id={`ah-${fromX}`} markerWidth="5" markerHeight="4" refX="4.5" refY="2" orient="auto">
          <polygon points="0 0, 5 2, 0 4" fill={STROKE} />
        </marker>
      </defs>
      {fromYs.map((fy, i) => {
        const ty = singleTo ? toYs : toYs[i];
        const midX = W / 2;
        const d = `M ${fromX},${fy} C ${midX},${fy} ${midX},${ty} ${toX},${ty}`;
        return (
          <g key={i}>
            <path d={d} stroke={STROKE} strokeWidth="1" fill="none" markerEnd={`url(#ah-${fromX})`} />
            <circle cx={fromX} cy={fy} r="2.5" fill={STROKE} />
            <circle cx={toX} cy={ty} r="2.5" fill={STROKE} />
          </g>
        );
      })}
    </svg>
  );
}

export default function CapabilitiesSection() {
  // Y positions for left nodes (4 nodes evenly over 100)
  const leftYs = [14, 36, 58, 80];
  // Y positions for right capabilities (5 over ~60 range) + outputs (3 over ~30 range)
  const capYs = [8, 22, 36, 50, 64];
  const outYs = [76, 86, 96];

  return (
    <section data-capabilities style={{ background: "#fdfcfc", padding: "100px 48px" }}>
      <div style={{ maxWidth: "900px", margin: "0 auto" }}>

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
          margin: "0 0 56px 0",
        }}>
          Everything your front desk handles. Automated.
        </h2>

        {/* ═══════ DESKTOP ═══════ */}
        <div className="graph-desktop">

          {/* 5-column flex row */}
          <div style={{ display: "flex", alignItems: "stretch", gap: "0" }}>

            {/* LEFT COLUMN – 4 input/intelligence nodes */}
            <div style={{
              flex: 1, minWidth: 0,
              display: "flex", flexDirection: "column", gap: "12px",
            }}>
              {LEFT_NODES.map((n) => (
                <NodeCard key={n.label} label={n.label} sub={n.sub} />
              ))}
            </div>

            {/* CONNECTOR SVG: left → center */}
            <div style={{ width: "clamp(32px, 4vw, 52px)", flexShrink: 0 }}>
              <BezierConnector
                fromYs={leftYs}
                fromX={0}
                toX={52}
                toYs={50}
              />
            </div>

            {/* CENTER NODE */}
            <div style={{
              width: "clamp(160px, 22vw, 220px)", flexShrink: 0,
              display: "flex", alignItems: "center",
            }}>
              <NodeCard label={CENTER.label} sub={CENTER.sub} prominent />
            </div>

            {/* CONNECTOR SVG: center → right */}
            <div style={{ width: "clamp(32px, 4vw, 52px)", flexShrink: 0 }}>
              <BezierConnector
                fromYs={[50]}
                fromX={0}
                toX={52}
                toYs={[...capYs, ...outYs]}
              />
            </div>

            {/* RIGHT COLUMN – capabilities + divider + outputs */}
            <div style={{
              flex: 1, minWidth: 0,
              display: "flex", flexDirection: "column", gap: "12px",
            }}>
              {RIGHT_CAPABILITIES.map((n) => (
                <NodeCard key={n.label} label={n.label} sub={n.sub} />
              ))}

              {/* Divider */}
              <div style={{
                height: "1px", background: "#e8e5e0", margin: "4px 8px",
              }} />

              {RIGHT_OUTPUTS.map((n) => (
                <NodeCard key={n.label} label={n.label} sub={n.sub} />
              ))}
            </div>

          </div>
        </div>

        {/* ═══════ MOBILE ═══════ */}
        <div className="graph-mobile">
          <div style={{
            display: "flex", flexDirection: "column", alignItems: "center", gap: "0",
          }}>

            {/* Input group */}
            <div style={{
              border: "1px solid #e0ddd8", borderRadius: "14px", padding: "18px 22px",
              width: "100%", maxWidth: "360px", background: "#fafaf8",
            }}>
              <div style={{
                fontFamily: "Inter, sans-serif", fontWeight: 500, fontSize: "9px",
                textTransform: "uppercase", letterSpacing: "0.1em", color: "#b0aba3",
                marginBottom: "14px",
              }}>Input & Intelligence</div>
              <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                {LEFT_NODES.map((n) => (
                  <NodeCard key={n.label} label={n.label} sub={n.sub} />
                ))}
              </div>
            </div>

            <MobileArrow />

            {/* Center */}
            <div style={{ width: "100%", maxWidth: "360px" }}>
              <NodeCard label={CENTER.label} sub={CENTER.sub} prominent />
            </div>

            <MobileArrow />

            {/* Output group */}
            <div style={{
              border: "1px solid #e0ddd8", borderRadius: "14px", padding: "18px 22px",
              width: "100%", maxWidth: "360px", background: "#fafaf8",
            }}>
              <div style={{
                fontFamily: "Inter, sans-serif", fontWeight: 500, fontSize: "9px",
                textTransform: "uppercase", letterSpacing: "0.1em", color: "#b0aba3",
                marginBottom: "14px",
              }}>Capabilities</div>
              <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                {RIGHT_CAPABILITIES.map((n) => (
                  <NodeCard key={n.label} label={n.label} sub={n.sub} />
                ))}
              </div>
              <div style={{ height: "1px", background: "#e8e5e0", margin: "12px 0" }} />
              <div style={{
                fontFamily: "Inter, sans-serif", fontWeight: 500, fontSize: "9px",
                textTransform: "uppercase", letterSpacing: "0.1em", color: "#b0aba3",
                marginBottom: "14px",
              }}>Output</div>
              <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                {RIGHT_OUTPUTS.map((n) => (
                  <NodeCard key={n.label} label={n.label} sub={n.sub} />
                ))}
              </div>
            </div>

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
        .graph-mobile { display: none; }
        @media (max-width: 768px) {
          [data-capabilities] { padding: 48px 16px !important; }
          .graph-desktop { display: none !important; }
          .graph-mobile { display: block !important; }
        }
        @media (max-width: 1024px) {
          [data-capabilities] { padding: 64px 24px !important; }
        }
      `}</style>
    </section>
  );
}

/* ── Mobile arrow ── */
function MobileArrow() {
  return (
    <div style={{ height: "28px", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <svg width="16" height="20" viewBox="0 0 16 20">
        <line x1="8" y1="0" x2="8" y2="13" stroke="#c4bfb8" strokeWidth="1" />
        <polygon points="4,10 8,16 12,10" fill="#c4bfb8" />
      </svg>
    </div>
  );
}