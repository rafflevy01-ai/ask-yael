import React from "react";

const LAYERS = [
  {
    label: "Input",
    nodes: [
      { label: "Incoming Call", sub: "Patient dials the clinic" },
      { label: "Missed Call Recovery", sub: "Calls back unanswered patients" },
    ],
  },
  {
    label: "Intelligence",
    nodes: [
      { label: "Language Detection", sub: "Hebrew · French · English" },
      { label: "Patient Recognition", sub: "New or returning — by phone number" },
    ],
  },
];

const CORE = { label: "Yael AI Core", sub: "Voice receptionist engine" };

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

/* ── Layer panel ── */
function LayerPanel({ label, children }) {
  return (
    <div style={{
      background: "#fafaf8",
      border: "1px solid #e8e5e0",
      borderRadius: "12px",
      padding: "18px 22px",
      position: "relative",
    }}>
      <span style={{
        fontFamily: "Inter, sans-serif", fontWeight: 500, fontSize: "9px",
        textTransform: "uppercase", letterSpacing: "0.1em", color: "#b0aba3",
        position: "absolute", top: "-9px", left: "20px",
        background: "#fafaf8", padding: "0 8px",
      }}>
        {label}
      </span>
      {children}
    </div>
  );
}

/* ── Node box ── */
function NodeBox({ label, sub, prominent }) {
  return (
    <div style={{
      border: prominent ? "1.5px solid #000000" : "1px solid #d4d1cb",
      borderRadius: "8px",
      background: "#ffffff",
      padding: prominent ? "14px 20px" : "12px 16px",
      textAlign: "center",
      flex: 1,
      minWidth: 0,
    }}>
      <div style={{
        fontFamily: "'DM Sans', sans-serif",
        fontWeight: prominent ? 600 : 500,
        fontSize: prominent ? "16px" : "13px",
        color: "#000000",
        letterSpacing: "-0.02em",
        lineHeight: 1.2,
        marginBottom: prominent ? "5px" : "4px",
      }}>
        {label}
      </div>
      <div style={{
        fontFamily: "Inter, sans-serif", fontWeight: 400, fontSize: "11px",
        color: "#a59f97", lineHeight: 1.35,
      }}>
        {sub}
      </div>
    </div>
  );
}

/* ── Connector strip (renders SVG arrows between layers) ── */
const STROKE = "#c4bfb8";

/* Two parallel vertical arrows between 2-box layers */
function TwoDownArrows() {
  return (
    <div style={{ height: "28px", position: "relative", margin: "4px 0" }}>
      <svg width="100%" height="28" style={{ position: "absolute", top: 0, left: 0 }}>
        <defs>
          <marker id="ah" markerWidth="5" markerHeight="4" refX="4.5" refY="2" orient="auto">
            <polygon points="0 0, 5 2, 0 4" fill={STROKE} />
          </marker>
        </defs>
        {/* Left: 25% → 25% */}
        <line x1="25%" y1="0" x2="25%" y2="24" stroke={STROKE} strokeWidth="1" markerEnd="url(#ah)" />
        {/* Right: 75% → 75% */}
        <line x1="75%" y1="0" x2="75%" y2="24" stroke={STROKE} strokeWidth="1" markerEnd="url(#ah)" />
      </svg>
    </div>
  );
}

/* Two converging arrows (from 2 boxes → 1 center box) */
function ConvergeArrows() {
  return (
    <div style={{ height: "28px", position: "relative", margin: "4px 0" }}>
      <svg width="100%" height="28" style={{ position: "absolute", top: 0, left: 0 }}>
        <defs>
          <marker id="ah2" markerWidth="5" markerHeight="4" refX="4.5" refY="2" orient="auto">
            <polygon points="0 0, 5 2, 0 4" fill={STROKE} />
          </marker>
        </defs>
        <line x1="25%" y1="0" x2="50%" y2="24" stroke={STROKE} strokeWidth="1" markerEnd="url(#ah2)" />
        <line x1="75%" y1="0" x2="50%" y2="24" stroke={STROKE} strokeWidth="1" markerEnd="url(#ah2)" />
      </svg>
    </div>
  );
}

/* Fan-out: 1 center → 5 boxes */
function FanOutFive() {
  const targets = [10, 30, 50, 70, 90]; // percentages
  return (
    <div style={{ height: "32px", position: "relative", margin: "4px 0" }}>
      <svg width="100%" height="32" style={{ position: "absolute", top: 0, left: 0 }}>
        <defs>
          <marker id="ah3" markerWidth="5" markerHeight="4" refX="4.5" refY="2" orient="auto">
            <polygon points="0 0, 5 2, 0 4" fill={STROKE} />
          </marker>
        </defs>
        {targets.map((x) => (
          <line key={x} x1="50%" y1="0" x2={`${x}%`} y2="28" stroke={STROKE} strokeWidth="1" markerEnd="url(#ah3)" />
        ))}
      </svg>
    </div>
  );
}

