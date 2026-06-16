import { useState, useEffect, useRef } from "react";
import { Phone, AlertTriangle, ArrowLeftRight, Check } from "lucide-react";

const STEPS = [
  {
    icon: Phone,
    label: "Patient calling",
    bg: "#FCEBEB", border: "#F09595", iconColor: "#A32D2D",
  },
  {
    icon: AlertTriangle,
    label: "Yael detects",
    bg: "#FDF3E0", border: "#FAC775", iconColor: "#8A5A00",
  },
  {
    icon: ArrowLeftRight,
    label: "Transferring",
    bg: "#EEF2FF", border: "#A5B4FC", iconColor: "#3730A3",
  },
  {
    icon: Check,
    label: "Resolved",
    bg: "#EAF3DE", border: "#97C459", iconColor: "#27500A",
  },
];

const STEP_DELAY = 900;
const FINAL_PAUSE = 1500;
const TOTAL = STEPS.length * STEP_DELAY + FINAL_PAUSE;

const CIRCLE = 36;
const CONNECTOR_W = 40;

export default function DeescalationTransfer() {
  const [progress, setProgress] = useState(0);
  const rafRef = useRef(null);
  const startRef = useRef(null);

  useEffect(() => {
    const run = (ts) => {
      if (!startRef.current) startRef.current = ts;
      const elapsed = ts - startRef.current;

      if (elapsed >= TOTAL) {
        startRef.current = ts;
        setProgress(0);
      } else {
        setProgress(elapsed);
      }

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

  // Connector fill progress with eased curve
  const connectorProgress = [0, 1, 2].map((i) => {
    const drawStart = (i + 1) * STEP_DELAY - 600;
    const drawEnd = (i + 1) * STEP_DELAY;
    if (progress < drawStart) return 0;
    if (progress >= drawEnd) return 1;
    const t = (progress - drawStart) / (drawEnd - drawStart);
    return 1 - Math.pow(1 - t, 3);
  });

  // Traveling dot offset along each connector
  const dotOffset = [0, 1, 2].map((i) => {
    if (connectorProgress[i] <= 0.02) return -1;
    if (connectorProgress[i] >= 0.99) return CONNECTOR_W;
    return connectorProgress[i] * CONNECTOR_W;
  });

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: "0px",
        padding: "20px 10px",
        width: "100%",
        maxWidth: "520px",
        margin: "0 auto",
      }}
    >
      {STEPS.map((step, i) => {
        const Icon = step.icon;
        const state = stepsState[i];
        const isActive = state > 0;
        const isAnimating = state > 0 && state < 1;
        const isLast = i === STEPS.length - 1;

        const scale = isAnimating
          ? 1 + 0.15 * Math.sin(state * Math.PI)
          : isActive
            ? 1
            : 0.92;

        return (
          <div key={i} style={{ display: "flex", alignItems: "center", gap: "0px" }}>
            {/* Step node */}
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: "8px",
                flexShrink: 0,
              }}
            >
              {/* Circle */}
              <div
                style={{
                  width: CIRCLE,
                  height: CIRCLE,
                  borderRadius: "50%",
                  background: isActive ? step.bg : "#F1F5F9",
                  border: `2px solid ${isActive ? step.border : "#E2E8F0"}`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  transform: `scale(${scale})`,
                  transition:
                    "transform 0.3s ease, background 0.3s ease, border-color 0.3s ease",
                  boxShadow: isActive ? `0 0 14px ${step.border}44` : "none",
                }}
              >
                <Icon
                  size={14}
                  strokeWidth={2.2}
                  color={isActive ? step.iconColor : "#CBD5E1"}
                  style={{ transition: "color 0.3s ease" }}
                />
              </div>

              {/* Label */}
              <span
                style={{
                  fontFamily: "Inter, sans-serif",
                  fontWeight: isActive ? 600 : 400,
                  fontSize: "9px",
                  color: isActive ? "#0D0D0D" : "#CBD5E1",
                  textAlign: "center",
                  lineHeight: 1.3,
                  maxWidth: "64px",
                  transition: "color 0.3s ease, font-weight 0.3s ease",
                }}
              >
                {step.label}
              </span>
            </div>

            {/* Connector line */}
            {!isLast && (
              <div
                style={{
                  width: CONNECTOR_W,
                  height: "3px",
                  borderRadius: "2px",
                  position: "relative",
                  overflow: "visible",
                  flexShrink: 0,
                  marginBottom: "20px",
                }}
              >
                {/* Dashed unfilled track */}
                <svg
                  width={CONNECTOR_W}
                  height="3"
                  style={{ position: "absolute", top: 0, left: 0 }}
                >
                  <line
                    x1="0" y1="1.5"
                    x2={CONNECTOR_W} y2="1.5"
                    stroke="#E5E7EB"
                    strokeWidth="3"
                    strokeLinecap="round"
                    strokeDasharray={connectorProgress[i] >= 0.99 ? "none" : "5 4"}
                  />
                </svg>

                {/* Filled gradient portion */}
                <svg
                  width={CONNECTOR_W}
                  height="3"
                  style={{ position: "absolute", top: 0, left: 0 }}
                >
                  <defs>
                    <linearGradient id={`grad-${i}`} x1="0" y1="0" x2="1" y2="0">
                      <stop offset="0%" stopColor={STEPS[i].border} stopOpacity="1" />
                      <stop offset="100%" stopColor={STEPS[i + 1].border} stopOpacity="1" />
                    </linearGradient>
                    <filter id={`glow-${i}`}>
                      <feGaussianBlur stdDeviation="1.5" result="blur" />
                      <feMerge>
                        <feMergeNode in="blur" />
                        <feMergeNode in="SourceGraphic" />
                      </feMerge>
                    </filter>
                  </defs>
                  {connectorProgress[i] > 0 && (
                    <line
                      x1="0" y1="1.5"
                      x2={Math.min(connectorProgress[i] * CONNECTOR_W, CONNECTOR_W)}
                      y2="1.5"
                      stroke={`url(#grad-${i})`}
                      strokeWidth="3"
                      strokeLinecap="round"
                      filter={`url(#glow-${i})`}
                    />
                  )}
                </svg>

                {/* Traveling dot at leading edge */}
                {dotOffset[i] >= 0 && dotOffset[i] <= CONNECTOR_W && (
                  <div
                    style={{
                      position: "absolute",
                      top: "50%",
                      left: dotOffset[i],
                      transform: "translate(-50%, -50%)",
                      width: "8px",
                      height: "8px",
                      borderRadius: "50%",
                      background: STEPS[i + 1].border,
                      boxShadow: `0 0 10px 2px ${STEPS[i + 1].border}88`,
                      transition: "left 0.05s linear",
                    }}
                  />
                )}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}