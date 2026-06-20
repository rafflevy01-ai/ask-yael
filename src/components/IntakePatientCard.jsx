import React, { useState } from "react";
import { Check } from "lucide-react";
import { useLanguage } from "@/lib/LanguageContext";

const INTAKE_IMG = "https://media.base44.com/images/public/6a2ab0818c0d050752d1521b/8bd79c064_Make_it_more_natural_Remove_th_Nano_Banana_2_70021.png";

export default function IntakePatientCard() {
  const { t, isRtl } = useLanguage();
  const tp = t.problem;
  const f = tp.intakeFields;
  const v = tp.intakeValues;
  const FIELDS = [
    { label: f.name, value: v.name, ltr: false },
    { label: f.teudat, value: v.teudat, ltr: true },
    { label: f.dob, value: v.dob, ltr: true },
    { label: f.hmo, value: v.hmo, ltr: false },
    { label: f.appointment, value: v.appointment, ltr: false },
  ];
  const [imgLoaded, setImgLoaded] = useState(false);

  return (
    <div className="ps-card" style={{ position: "relative", background: "#1a1a1a" }}>
      <img
        src={INTAKE_IMG}
        alt="Medical receptionist using Yael dashboard"
        onLoad={() => setImgLoaded(true)}
        style={{
          position: "absolute", inset: 0,
          width: "100%", height: "100%",
          objectFit: "cover",
          objectPosition: "center 35%",
          transform: "scale(1.5)",
          opacity: imgLoaded ? 1 : 0,
          transition: "opacity 0.4s ease",
        }}
      />
      <div style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.15)", zIndex: 1 }} />

      {/* Registration form */}
      <div style={{
        position: "absolute",
        zIndex: 2,
        left: "28px",
        bottom: "80px",
      }}>
        <span style={{
          fontFamily: "Inter,sans-serif", fontWeight: 500, fontSize: "9px",
          textTransform: "uppercase", letterSpacing: "0.1em",
          color: "rgba(255,255,255,0.7)", display: "block", marginBottom: "6px",
        }}>
          {tp.intakeLabel}
        </span>
        <div dir={isRtl ? "rtl" : "ltr"} style={{
          background: "rgba(255,255,255,0.94)",
          backdropFilter: "blur(20px)",
          WebkitBackdropFilter: "blur(20px)",
          borderRadius: "14px",
          padding: "14px 16px",
          boxShadow: "0 2px 14px rgba(0,0,0,0.15)",
          display: "inline-block",
          width: "fit-content",
        }}>
          <div style={{
            fontFamily: "Inter, sans-serif",
            fontWeight: 600,
            fontSize: "11px",
            color: "#0D0D0D",
            marginBottom: "12px",
            letterSpacing: "-0.01em",
          }}>
            {tp.intakeTitle}
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "7px" }}>
            {FIELDS.map((field, i) => (
              <div key={i} style={{
                display: "flex", alignItems: "center", justifyContent: "space-between",
                gap: "16px",
              }}>
                <span style={{
                  fontFamily: "Inter, sans-serif",
                  fontWeight: 400,
                  fontSize: "10px",
                  color: "#777777",
                  whiteSpace: "nowrap",
                }}>
                  {field.label}
                </span>
                <div style={{ display: "flex", alignItems: "center", gap: "7px" }}>
                  <span dir={field.ltr ? "ltr" : (isRtl ? "rtl" : "ltr")} style={{
                    fontFamily: "Inter, sans-serif",
                    fontWeight: 500,
                    fontSize: "10px",
                    color: "#0D0D0D",
                    whiteSpace: "nowrap",
                    textAlign: isRtl ? "left" : "right",
                  }}>
                    {field.value}
                  </span>
                  <div style={{
                    width: "14px", height: "14px", borderRadius: "50%",
                    background: "#A8D8B9",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    flexShrink: 0,
                  }}>
                    <Check size={8} strokeWidth={3} color="#FFFFFF" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Top-left label */}
      <div style={{ position: "relative", zIndex: 2, padding: "24px 28px 0" }}>
        <span style={{ fontFamily: "Inter,sans-serif", fontSize: "11px", fontWeight: 500, letterSpacing: "0.08em", textTransform: "uppercase", color: "rgba(255,255,255,0.85)", display: "block", marginBottom: "8px" }}>
          {tp.intakeTopLabel}
        </span>
        <div style={{ fontFamily: "Inter,sans-serif", fontWeight: 300, fontSize: "clamp(1.8rem,4vw,2.6rem)", color: "#FFFFFF", letterSpacing: "-0.05em", lineHeight: 1, marginBottom: "4px" }}>
          {tp.intakeTopTitle}
        </div>
        <p style={{ fontFamily: "Inter,sans-serif", fontSize: "11px", fontWeight: 500, textTransform: "uppercase", letterSpacing: "0.08em", color: "rgba(255,255,255,0.75)", margin: 0, whiteSpace: "nowrap" }}>
          {tp.intakeTopSub}
        </p>
      </div>
    </div>
  );
}