import { useState, useEffect, useRef } from "react";
import { Phone, AlertTriangle, ArrowLeftRight, Check } from "lucide-react";

const STEPS = [
  { icon: Phone, label: "Patient calling", bg: "#FCEBEB", border: "#F09595", iconColor: "#A32D2D" },
  { icon: AlertTriangle, label: "Yael detects", bg: "#FDF3E0", border: "#FAC775", iconColor: "#8A5A00" },
  { icon: ArrowLeftRight, label: "Transferring", bg: "#EEF2FF", border: "#A5B4FC", iconColor: "#3730A3" },
  { icon: Check, label: "Resolved", bg: "#EAF3DE", border: "#97C459", iconColor: "#27500A" },
];

const STEP_DELAY = 900;
const FINAL_PAUSE = 1500;
const TOTAL = 4 * STEP_DELAY + FINAL_PAUSE;

const CIRCLE = 36;
const GAP = 28;
const SEG = CIRCLE + GAP;    // 64
const LINE_Y = CIRCLE / 2;   // 18

// Circle center X positions
const CX = [LINE_Y, LINE_Y + SEG, LINE_Y + 2 * SEG, LINE_Y + 3 * SEG]; // 18, 82, 146, 210
const SVG_W = CX[3] + LINE_Y + 4;  // 210 + 18 + 4 = 232  (padding at ends)
const SVG_H = CIRCLE + 32;          // 68
const LINE_X1 = CX[0];
const LINE_X2 = CX[3];
const LINE_LEN = LINE_X2 - LINE_X1; // 192

// Gradient stops
const GRADIENT_STOPS = STEPS.map((s, i) => ({
  offset: i / 3,
  color: s.border,
}));

export default function DeescalationTransfer() {
  const [progress, setProgress] = useState(0);
  const rafRef = useRef(null);
  const startRef = useRef(null);

  useEffect(() => {
    const run = (ts) => {
      if (!startRef.current) startRef.current = ts;
      const elapsed = ts - startRef.current;
      if (elapsed >= TOTAL) { startRef.current = ts; setProgress(0); }
      else { setProgress(elapsed); }
      rafRef.current = requestAnimationFrame(run);
    };
    rafRef.current = requestAnimationFrame(run);
    return () => cancelAnimationFrame(rafRef.current);
  }, []);

  // Per-step activation (0→1)
  const stepsState = STEPS.map((_, i) => {
    const start = i * STEP_DELAY;
    const end = start + STEP_DELAY;
    if (progress < start) return 0;
    if (progress >= end) return 1;
    return (progress - start) / STEP_DELAY;
  });

  // Filled width of the line
  const filled =
    progress >= 3 * STEP_DELAY
      ? LINE_LEN
      : Math.min(LINE_LEN, Math.floor(progress / STEP_DELAY) * SEG + ((progress % STEP_DELAY) / STEP_DELAY) * SEG);

  return (
    <svg
      width={SVG_W}
      height={SVG_H}
      viewBox={`0 0 ${SVG_W} ${SVG_H}`}
      style={{ display: "block", margin: "0 auto" }}
    >
      <defs>
        <linearGradient id="dl-grad" x1={LINE_X1} y1="0" x2={LINE_X2} y2="0" gradientUnits="userSpaceOnUse">
          {GRADIENT_STOPS.map((s) => (
            <stop key={s.offset} offset={s.offset} stopColor={s.color} />
          ))}
        </linearGradient>

        {/* Clip path for the animated fill */}
        <clipPath id="dl-clip">
          <rect x={LINE_X1} y={LINE_Y - 2} width={filled} height={4} />
        </clipPath>
      </defs>

      {/* ── Background track ── */}
      <line
        x1={LINE_X1} y1={LINE_Y}
        x2={LINE_X2} y2={LINE_Y}
        stroke="#E5E7EB"
        strokeWidth="3"
        strokeLinecap="round"
      />

      {/* ── Colored fill line ── */}
      <line
        x1={LINE_X1} y1={LINE_Y}
        x2={LINE_X2} y2={LINE_Y}
        stroke="url(#dl-grad)"
        strokeWidth="3"
        strokeLinecap="round"
        clipPath="url(#dl-clip)"
      />

      {/* ── Leading edge dot ── */}
      {filled > 0 && (
        <circle
          cx={LINE_X1 + filled}
          cy={LINE_Y}
          r={3.5}
          fill="url(#dl-grad)"
          style={{ transition: "none" }}
        />
      )}

      {/* ── Circles + labels ── */}
      {STEPS.map((step, i) => {
        const state = stepsState[i];
        const active = state > 0;
        const animating = state > 0 && state < 1;
        const scale = animating ? 1 + 0.12 * Math.sin(state * Math.PI) : active ? 1 : 0.92;
        const r = CIRCLE / 2;
        const cy = LINE_Y;

        return (
          <g key={i} transform={`translate(${CX[i]}, ${cy})`}>
            {/* Circle bg */}
            <circle
              r={r}
              fill={active ? step.bg : "#F1F5F9"}
              stroke={active ? step.border : "#E2E8F0"}
              strokeWidth="2"
              style={{
                transformOrigin: "center",
                transform: `scale(${scale})`,
                transition: "transform 0.3s ease, fill 0.3s ease, stroke 0.3s ease",
              }}
            />

            {/* Icon via foreignObject */}
            <foreignObject x={-7} y={-7} width={14} height={14}>
              <div style={{ width: 14, height: 14, display: "flex", alignItems: "center", justifyContent: "center" }}>
                {(() => {
                  const I = step.icon;
                  return <I size={14} strokeWidth={2.2} color={active ? step.iconColor : "#CBD5E1"} style={{ transition: "color 0.3s ease" }} />;
                })()}
              </div>
            </foreignObject>

            {/* Label */}
            <text
              y={r + 14}
              textAnchor="middle"
              style={{
                fontFamily: "Inter, sans-serif",
                fontWeight: active ? 600 : 400,
                fontSize: "9px",
                fill: active ? "#0D0D0D" : "#CBD5E1",
                transition: "fill 0.3s ease, font-weight 0.3s ease",
              }}
            >
              {step.label}
            </text>
          </g>
        );
      })}
    </svg>
  );
}