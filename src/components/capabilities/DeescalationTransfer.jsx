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
const ROW_WIDTH = 4 * CIRCLE + 3 * GAP;   // 228
const LINE_Y = CIRCLE / 2;                  // 18
const LINE_START = LINE_Y;                  // 18
const LINE_END = ROW_WIDTH - LINE_Y;        // 210
const LINE_LENGTH = LINE_END - LINE_START;  // 192

// Gradient stop positions as fractions of LINE_LENGTH
const SEG = CIRCLE + GAP; // 64px between circle centers
const STOPS = STEPS.map((_, i) => ({ offset: (i === 0 ? 0 : (i * SEG) / LINE_LENGTH), color: STEPS[i].border }));

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

  // Fill width grows from circle 1 center to circle 4 center
  const getFilledWidth = () => {
    if (progress >= 3 * STEP_DELAY) return LINE_LENGTH;
    const seg = Math.floor(progress / STEP_DELAY);
    const segProgress = (progress % STEP_DELAY) / STEP_DELAY;
    return seg * SEG + segProgress * SEG;
  };
  const filledWidth = getFilledWidth();

  return (
    <div style={{ position: "relative", width: ROW_WIDTH, margin: "0 auto", padding: "20px 0" }}>

      {/* Continuous line behind all circles */}
      <svg width={ROW_WIDTH} height={CIRCLE} style={{ position: "absolute", top: 20, left: 0, zIndex: 0 }}>
        <defs>
          <linearGradient id="line-fill" x1="0" y1="0" x2="1" y2="0">
            {STOPS.map((s) => (
              <stop key={s.offset} offset={s.offset} stopColor={s.color} />
            ))}
          </linearGradient>
        </defs>

        {/* Background track (full length, light gray) */}
        <line
          x1={LINE_START} y1={LINE_Y}
          x2={LINE_END} y2={LINE_Y}
          stroke="#E5E7EB"
          strokeWidth="2"
        />

        {/* Colored fill (clips to filledWidth via a clipPath) */}
        {filledWidth > 0 && (
          <>
            <clipPath id="fill-clip">
              <rect x={LINE_START} y={0} width={filledWidth} height={CIRCLE} />
            </clipPath>
            <line
              x1={LINE_START} y1={LINE_Y}
              x2={LINE_END} y2={LINE_Y}
              stroke="url(#line-fill)"
              strokeWidth="2"
              clipPath="url(#fill-clip)"
            />
          </>
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
            ? 1 + 0.12 * Math.sin(state * Math.PI)
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