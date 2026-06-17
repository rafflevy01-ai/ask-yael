import { useState, useEffect } from "react";
import { Phone, AlertTriangle, ArrowLeftRight, Check } from "lucide-react";

const STEPS = [
  { icon: Phone, label: "Patient calling", bg: "#FCEBEB", border: "#F09595", iconColor: "#A32D2D" },
  { icon: AlertTriangle, label: "Yael detects", bg: "#FDF3E0", border: "#FAC775", iconColor: "#8A5A00" },
  { icon: ArrowLeftRight, label: "Transferring", bg: "#EEF2FF", border: "#A5B4FC", iconColor: "#3730A3" },
  { icon: Check, label: "Resolved", bg: "#EAF3DE", border: "#97C459", iconColor: "#27500A" },
];

const STEP_DELAY = 900;
const FINAL_PAUSE = 1500;

export default function DeescalationTransfer() {
  const [activeStep, setActiveStep] = useState(0);
  const [phase, setPhase] = useState(0);

  useEffect(() => {
    if (phase >= 4) {
      const t = setTimeout(() => {
        setActiveStep(0);
        setPhase(0);
      }, FINAL_PAUSE);
      return () => clearTimeout(t);
    }

    const t = setTimeout(() => {
      setActiveStep(phase + 1);
      setPhase(phase + 1);
    }, STEP_DELAY);
    return () => clearTimeout(t);
  }, [phase]);

  return (
    <div style={{
      display: "flex", alignItems: "center", justifyContent: "center",
      gap: "0px", padding: "16px 0", width: "100%",
    }}>
      {STEPS.map((step, i) => {
        const isActive = i < activeStep;
        const Icon = step.icon;
        const isLast = i === STEPS.length - 1;

        return (
          <div key={i} style={{ display: "flex", alignItems: "center" }}>
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "6px" }}>
              <div style={{
                width: 36, height: 36, borderRadius: "50%",
                background: isActive ? step.bg : "#F1F5F9",
                border: "2px solid",
                borderColor: isActive ? step.border : "#E2E8F0",
                display: "flex", alignItems: "center", justifyContent: "center",
                transition: "all 0.3s ease",
                transform: isActive ? "scale(1)" : "scale(0.92)",
              }}>
                <Icon size={14} strokeWidth={2.2} color={isActive ? step.iconColor : "#CBD5E1"} style={{ transition: "color 0.3s ease" }} />
              </div>
              <span style={{
                fontFamily: "Inter, sans-serif", fontWeight: isActive ? 600 : 400,
                fontSize: "9px", color: isActive ? "#0D0D0D" : "#CBD5E1",
                textAlign: "center", lineHeight: 1.3, transition: "all 0.3s ease",
              }}>
                {step.label}
              </span>
            </div>

            {!isLast && (
              <div style={{
                width: 28, height: 3, borderRadius: "2px",
                background: i < activeStep ? step.border : "#E5E5E5",
                transition: "background 0.3s ease",
                marginBottom: "20px",
              }} />
            )}
          </div>
        );
      })}
    </div>
  );
}