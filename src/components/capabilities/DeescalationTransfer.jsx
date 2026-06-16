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

const ROW_WIDTH = 4 * CIRCLE + 3 * GAP;     // 228
const LINE_START = CIRCLE / 2;               // 18
const LINE_END = ROW_WIDTH - CIRCLE / 2;     // 210
const LINE_LENGTH = LINE_END - LINE_START;   // 192
const SEGMENT = CIRCLE + GAP;               // 64 (distance between circle centers)

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

  const stepsState = STEPS.map((_, i) => {
    const start = i * STEP_DELAY;
    const end = start + STEP_DELAY;
    if (progress < start) return 0;
    if (progress >= end) return 1;
    return (progress - start) / STEP_DELAY;
  });

  // Fill width of the line, growing from circle 1 center to circle 4 center
  let filledWidth = 0;
  if (progress >= 3 * STEP_DELAY) {
    filledWidth = LINE_LENGTH;
  } else {
    const seg = Math.floor(progress / STEP_DELAY);
    const segProgress = (progress % STEP_DELAY) / STEP_DELAY;
    filledWidth = seg * SEGMENT + segProgress * SEGMENT;
  }

  return (
    <div style={{ position: "relative", width: ROW_WIDTH, margin: "0 auto", padding: "20px 0" }}>

      {/* Continuous line behind all circles */}
      <svg
        width={ROW_WIDTH}
        height={CIRCLE}
        style={{ position: "absolute", top: 20, left: 0, zIndex: 0 }}
      >
        {/* Unfilled track */}
        <line
          x1={LINE_START} y1={CIRCLE / 2}
          x2={LINE_END} y2={CIRCLE / 2}
          stroke="#E5E7EB"
          strokeWidth="2"
          strokeLinecap="round"
        />
        {/* Filled portion */}
        {filledWidth > 0 && (
          <line
            x1={LINE_START} y1={CIRCLE / 2}
            x2={LINE_START + filledWidth} y2={CIRCLE / 2}
            stroke="#0D0D0D"
            strokeWidth="2"
            strokeLinecap="round"
          />
        )}
      </svg>

      {/* Circles row */}
      <div
        style={{
          position: "relative", zIndex: 1,
          display: "flex", alignItems: "flex-start", gap: `${GAP}px`,
        }}
      >
        {STEPS.map((step, i) => {
          const Icon = step.icon;
          const state = stepsState[i];
          const isActive = state > 0;
          const isAnimating = state > 0 && state < 1;

          const scale = isAnimating
            ? 1 + 0.15 * Math.sin(state * Math.PI)
            : isActive ? 1 : 0.92;

          return (
            <div key={i} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "8px", flexShrink: 0 }}>
              <div
                style={{
                  width: CIRCLE, height: CIRCLE, borderRadius: "50%",
                  background: isActive ? step.bg : "#F1F5F9",
                  border: `2px solid ${isActive ? step.border : "#E2E8F0"}`,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  transform: `scale(${scale})`,
                  transition: "transform 0.3s ease, background 0.3s ease, border-color 0.3s ease",
                }}
              >
                <Icon size={14} strokeWidth={2.2} color={isActive ? step.iconColor : "#CBD5E1"} style={{ transition: "color 0.3s ease" }} />
              </div>
              <span style={{
                fontFamily: "Inter, sans-serif", fontWeight: isActive ? 600 : 400,
                fontSize: "9px", color: isActive ? "#0D0D0D" : "#CBD5E1",
                textAlign: "center", lineHeight: 1.3, maxWidth: "64px",
                transition: "color 0.3s ease, font-weight 0.3s ease",
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