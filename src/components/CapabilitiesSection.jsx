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

/* ── Connector strips (orthogonal SVG lines only) ── */
const STROKE = "#c4bfb8";

function ArrowMarker({ id }) {
  return (
    <marker id={id} markerWidth="5" markerHeight="4" refX="4.5" refY="2" orient="auto">
      <polygon points="0 0, 5 2, 0 4" fill={STROKE} />
    </marker>
  );
}

/* ── two straight verticals (Input → Intelligence, boxes aligned) ── */
function TwoDownArrows() {
  const H = 28;
  return (
    <div style={{ height: H, position: "relative", margin: "4px 0" }}>
      <svg width="100%" height={H} viewBox={`0 0 100 ${H}`} preserveAspectRatio="none"
        style={{ position: "absolute", top: 0, left: 0 }}>
        <defs><ArrowMarker id="ah" /></defs>
        <line x1="25" y1="0" x2="25" y2={H - 4} stroke={STROKE} strokeWidth="1" markerEnd="url(#ah)" />
        <line x1="75" y1="0" x2="75" y2={H - 4} stroke={STROKE} strokeWidth="1" markerEnd="url(#ah)" />
      </svg>
    </div>
  );
}

/* ── 2 → 1 converge: L-shaped orthogonal from both sides to centre ── */
function ConvergeArrows() {
  const H = 42;
  const v1 = 18, v2 = H - 4;
  return (
    <div style={{ height: H, position: "relative", margin: "4px 0" }}>
      <svg width="100%" height={H} viewBox={`0 0 100 ${H}`} preserveAspectRatio="none"
        style={{ position: "absolute", top: 0, left: 0 }}>
        <defs><ArrowMarker id="ah2" /></defs>
        {/* left side: down → right → down */}
        <path d={`M 25,0 L 25,${v1} L 50,${v1} L 50,${v2}`}
          stroke={STROKE} strokeWidth="1" fill="none" markerEnd="url(#ah2)" />
        {/* right side: down → left → down */}
        <path d={`M 75,0 L 75,${v1} L 50,${v1} L 50,${v2}`}
          stroke={STROKE} strokeWidth="1" fill="none" markerEnd="url(#ah2)" />
      </svg>
    </div>
  );
}

/* ── 1 → 5 fan-out: stem → horizontal bus → five vertical drops ── */
function FanOutFive() {
  const H = 46;
  const busY = 18;
  return (
    <div style={{ height: H, position: "relative", margin: "4px 0" }}>
      <svg width="100%" height={H} viewBox={`0 0 100 ${H}`} preserveAspectRatio="none"
        style={{ position: "absolute", top: 0, left: 0 }}>
        <defs><ArrowMarker id="ah3" /></defs>
        {/* vertical stem from 50 down to bus */}
        <line x1="50" y1="0" x2="50" y2={busY} stroke={STROKE} strokeWidth="1" />
        {/* horizontal bus bar */}
        <line x1="10" y1={busY} x2="90" y2={busY} stroke={STROKE} strokeWidth="1" />
        {/* five vertical drops */}
        {[10, 30, 50, 70, 90].map((x) => (
          <line key={x} x1={x} y1={busY} x2={x} y2={H - 4}
            stroke={STROKE} strokeWidth="1" markerEnd="url(#ah3)" />
        ))}
      </svg>
    </div>
  );
}

/* ── 5 → 3: five drops → horizontal bus → three drops ── */
function FiveToThreeArrows() {
  const H = 40;
  const busY = 16;
  const sources = [10, 30, 50, 70, 90];
  const targets = [17, 50, 83];
  return (
    <div style={{ height: H, position: "relative", margin: "4px 0" }}>
      <svg width="100%" height={H} viewBox={`0 0 100 ${H}`} preserveAspectRatio="none"
        style={{ position: "absolute", top: 0, left: 0 }}>
        <defs><ArrowMarker id="ah4" /></defs>
        {/* five sources drop to bus */}
        {sources.map((x) => (
          <line key={`s${x}`} x1={x} y1="0" x2={x} y2={busY} stroke={STROKE} strokeWidth="1" />
        ))}
        {/* horizontal bus bar */}
        <line x1="10" y1={busY} x2="90" y2={busY} stroke={STROKE} strokeWidth="1" />
        {/* three targets drop from bus */}
        {targets.map((x) => (
          <line key={`t${x}`} x1={x} y1={busY} x2={x} y2={H - 4}
            stroke={STROKE} strokeWidth="1" markerEnd="url(#ah4)" />
        ))}
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

          <FiveToThreeArrows />

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