/* 3 straight down arrows */
function ThreeDownArrows() {
  return (
    <div style={{ height: "24px", position: "relative", margin: "4px 0" }}>
      <svg width="100%" height="24" style={{ position: "absolute", top: 0, left: 0 }}>
        <defs>
          <marker id="ah4" markerWidth="5" markerHeight="4" refX="4.5" refY="2" orient="auto">
            <polygon points="0 0, 5 2, 0 4" fill={STROKE} />
          </marker>
        </defs>
        <line x1="17%" y1="0" x2="17%" y2="20" stroke={STROKE} strokeWidth="1" markerEnd="url(#ah4)" />
        <line x1="50%" y1="0" x2="50%" y2="20" stroke={STROKE} strokeWidth="1" markerEnd="url(#ah4)" />
        <line x1="83%" y1="0" x2="83%" y2="20" stroke={STROKE} strokeWidth="1" markerEnd="url(#ah4)" />
      </svg>
    </div>
  );
}

/* Mobile arrow */
function MobileArrow() {
  return (
    <div style={{ height: "28px", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <svg width="16" height="20" viewBox="0 0 16 20">
        <line x1="8" y1="0" x2="8" y2="13" stroke={STROKE} strokeWidth="1" />
        <polygon points="4,10 8,16 12,10" fill={STROKE} />
      </svg>
    </div>
  );
}

export default function CapabilitiesSection() {
  return (
    <section data-capabilities style={{ background: "#fdfcfc", padding: "100px 48px" }}>
      <div style={{ maxWidth: "820px", margin: "0 auto" }}>

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
        <div className="arch-desktop">

          {/* Layer 1: Input */}
          <LayerPanel label="Input">
            <div style={{ display: "flex", gap: "16px" }}>
              {LAYERS[0].nodes.map((n) => <NodeBox key={n.label} label={n.label} sub={n.sub} />)}
            </div>
          </LayerPanel>

          <TwoDownArrows />

          {/* Layer 2: Intelligence */}
          <LayerPanel label="Intelligence">
            <div style={{ display: "flex", gap: "16px" }}>
              {LAYERS[1].nodes.map((n) => <NodeBox key={n.label} label={n.label} sub={n.sub} />)}
            </div>
          </LayerPanel>

          <ConvergeArrows />

          {/* Core – centered, prominent */}
          <div style={{ display: "flex", justifyContent: "center" }}>
            <div style={{ maxWidth: "280px", width: "100%" }}>
              <NodeBox label={CORE.label} sub={CORE.sub} prominent />
            </div>
          </div>

          <FanOutFive />

          {/* Capabilities – 5 across */}
          <div style={{ display: "flex", gap: "10px" }}>
            {CAPABILITIES.map((n) => <NodeBox key={n.label} label={n.label} sub={n.sub} />)}
          </div>

          <ThreeDownArrows />

          {/* Output – 3 across */}
          <div style={{ display: "flex", gap: "10px" }}>
            {OUTPUTS.map((n) => <NodeBox key={n.label} label={n.label} sub={n.sub} />)}
          </div>

        </div>

        {/* ═══════ MOBILE ═══════ */}
        <div className="arch-mobile">
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "0" }}>

            <LayerPanel label="Input">
              <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                {LAYERS[0].nodes.map((n) => <NodeBox key={n.label} label={n.label} sub={n.sub} />)}
              </div>
            </LayerPanel>
            <MobileArrow />

            <LayerPanel label="Intelligence">
              <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                {LAYERS[1].nodes.map((n) => <NodeBox key={n.label} label={n.label} sub={n.sub} />)}
              </div>
            </LayerPanel>
            <MobileArrow />

            <div style={{ width: "100%", maxWidth: "340px" }}>
              <NodeBox label={CORE.label} sub={CORE.sub} prominent />
            </div>
            <MobileArrow />

            <LayerPanel label="Capabilities">
              <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                {CAPABILITIES.map((n) => <NodeBox key={n.label} label={n.label} sub={n.sub} />)}
              </div>
            </LayerPanel>
            <MobileArrow />

            <LayerPanel label="Output">
              <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                {OUTPUTS.map((n) => <NodeBox key={n.label} label={n.label} sub={n.sub} />)}
              </div>
            </LayerPanel>

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
        .arch-mobile { display: none; }
        @media (max-width: 768px) {
          [data-capabilities] { padding: 48px 16px !important; }
          .arch-desktop { display: none !important; }
          .arch-mobile { display: block !important; }
        }
        @media (max-width: 1024px) {
          [data-capabilities] { padding: 64px 24px !important; }
        }
      `}</style>
    </section>
  );
}