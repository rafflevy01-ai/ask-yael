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

/* ── Layer panel (groups related nodes) ── */
function LayerPanel({ label, children }) {
  return (
    <div style={{
      background: "#fafaf8",
      border: "1px solid #e8e5e0",
      borderRadius: "14px",
      padding: "20px 24px",
      position: "relative",
    }}>
      <span style={{
        fontFamily: "Inter, sans-serif",
        fontWeight: 500,
        fontSize: "9px",
        textTransform: "uppercase",
        letterSpacing: "0.1em",
        color: "#b0aba3",
        position: "absolute",
        top: "-9px",
        left: "20px",
        background: "#fafaf8",
        padding: "0 8px",
      }}>
        {label}
      </span>
      {children}
    </div>
  );
}

/* ── Individual node box ── */
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
        fontFamily: "Inter, sans-serif",
        fontWeight: 400,
        fontSize: "11px",
        color: "#a59f97",
        lineHeight: 1.35,
      }}>
        {sub}
      </div>
    </div>
  );
}

/* ── Vertical arrow connector ── */
function ArrowDown() {
  return (
    <div style={{ height: "28px", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <svg width="16" height="20" viewBox="0 0 16 20">
        <line x1="8" y1="0" x2="8" y2="14" stroke="#c4bfb8" strokeWidth="1" />
        <path d="M3 10 L8 16 L13 10" stroke="#c4bfb8" strokeWidth="1" fill="none" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </div>
  );
}

/* ── Fan-out SVG ── */
function FanOut({ count }) {
  const positions = count === 5
    ? ["12%", "31%", "50%", "69%", "88%"]
    : ["20%", "50%", "80%"];
  return (
    <div style={{ position: "relative", height: "22px" }}>
      <svg width="100%" height="22" style={{ display: "block" }}>
        {positions.map((x, i) => (
          <line key={i} x1="50%" y1="0" x2={x} y2="22" stroke="#c4bfb8" strokeWidth="1" />
        ))}
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

        {/* ═══════ DESKTOP DIAGRAM ═══════ */}
        <div className="arch-desktop">

          {/* Layer 1: Input */}
          <LayerPanel label="Input">
            <div style={{ display: "flex", gap: "16px" }}>
              {LAYERS[0].nodes.map((n) => <NodeBox key={n.label} label={n.label} sub={n.sub} />)}
            </div>
          </LayerPanel>

          <ArrowDown />

          {/* Layer 2: Intelligence */}
          <LayerPanel label="Intelligence">
            <div style={{ display: "flex", gap: "16px" }}>
              {LAYERS[1].nodes.map((n) => <NodeBox key={n.label} label={n.label} sub={n.sub} />)}
            </div>
          </LayerPanel>

          <ArrowDown />

          {/* Core — standalone, prominent */}
          <div style={{ display: "flex", justifyContent: "center" }}>
            <div style={{ maxWidth: "280px", width: "100%" }}>
              <NodeBox label={CORE.label} sub={CORE.sub} prominent />
            </div>
          </div>

          <FanOut count={5} />

          {/* Capabilities row */}
          <div style={{ display: "flex", gap: "12px" }}>
            {CAPABILITIES.map((n) => <NodeBox key={n.label} label={n.label} sub={n.sub} />)}
          </div>

          <div style={{ display: "flex", justifyContent: "center", gap: "120px", margin: "12px 0 8px" }}>
            {OUTPUTS.map((_, i) => (
              <div key={i} style={{ width: "1px", height: "16px", background: "#c4bfb8" }} />
            ))}
          </div>

          {/* Output row */}
          <div style={{ display: "flex", gap: "12px" }}>
            {OUTPUTS.map((n) => (
              <NodeBox key={n.label} label={n.label} sub={n.sub} />
            ))}
          </div>

        </div>

        {/* ═══════ MOBILE DIAGRAM ═══════ */}
        <div className="arch-mobile">
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "0" }}>

            {/* Input */}
            <LayerPanel label="Input">
              <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                {LAYERS[0].nodes.map((n) => (
                  <NodeBox key={n.label} label={n.label} sub={n.sub} />
                ))}
              </div>
            </LayerPanel>

            <ArrowDown />

            {/* Intelligence */}
            <LayerPanel label="Intelligence">
              <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                {LAYERS[1].nodes.map((n) => (
                  <NodeBox key={n.label} label={n.label} sub={n.sub} />
                ))}
              </div>
            </LayerPanel>

            <ArrowDown />

            {/* Core */}
            <div style={{ width: "100%", maxWidth: "340px" }}>
              <NodeBox label={CORE.label} sub={CORE.sub} prominent />
            </div>

            <ArrowDown />

            {/* Capabilities */}
            <LayerPanel label="Capabilities">
              <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                {CAPABILITIES.map((n) => (
                  <NodeBox key={n.label} label={n.label} sub={n.sub} />
                ))}
              </div>
            </LayerPanel>

            <ArrowDown />

            {/* Output */}
            <LayerPanel label="Output">
              <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                {OUTPUTS.map((n) => (
                  <NodeBox key={n.label} label={n.label} sub={n.sub} />
                ))}
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