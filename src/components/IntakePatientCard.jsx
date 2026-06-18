import React from "react";
import { Check } from "lucide-react";

const FIELDS = [
  { label: "Name", value: "David Cohen" },
  { label: "Teudat Zehut", value: "031-456789" },
  { label: "Date of birth", value: "15/03/1985" },
  { label: "HMO", value: "Clalit" },
  { label: "Appointment", value: "Wed 18 Jun · 10:00" },
];

export default function IntakePatientCard() {
  return (
    <div className="ps-card" style={{ background: "linear-gradient(180deg, #A8D8B9 0%, #C9E8D2 50%, #F0F7F2 100%)" }}>
      <div className="ps-card-top">
        <span className="ps-card-label" style={{ color: "rgba(255,255,255,0.75)" }}>Patient Intake</span>
        <div style={{ fontFamily: "Inter,sans-serif", fontWeight: 300, fontSize: "clamp(1.8rem,4vw,2.6rem)", color: "#FFFFFF", letterSpacing: "-0.05em", lineHeight: 1, marginBottom: "4px" }}>
          Before they hang up.
        </div>
        <p className="ps-card-copy" style={{ color: "rgba(255,255,255,0.9)", fontSize: "15px", lineHeight: "1.6" }}>
          Yael captures every detail from new patients in one call — name, ID, HMO, and appointment — so your front desk starts with everything ready.
        </p>
      </div>

      <div className="ps-card-visual" style={{ justifyContent: "center", paddingBottom: "28px" }}>
        <div style={{
          background: "rgba(255,255,255,0.92)",
          backdropFilter: "blur(20px)",
          WebkitBackdropFilter: "blur(20px)",
          borderRadius: "16px",
          padding: "18px 20px",
          boxShadow: "0 2px 14px rgba(0,0,0,0.06)",
          maxWidth: "300px",
        }}>
          {/* Header */}
          <div style={{
            fontFamily: "Inter, sans-serif",
            fontWeight: 600,
            fontSize: "12px",
            color: "#0D0D0D",
            marginBottom: "14px",
            letterSpacing: "-0.01em",
          }}>
            New patient registration
          </div>

          {/* Fields */}
          <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
            {FIELDS.map((field, i) => (
              <div key={i} style={{
                display: "flex", alignItems: "center", justifyContent: "space-between",
                gap: "14px",
              }}>
                <span style={{
                  fontFamily: "Inter, sans-serif",
                  fontWeight: 400,
                  fontSize: "11px",
                  color: "#777777",
                  whiteSpace: "nowrap",
                }}>
                  {field.label}
                </span>
                <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                  <span style={{
                    fontFamily: "Inter, sans-serif",
                    fontWeight: 500,
                    fontSize: "11px",
                    color: "#0D0D0D",
                    whiteSpace: "nowrap",
                    textAlign: "right",
                  }}>
                    {field.value}
                  </span>
                  <div style={{
                    width: "16px", height: "16px", borderRadius: "50%",
                    background: "#A8D8B9",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    flexShrink: 0,
                  }}>
                    <Check size={9} strokeWidth={3} color="#FFFFFF" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}