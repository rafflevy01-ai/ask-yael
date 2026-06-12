import React from "react";

/* ── Architecture diagram nodes ── */
const NODES = {
  input: [
    { id: "incoming", label: "Incoming Call", sub: "Patient dials the clinic" },
    { id: "missed", label: "Missed Call Recovery", sub: "Calls back unanswered" },
  ],
  intelligence: [
    { id: "lang", label: "Language Detection", sub: "Hebrew · French · English" },
    { id: "patient", label: "Patient Recognition", sub: "New or returning — by phone" },
  ],
  core: [{ id: "core", label: "Yael AI", sub: "Voice receptionist engine" }],
  capabilities: [
    { id: "booking", label: "Booking", sub: "Book, modify, cancel" },
    { id: "triage", label: "Emergency Triage", sub: "Same-day fee disclosure" },
    { id: "register", label: "Registration", sub: "Name, DOB, HMO, reason" },
    { id: "pricing", label: "Pricing & Treatments", sub: "Cost and procedure info" },
    { id: "hmo", label: "HMO & Insurance", sub: "Coverage questions answered" },
  ],
  output: [
    { id: "sms", label: "Staff SMS", sub: "Real-time for every action" },
    { id: "crm", label: "CRM Sync", sub: "No manual data entry" },
    { id: "always", label: "24/7", sub: "No voicemail, no missed calls" },
  ],
};

