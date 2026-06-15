import { useState, useEffect } from "react";

const SCENARIOS = [
  {
    label: "Booking confirmed",
    staff: {
      title: "AskYael · now",
      subtitle: "New appointment booked",
      body: "Patient: Sarah Lévy · Wed 18 Jun · 10:00",
    },
    patient: {
      body: "Bonjour Sarah, votre rendez-vous est confirmé.\nDate: Mercredi 18 juin · 10:00.\nMerci de nous prévenir 24h à l'avance.\n— Yael",
    },
  },
  {
    label: "Booking cancelled",
    staff: {
      title: "AskYael · now",
      subtitle: "Booking cancelled",
      body: "Patient: David Cohen · Tue 17 Jun · 14:30\nReason: Work conflict — unavailable",
    },
    patient: {
      body: "Bonjour David, votre rendez-vous a bien été annulé. Pour reprendre un rendez-vous, rappelez-nous.\n— Yael",
    },
  },
  {
    label: "New patient registered",
    staff: {
      title: "AskYael · now",
      subtitle: "New patient registered",
      body: "Miriam Azoulay · DOB: 12/04/1990 · HMO: Clalit",
    },
    patient: {
      body: "Bonjour Miriam, bienvenue à la clinique. Votre premier rendez-vous est le jeudi 19 juin à 11:00.\n— Yael",
    },
  },
];

export default function SmsStaffPatient() {
  const [active, setActive] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setActive((p) => (p + 1) % SCENARIOS.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  const scenario = SCENARIOS[active];

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "0", position: "relative" }}>
      {/* Section label */}
      <div style={{
        display: "flex", alignItems: "center", gap: "8px",
        marginBottom: "10px",
      }}>
        <span style={{
          fontFamily: "Inter, sans-serif", fontWeight: 600, fontSize: "9px",
          textTransform: "uppercase", letterSpacing: "0.1em", color: "#AAAAAA",
          whiteSpace: "nowrap",
        }}>
          {scenario.label}
        </span>
      </div>

      {/* Scenario content */}
      <div style={{
        animation: "fadeIn 0.4s ease",
        display: "flex", flexDirection: "column", gap: "16px",
      }}>

        {/* iOS Notification Banner to staff */}
        <div style={{ display: "flex", flexDirection: "column", gap: "5px" }}>
          <span style={{
            fontFamily: "Inter, sans-serif", fontWeight: 400, fontSize: "9px",
            color: "#BBBBBB", textTransform: "uppercase", letterSpacing: "0.08em",
          }}>
            To staff
          </span>
          <div style={{
            background: "rgba(255,255,255,0.85)",
            backdropFilter: "blur(12px)",
            WebkitBackdropFilter: "blur(12px)",
            borderRadius: "16px",
            padding: "12px 14px",
            border: "1px solid rgba(0,0,0,0.06)",
            boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
            display: "flex", gap: "10px", alignItems: "flex-start",
          }}>
            {/* App icon */}
            <div style={{
              width: "24px", height: "24px", borderRadius: "5px",
              background: "#0D0D0D", flexShrink: 0,
              display: "flex", alignItems: "center", justifyContent: "center",
            }}>
              <span style={{ color: "#FFF", fontSize: "11px", fontWeight: 700, lineHeight: 1 }}>Y</span>
            </div>
            {/* Content */}
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{
                display: "flex", justifyContent: "space-between", alignItems: "center",
                marginBottom: "2px",
              }}>
                <span style={{
                  fontFamily: "Inter, sans-serif", fontWeight: 600, fontSize: "10px",
                  color: "#0D0D0D",
                }}>
                  {scenario.staff.title}
                </span>
              </div>
              <div style={{
                fontFamily: "Inter, sans-serif", fontWeight: 500, fontSize: "11px",
                color: "#0D0D0D", lineHeight: 1.35, marginBottom: "1px",
              }}>
                {scenario.staff.subtitle}
              </div>
              <div style={{
                fontFamily: "Inter, sans-serif", fontWeight: 400, fontSize: "10px",
                color: "#777777", lineHeight: 1.35, whiteSpace: "pre-line",
              }}>
                {scenario.staff.body}
              </div>
            </div>
          </div>
        </div>

        {/* SMS bubble to patient */}
        <div style={{ display: "flex", flexDirection: "column", gap: "5px", alignItems: "flex-end" }}>
          <span style={{
            fontFamily: "Inter, sans-serif", fontWeight: 400, fontSize: "9px",
            color: "#BBBBBB", textTransform: "uppercase", letterSpacing: "0.08em",
          }}>
            To patient
          </span>
          <div style={{
            background: "#34C759",
            borderRadius: "14px 14px 3px 14px",
            padding: "10px 14px",
            maxWidth: "85%",
          }}>
            <div style={{
              fontFamily: "Inter, sans-serif", fontWeight: 400, fontSize: "11px",
              color: "#FFFFFF", lineHeight: 1.5, whiteSpace: "pre-line",
            }}>
              {scenario.patient.body}
            </div>
          </div>
        </div>

      </div>

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(4px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}