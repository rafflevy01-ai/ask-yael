import { useState, useEffect, useRef } from "react";
import { Phone, AlertTriangle, ArrowLeftRight, Check } from "lucide-react";

const STEPS = [
  {
    icon: Phone, label: "Patient calling", subtitle: "Frustrated",
    bg: "#FCEBEB", border: "#F09595", iconColor: "#A32D2D",
  },
  {
    icon: AlertTriangle, label: "Yael detects", subtitle: "Sentiment alert",
    bg: "#FDF3E0", border: "#FAC775", iconColor: "#8A5A00",
  },
  {
    icon: ArrowLeftRight, label: "Transferring", subtitle: "To Dr. Cohen",
    bg: "#EEF2FF", border: "#A5B4FC", iconColor: "#3730A3",
  },
  {
    icon: Check, label: "Resolved", subtitle: "Staff connected",
    bg: "#EAF3DE", border: "#97C459", iconColor: "#27500A",
  },
];

// Step activation times (ms)
const ACTIVATION_TIMES = [0, 300, 1250, 2200, 3150];
const FINAL_PAUSE = 2000;
const TOTAL = ACTIVATION_TIMES[4] + FINAL_PAUSE; // 5150
const DRAW_DURATION = 700;

// Geometry
const CIRCLE_D = 36;
const GAP = 32;
const SEG = CIRCLE_D + GAP; // 68
const CX = [CIRCLE_D / 2, CIRCLE_D / 2 + SEG, CIRCLE_D / 2 + 2 * SEG, CIRCLE_D / 2 + 3 * SEG];
const LINE_X1 = CX[0];  // 18
const LINE_X2 = CX[3];  // 222
const LINE_LEN = LINE_X2 - LINE_X1; // 204
const ROW_W = LINE_X2 + CIRCLE_D / 2; // 240

export default function DeescalationTransfer() {
  const [activeIndex, setActiveIndex] = useState(0); // 0 = none active, 1-4 = step active
  const [fillPx, setFillPx] = useState(0);
  const animRef = useRef(null);
  const startRef = useRef(null);
  const targetFillRef = useRef(0);

  // Progress loop
  useEffect(() => {
    const run = (ts) => {
      if (!startRef.current) startRef.current = ts;
      const elapsed = ts - startRef.current;
      if (elapsed >= TOTAL) {
        startRef.current = ts;
        setActiveIndex(0);
        targetFillRef.current = 0;
        setFillPx(0);
      } else {
        // Determine which step is active
        let idx = 0;
        for (let i = 1; i <= 4; i++) {
          if (elapsed >= ACTIVATION_TIMES[i]) idx = i;
        }
        setActiveIndex(idx);

        // Target fill: circle center for step idx
        // step 0 → 0, step 1 → CX[0] - LINE_X1 = 0, step 2 → CX[1] - LINE_X1, etc
        targetFillRef.current = idx === 0 ? 0 : CX[idx - 1] - LINE_X1;
      }
      animRef.current = requestAnimationFrame(run);
    };
    animRef.current = requestAnimationFrame(run);
    return () => cancelAnimationFrame(animRef.current);
  }, []);

  // Smooth fill interpolation
  useEffect(() => {
    let raf;
    const lerp = () => {
      setFillPx((prev) => {
        const target = targetFillRef.current;
        if (Math.abs(prev - target) < 0.3) return target;
        // Duration-based interpolation: converge in ~DRAW_DURATION from any distance
        const step = (target - prev) / (DRAW_DURATION / 16);
        return prev + step;
      });
      raf = requestAnimationFrame(lerp);
    };
    raf = requestAnimationFrame(lerp);
    return () => cancelAnimationFrame(raf);
  }, []);

  return (
    <div style={{ position: "relative", width: ROW_W, margin: "0 auto", paddingTop: 20 }}>
      {/* ── Line track (SVG behind circles) ── */}
      <svg
        width={ROW_W}
        height={CIRCLE_D}
        style={{ position: "absolute", top: 20, left: 0, zIndex: 0, overflow: "visible" }}
      >
        <defs>
          <linearGradient id="t-grad" x1={LINE_X1} y1="0" x2={LINE_X2} y2="0" gradientUnits="userSpaceOnUse">
            <stop offset="0" stopColor={STEPS[0].border} />
            <stop offset="0.333" stopColor={STEPS[1].border} />
            <stop offset="0.667" stopColor={STEPS[2].border} />
            <stop offset="1" stopColor={STEPS[3].border} />
          </linearGradient>
          <clipPath id="t-clip">
            <rect x={LINE_X1} y={CIRCLE_D / 2 - 1.5} width={fillPx} height={3} />
          </clipPath>
        </defs>

        {/* Gray track */}
        <line
          x1={LINE_X1} y1={CIRCLE_D / 2} x2={LINE_X2} y2={CIRCLE_D / 2}
          stroke="#E5E7EB" strokeWidth="2" strokeLinecap="round"
        />

        {/* Colored fill */}
        <line
          x1={LINE_X1} y1={CIRCLE_D / 2} x2={LINE_X2} y2={CIRCLE_D / 2}
          stroke="url(#t-grad)" strokeWidth="2" strokeLinecap="round"
          clipPath="url(#t-clip)"
        />
      </svg>

      {/* ── Circles + labels ── */}
      <div style={{ display: "flex", gap: `${GAP}px`, position: "relative", zIndex: 1 }}>
        {STEPS.map((step, i) => {
          const active = i < activeIndex; // true when this step has activated
          const Icon = step.icon;

          return (
            <div key={i} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 6, flexShrink: 0 }}>
              {/* Circle */}
              <div
                style={{
                  width: CIRCLE_D, height: CIRCLE_D, borderRadius: "50%",
                  background: active ? step.bg : "#F1F5F9",
                  border: `2px solid ${active ? step.border : "#E2E8F0"}`,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  transform: `scale(${active ? 1.08 : 0.92})`,
                  transition: "transform 0.35s ease, background 0.35s ease, border-color 0.35s ease",
                }}
              >
                <Icon
                  size={14}
                  strokeWidth={2.2}
                  color={active ? step.iconColor : "#CBD5E1"}
                  style={{ transition: "color 0.35s ease" }}
                />
              </div>

              {/* Label */}
              <span
                style={{
                  fontFamily: "Inter, sans-serif",
                  fontWeight: active ? 600 : 400,
                  fontSize: "10px",
                  color: active ? "#0D0D0D" : "#CBD5E1",
                  textAlign: "center",
                  lineHeight: 1.2,
                  transition: "color 0.35s ease, font-weight 0.35s ease",
                }}
              >
                {step.label}
              </span>

              {/* Subtitle */}
              <span
                style={{
                  fontFamily: "Inter, sans-serif",
                  fontWeight: 400,
                  fontSize: "9px",
                  color: active ? "#888888" : "#CBD5E1",
                  textAlign: "center",
                  lineHeight: 1.2,
                  opacity: active ? 1 : 0,
                  transition: "opacity 0.35s ease, color 0.35s ease",
                }}
              >
                {step.subtitle}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}