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

// SVG geometry
const D = 36;                     // circle diameter
const G = 36;                     // gap between circle edges
const STEP = D + G;              // 72px center-to-center
const CX = [D / 2, D / 2 + STEP, D / 2 + 2 * STEP, D / 2 + 3 * STEP]; // [18, 90, 162, 234]
const SVG_W = CX[3] + D / 2;     // 252
const SVG_H = D + 30;            // room for labels below

const FILL_TARGETS = [0, 0, STEP, 2 * STEP, 3 * STEP]; // fill width per active step

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
      <div style={{ position: "relative", width: SVG_W, height: SVG_H + 48 }}>
        <svg width={SVG_W} height={SVG_H} style={{ overflow: "visible" }}>
          <defs>
            <linearGradient id="lineGrad" x1={CX[0]} y1="0" x2={CX[3]} y2="0" gradientUnits="userSpaceOnUse">
              <stop offset="0" stopColor={STEPS[0].border} />
              <stop offset="0.333" stopColor={STEPS[1].border} />
              <stop offset="0.667" stopColor={STEPS[2].border} />
              <stop offset="1" stopColor={STEPS[3].border} />
            </linearGradient>
            <clipPath id="fillClip">
              <rect x={CX[0]} y={D / 2 - 1.5} width={fillWidth} height={3} />
            </clipPath>
          </defs>

          {/* Background track line */}
          <line
            x1={CX[0]} y1={D / 2} x2={CX[3]} y2={D / 2}
            stroke="#E5E7EB" strokeWidth="2" strokeLinecap="round"
          />

          {/* Colored fill line */}
          <line
            x1={CX[0]} y1={D / 2} x2={CX[3]} y2={D / 2}
            stroke="url(#lineGrad)" strokeWidth="2" strokeLinecap="round"
            clipPath="url(#fillClip)"
            style={{ transition: "all 0.7s ease" }}
          />

          {/* Circles */}
          {STEPS.map((step, i) => {
            const isActive = i < activeStep;
            return (
              <g key={i}>
                <circle
                  cx={CX[i]} cy={D / 2} r={D / 2}
                  fill={isActive ? step.bg : "#F1F5F9"}
                  stroke={isActive ? step.border : "#E2E8F0"}
                  strokeWidth="2"
                  style={{
                    transition: "all 0.3s ease",
                    transformOrigin: `${CX[i]}px ${D / 2}px`,
                    transform: isActive ? "scale(1)" : "scale(0.92)",
                  }}
                />
              </g>
            );
          })}
        </svg>

        {/* Icons and labels (positioned absolutely over the circles) */}
        {STEPS.map((step, i) => {
          const isActive = i < activeStep;
          const Icon = step.icon;
          return (
            <div
              key={i}
              style={{
                position: "absolute",
                left: CX[i] - D / 2,
                top: 0,
                width: D,
                display: "flex", flexDirection: "column", alignItems: "center",
              }}
            >
              {/* Icon inside circle */}
              <div style={{
                width: D, height: D,
                display: "flex", alignItems: "center", justifyContent: "center",
                pointerEvents: "none",
              }}>
                <Icon
                  size={14} strokeWidth={2.2}
                  color={isActive ? step.iconColor : "#CBD5E1"}
                  style={{ transition: "color 0.3s ease" }}
                />
              </div>

              {/* Label */}
              <span style={{
                fontFamily: "Inter, sans-serif", fontWeight: isActive ? 600 : 400,
                fontSize: "9px", color: isActive ? "#0D0D0D" : "#CBD5E1",
                textAlign: "center", lineHeight: 1.3, marginTop: 6,
                transition: "all 0.3s ease",
              }}>
                {step.label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}