/* ── Node box component ── */
function NodeBox({ label, sub, style }) {
  return (
    <div
      style={{
        border: "1px solid #d4d1cb",
        borderRadius: "10px",
        background: "#ffffff",
        padding: "12px 16px",
        textAlign: "center",
        ...style,
      }}>
      <div style={{
        fontFamily: "'DM Sans', sans-serif",
        fontWeight: 500,
        fontSize: "14px",
        color: "#000000",
        letterSpacing: "-0.02em",
        lineHeight: 1.2,
        marginBottom: "3px",
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

/* ── Connecting line (SVG) ── */
function Connector({ color = "#d4d1cb", dashed = false }) {
  return (
    <svg width="100%" height="2" style={{ display: "block", flexShrink: 0 }}>
      <line
        x1="0" y1="1" x2="100%" y2="1"
        stroke={color}
        strokeWidth="1"
        strokeDasharray={dashed ? "4 4" : undefined}
      />
    </svg>
  );
}

export default function CapabilitiesSection() {
  return (
    <section data-capabilities style={{ background: "#fdfcfc", padding: "100px 48px" }}>
      <div style={{ maxWidth: "960px", margin: "0 auto" }}>

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

        {/* ═══════════ DESKTOP DIAGRAM ═══════════ */}
        <div className="arch-desktop">

          {/* ── Row: Input → Intelligence → Core ── */}
          <div style={{
            display: "flex", alignItems: "stretch", gap: "0",
            marginBottom: "16px",
          }}>

            {/* Input column */}
            <div style={{ flex: "0 0 170px", display: "flex", flexDirection: "column", gap: "8px" }}>
              {NODES.input.map((n) => <NodeBox key={n.id} label={n.label} sub={n.sub} />)}
            </div>

            {/* Arrow 1 → */}
            <div style={{ flex: "0 0 40px", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <svg width="24" height="16" viewBox="0 0 24 16">
                <path d="M0 8 L18 8 M14 3 L20 8 L14 13" stroke="#d4d1cb" strokeWidth="1" fill="none" />
              </svg>
            </div>

            {/* Intelligence column */}
            <div style={{ flex: "0 0 170px", display: "flex", flexDirection: "column", gap: "8px" }}>
              {NODES.intelligence.map((n) => <NodeBox key={n.id} label={n.label} sub={n.sub} />)}
            </div>

            {/* Arrow 2 → */}
            <div style={{ flex: "0 0 40px", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <svg width="24" height="16" viewBox="0 0 24 16">
                <path d="M0 8 L18 8 M14 3 L20 8 L14 13" stroke="#d4d1cb" strokeWidth="1" fill="none" />
              </svg>
            </div>

            {/* Core node */}
            <div style={{ flex: "0 0 170px", alignSelf: "center" }}>
              <NodeBox
                label={NODES.core[0].label}
                sub={NODES.core[0].sub}
                style={{ borderColor: "#000000", borderWidth: "1.5px" }}
              />
            </div>

          </div>

          {/* ── Fan-out arrow from Core down to Capabilities ── */}
          <div style={{ display: "flex", justifyContent: "center", marginBottom: "16px" }}>
            <div style={{ width: "2px", height: "28px", background: "#d4d1cb" }} />
          </div>
          <div style={{ position: "relative", height: "18px", marginBottom: "8px" }}>
            <svg width="100%" height="18" style={{ position: "absolute", top: 0, left: 0 }}>
              {/* Fan-out lines from center to 5 columns */}
              <line x1="50%" y1="0" x2="10%" y2="18" stroke="#d4d1cb" strokeWidth="1" />
              <line x1="50%" y1="0" x2="30%" y2="18" stroke="#d4d1cb" strokeWidth="1" />
              <line x1="50%" y1="0" x2="50%" y2="18" stroke="#d4d1cb" strokeWidth="1" />
              <line x1="50%" y1="0" x2="70%" y2="18" stroke="#d4d1cb" strokeWidth="1" />
              <line x1="50%" y1="0" x2="90%" y2="18" stroke="#d4d1cb" strokeWidth="1" />
            </svg>
          </div>

          {/* ── Row: Capabilities ── */}
          <div style={{
            display: "flex", gap: "12px", justifyContent: "center",
            marginBottom: "16px",
          }}>
            {NODES.capabilities.map((n) => (
              <NodeBox key={n.id} label={n.label} sub={n.sub} style={{ flex: "0 0 170px" }} />
            ))}
          </div>

          {/* ── Down arrows to Output ── */}
          <div style={{ display: "flex", justifyContent: "center", gap: "160px", marginBottom: "8px" }}>
            <div style={{ width: "2px", height: "20px", background: "#d4d1cb" }} />
            <div style={{ width: "2px", height: "20px", background: "#d4d1cb" }} />
            <div style={{ width: "2px", height: "20px", background: "#d4d1cb" }} />
          </div>

          {/* ── Row: Output ── */}
          <div style={{
            display: "flex", gap: "12px", justifyContent: "center",
            marginBottom: "32px",
          }}>
            {NODES.output.map((n) => (
              <NodeBox key={n.id} label={n.label} sub={n.sub} style={{ flex: "0 0 170px", borderStyle: "dashed" }} />
            ))}
          </div>
        </div>

        {/* ═══════════ MOBILE DIAGRAM ═══════════ */}
        <div className="arch-mobile">
          {/* ── Flow column ── */}
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "0" }}>

            {/* Input layer */}
            <div style={{
              border: "1px solid #d4d1cb", borderRadius: "12px", padding: "16px 20px",
              width: "100%", maxWidth: "340px", background: "#ffffff",
            }}>
              <div style={{ fontFamily: "Inter, sans-serif", fontWeight: 500, fontSize: "9px", textTransform: "uppercase", letterSpacing: "0.1em", color: "#a59f97", marginBottom: "12px" }}>Input</div>
              <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                {NODES.input.map((n) => (
                  <div key={n.id}>
                    <div style={{ fontFamily: "'DM Sans', sans-serif", fontWeight: 500, fontSize: "14px", color: "#000", marginBottom: "2px" }}>{n.label}</div>
                    <div style={{ fontFamily: "Inter, sans-serif", fontSize: "12px", color: "#a59f97" }}>{n.sub}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Arrow down */}
            <div style={{ height: "24px", display: "flex", alignItems: "center" }}>
              <svg width="12" height="18" viewBox="0 0 12 18">
                <path d="M6 0 L6 14 M1 9 L6 15 L11 9" stroke="#d4d1cb" strokeWidth="1" fill="none" />
              </svg>
            </div>

            {/* Intelligence + Core */}
            <div style={{
              border: "1px solid #000000", borderRadius: "12px", padding: "16px 20px",
              width: "100%", maxWidth: "340px", background: "#ffffff", borderWidth: "1.5px",
            }}>
              <div style={{ fontFamily: "Inter, sans-serif", fontWeight: 500, fontSize: "9px", textTransform: "uppercase", letterSpacing: "0.1em", color: "#a59f97", marginBottom: "12px" }}>Intelligence</div>
              <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                {[...NODES.intelligence, ...NODES.core].map((n) => (
                  <div key={n.id}>
                    <div style={{ fontFamily: "'DM Sans', sans-serif", fontWeight: 500, fontSize: "14px", color: "#000", marginBottom: "2px" }}>{n.label}</div>
                    <div style={{ fontFamily: "Inter, sans-serif", fontSize: "12px", color: "#a59f97" }}>{n.sub}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Arrow down */}
            <div style={{ height: "24px", display: "flex", alignItems: "center" }}>
              <svg width="12" height="18" viewBox="0 0 12 18">
                <path d="M6 0 L6 14 M1 9 L6 15 L11 9" stroke="#d4d1cb" strokeWidth="1" fill="none" />
              </svg>
            </div>

            {/* Capabilities */}
            <div style={{
              border: "1px solid #d4d1cb", borderRadius: "12px", padding: "16px 20px",
              width: "100%", maxWidth: "340px", background: "#ffffff",
            }}>
              <div style={{ fontFamily: "Inter, sans-serif", fontWeight: 500, fontSize: "9px", textTransform: "uppercase", letterSpacing: "0.1em", color: "#a59f97", marginBottom: "12px" }}>Capabilities</div>
              <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                {NODES.capabilities.map((n) => (
                  <div key={n.id}>
                    <div style={{ fontFamily: "'DM Sans', sans-serif", fontWeight: 500, fontSize: "14px", color: "#000", marginBottom: "2px" }}>{n.label}</div>
                    <div style={{ fontFamily: "Inter, sans-serif", fontSize: "12px", color: "#a59f97" }}>{n.sub}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Arrow down */}
            <div style={{ height: "24px", display: "flex", alignItems: "center" }}>
              <svg width="12" height="18" viewBox="0 0 12 18">
                <path d="M6 0 L6 14 M1 9 L6 15 L11 9" stroke="#d4d1cb" strokeWidth="1" strokeDasharray="3 3" fill="none" />
              </svg>
            </div>

            {/* Output */}
            <div style={{
              border: "1px dashed #d4d1cb", borderRadius: "12px", padding: "16px 20px",
              width: "100%", maxWidth: "340px", background: "#ffffff",
            }}>
              <div style={{ fontFamily: "Inter, sans-serif", fontWeight: 500, fontSize: "9px", textTransform: "uppercase", letterSpacing: "0.1em", color: "#a59f97", marginBottom: "12px" }}>Output</div>
              <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                {NODES.output.map((n) => (
                  <div key={n.id}>
                    <div style={{ fontFamily: "'DM Sans', sans-serif", fontWeight: 500, fontSize: "14px", color: "#000", marginBottom: "2px" }}>{n.label}</div>
                    <div style={{ fontFamily: "Inter, sans-serif", fontSize: "12px", color: "#a59f97" }}>{n.sub}</div>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>

        {/* ── Closing line ── */}
        <p style={{
          fontFamily: "Inter, sans-serif", fontWeight: 400, fontStyle: "italic",
          fontSize: "14px", color: "#777169", lineHeight: 1.6,
          margin: "32px 0 0 0", textAlign: "center",
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