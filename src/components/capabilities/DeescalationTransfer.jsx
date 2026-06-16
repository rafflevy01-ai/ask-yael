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

const D = 36;
const G = 64;
const SEG = D + G;
const CX = [D / 2, D / 2 + SEG, D / 2 + 2 * SEG, D / 2 + 3 * SEG];
const SVG_W = CX[3] + D / 2;

const FILL_TARGETS = [0, 0, SEG, 2 * SEG, 3 * SEG];

export default function DeescalationTransfer() {
  const [activeStep, setActiveStep] = useState(0);
  const [fillWidth, setFillWidth] = useState(0);
  const [phase, setPhase] = useState(0);

  useEffect(() => {
    if (phase >= 4) {
      const t = setTimeout(() => {
        setActiveStep(0);
        setPhase(0);
        setFillWidth(0);
      }, FINAL_PAUSE);
      return () => clearTimeout(t);
    }

    const t = setTimeout(() => {
      const next = phase + 1;
      setActiveStep(next);
      setPhase(next);
      setFillWidth(FILL_TARGETS[next]);
    }, STEP_DELAY);
    return () => clearTimeout(t);
  }, [phase]);

  return (
    <div style={{ display: "flex", justifyContent: "center", width: "100%" }}>
      <div style={{ position: "relative", width: SVG_W, height: D }}>
        <svg width={SVG_W} height={D} style={{ overflow: "visible" }}>
          <defs>
            <linearGradient id="lg" x1={CX[0]} y1="0" x2={CX[3]} y2="0" gradientUnits="userSpaceOnUse">
              <stop offset="0" stopColor={STEPS[0].border} />
              <stop offset="0.333" stopColor={STEPS[1].border} />
              <stop offset="0.667" stopColor={STEPS[2].border} />
              <stop offset="1" stopColor={STEPS[3].border} />
            </linearGradient>
            <clipPath id="fc">
              <rect x={CX[0]} y={D / 2 - 1.5} width={fillWidth} height={3} />
            </clipPath>
          </defs>

          <line x1={CX[0]} y1={D / 2} x2={CX[3]} y2={D / 2} stroke="#E5E7EB" strokeWidth="2" strokeLinecap="round" />

          <line x1={CX[0]} y1={D / 2} x2={CX[3]} y2={D / 2} stroke="url(#lg)" strokeWidth="2" strokeLinecap="round"
            clipPath="url(#fc)" style={{ transition: "all 0.7s ease" }} />

          {STEPS.map((step, i) => (
            <circle key={i} cx={CX[i]} cy={D / 2} r={D / 2}
              fill={(i < activeStep) ? step.bg : "#F1F5F9"}
              stroke={(i < activeStep) ? step.border : "#E2E8F0"} strokeWidth="2"
              style={{
                transition: "all 0.3s ease",
                transformOrigin: `${CX[i]}px ${D / 2}px`,
                transform: (i < activeStep) ? "scale(1)" : "scale(0.92)",
              }} />
          ))}
        </svg>

        {/* Icons over circles */}
        {STEPS.map((step, i) => {
          const Icon = step.icon;
          const active = i < activeStep;
          return (
            <Icon key={`ic${i}`} size={14} strokeWidth={2.2}
              color={active ? step.iconColor : "#CBD5E1"}
              style={{ position: "absolute", left: CX[i] - 7, top: (D - 14) / 2,
                transition: "color 0.3s ease", pointerEvents: "none" }} />
          );
        })}

        {/* Labels between circles */}
        {STEPS.map((step, i) => {
          const active = i < activeStep;
          const isLast = i === STEPS.length - 1;
          const labelX = isLast ? CX[i] + D / 2 + 10 : (CX[i] + CX[i + 1]) / 2;

          return (
            <span key={`lb${i}`}
              style={{
                position: "absolute",
                left: labelX,
                top: (D - 14) / 2,
                transform: isLast ? "none" : "translateX(-50%)",
                fontFamily: "Inter, sans-serif",
                fontWeight: active ? 600 : 400,
                fontSize: "11px",
                color: active ? "#0D0D0D" : "#CBD5E1",
                whiteSpace: "nowrap",
                transition: "all 0.3s ease",
                pointerEvents: "none",
              }}>
              {step.label}
            </span>
          );
        })}
      </div>
    </div>
  );
}